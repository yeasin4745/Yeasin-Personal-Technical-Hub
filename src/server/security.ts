import crypto from 'crypto';
import { ContactSubmissionPayload, ValidationResult, SecuritySignals } from './types';
import { ClientMetadata } from './types';

// RFC 5322 compliant basic email check
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// In-Memory Rate Limiting Configuration
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_IP_REQUESTS_PER_WINDOW = 5;
const MAX_EMAIL_REQUESTS_PER_WINDOW = 3;
const MIN_BURST_INTERVAL_MS = 3000; // 3 seconds minimum between submissions from same IP

interface RateRecord {
  count: number;
  resetTime: number;
  lastRequestTime: number;
}

const ipRateLimitMap = new Map<string, RateRecord>();
const emailRateLimitMap = new Map<string, RateRecord>();

// Duplicate submission suppression cache (SHA-256 message fingerprint -> expires timestamp)
const duplicateCache = new Map<string, number>();
const DUPLICATE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Periodic cleanup of stale rate limits and duplicate fingerprints
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipRateLimitMap.entries()) {
      if (now > record.resetTime) ipRateLimitMap.delete(key);
    }
    for (const [key, record] of emailRateLimitMap.entries()) {
      if (now > record.resetTime) emailRateLimitMap.delete(key);
    }
    for (const [hash, expires] of duplicateCache.entries()) {
      if (now > expires) duplicateCache.delete(hash);
    }
  }, 5 * 60 * 1000);
}

/**
 * Sanitizes strings: Unicode NFC normalization, control character stripping, whitespace trimming
 */
export function sanitizeText(input: unknown, allowNewlines: boolean = false): string {
  if (typeof input !== 'string') return '';
  
  // 1. Unicode NFC normalization
  let normalized = input.normalize('NFC').trim();

  // 2. Strip HTML tags
  normalized = normalized.replace(/<[^>]*>?/gm, '');

  // 3. Strip dangerous control characters (preserve \n and \t if allowNewlines is true)
  if (allowNewlines) {
    normalized = normalized.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '');
  } else {
    normalized = normalized.replace(/[\u0000-\u001F\u007F]/g, '');
  }

  return normalized;
}

/**
 * HTML escape helper for secure rendering inside HTML email templates
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validates submission payload against strict server-side schema
 */
export function validateContactSubmission(rawBody: unknown): ValidationResult {
  const errors: string[] = [];

  if (!rawBody || typeof rawBody !== 'object') {
    return { isValid: false, errors: ['Invalid request payload. Expected JSON object.'] };
  }

  const payload = rawBody as Partial<ContactSubmissionPayload>;

  const name = sanitizeText(payload.name, false);
  const email = sanitizeText(payload.email, false).toLowerCase();
  const subject = sanitizeText(payload.subject, false);
  const message = sanitizeText(payload.message, true);

  // 1. Name validation
  if (!name || name.length < 2) {
    errors.push('Name is required (minimum 2 characters).');
  } else if (name.length > 100) {
    errors.push('Name exceeds maximum length limit (100 characters).');
  } else if (/[\r\n]/.test(payload.name as string)) {
    errors.push('Invalid name format (newlines not permitted).');
  }

  // 2. Email validation
  if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
    errors.push('A valid email address is required (RFC 5322 compliant).');
  } else if (/[\r\n]/.test(payload.email as string)) {
    errors.push('Invalid email format (CRLF injection detected).');
  }

  // 3. Subject validation
  if (!subject || subject.length < 2) {
    errors.push('Subject topic is required (minimum 2 characters).');
  } else if (subject.length > 150) {
    errors.push('Subject exceeds maximum length limit (150 characters).');
  } else if (/[\r\n]/.test(payload.subject as string)) {
    errors.push('Invalid subject format (newlines not permitted).');
  }

  // 4. Message validation
  if (!message || message.length < 10) {
    errors.push('Message content is required (minimum 10 characters).');
  } else if (message.length > 3000) {
    errors.push('Message exceeds maximum length limit (3000 characters).');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    sanitizedPayload: {
      name,
      email,
      subject,
      message,
    },
  };
}

/**
 * Checks and updates rate limits for IP and Email.
 * Returns true if allowed, false if rate limited.
 */
export function checkRateLimits(
  ip: string,
  email: string
): { isAllowed: boolean; reason?: string; statusText: string } {
  const now = Date.now();

  // 1. Check IP Rate Limit
  if (ip && ip !== 'Unavailable' && ip !== 'Local') {
    const ipRecord = ipRateLimitMap.get(ip);
    if (ipRecord) {
      // Check short burst interval
      if (now - ipRecord.lastRequestTime < MIN_BURST_INTERVAL_MS) {
        return {
          isAllowed: false,
          reason: 'Burst rate limit exceeded',
          statusText: 'BLOCKED (Burst interval too rapid)',
        };
      }

      if (now < ipRecord.resetTime) {
        if (ipRecord.count >= MAX_IP_REQUESTS_PER_WINDOW) {
          return {
            isAllowed: false,
            reason: 'IP rate limit exceeded',
            statusText: `BLOCKED (IP exceeded ${MAX_IP_REQUESTS_PER_WINDOW} reqs / 10 min)`,
          };
        }
        ipRecord.count += 1;
        ipRecord.lastRequestTime = now;
      } else {
        ipRateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS, lastRequestTime: now });
      }
    } else {
      ipRateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS, lastRequestTime: now });
    }
  }

  // 2. Check Email Rate Limit
  if (email) {
    const cleanEmail = email.toLowerCase().trim();
    const emailRecord = emailRateLimitMap.get(cleanEmail);
    if (emailRecord) {
      if (now < emailRecord.resetTime) {
        if (emailRecord.count >= MAX_EMAIL_REQUESTS_PER_WINDOW) {
          return {
            isAllowed: false,
            reason: 'Email rate limit exceeded',
            statusText: `BLOCKED (Email exceeded ${MAX_EMAIL_REQUESTS_PER_WINDOW} reqs / 10 min)`,
          };
        }
        emailRecord.count += 1;
        emailRecord.lastRequestTime = now;
      } else {
        emailRateLimitMap.set(cleanEmail, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS, lastRequestTime: now });
      }
    } else {
      emailRateLimitMap.set(cleanEmail, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS, lastRequestTime: now });
    }
  }

  const currentCount = ipRateLimitMap.get(ip)?.count || 1;
  return {
    isAllowed: true,
    statusText: `PASSED (Request ${currentCount} of ${MAX_IP_REQUESTS_PER_WINDOW} in 10-min window)`,
  };
}

/**
 * Checks for duplicate message submission via SHA-256 fingerprinting
 */
export function checkAndRecordDuplicate(
  name: string,
  email: string,
  subject: string,
  message: string
): boolean {
  const hash = crypto
    .createHash('sha256')
    .update(`${name.toLowerCase()}|${email.toLowerCase()}|${subject.toLowerCase()}|${message.trim()}`)
    .digest('hex');

  const now = Date.now();
  const existingExpiry = duplicateCache.get(hash);

  if (existingExpiry && now < existingExpiry) {
    return true; // Is duplicate
  }

  // Store fingerprint with TTL
  duplicateCache.set(hash, now + DUPLICATE_CACHE_TTL_MS);
  return false;
}

/**
 * Analyzes security signals, spam indicators, bot traps, and submission delta
 */
export function evaluateSecuritySignals(
  payload: ContactSubmissionPayload,
  clientMetadata: ClientMetadata,
  rateLimitStatusText: string,
  isDuplicate: boolean
): SecuritySignals {
  const indicators: string[] = [];
  let riskScore = 0;

  // 1. Honeypot check
  const botField = payload.botField;
  let botHoneypotStatus = 'PASSED (Honeypot trap clean)';
  if (botField && typeof botField === 'string' && botField.trim() !== '') {
    botHoneypotStatus = 'FLAGGED (Bot trap field populated)';
    indicators.push('Honeypot field populated by client');
    riskScore += 10;
  }

  // 2. Timing Delta check
  const now = Date.now();
  const formRenderTime = typeof payload.renderedAt === 'number' ? payload.renderedAt : 0;
  let timingStatus = 'Clean (No render timing marker provided)';

  if (formRenderTime > 0) {
    const elapsedMs = now - formRenderTime;
    if (elapsedMs < 1200) {
      timingStatus = `FLAGGED (Sub-human speed: ${(elapsedMs / 1000).toFixed(2)}s)`;
      indicators.push('Form submitted in < 1.2s from page render');
      riskScore += 5;
    } else if (elapsedMs > 24 * 60 * 60 * 1000) {
      timingStatus = 'Stale form render (> 24 hours)';
    } else {
      timingStatus = `PASSED (Human duration: ${(elapsedMs / 1000).toFixed(1)}s)`;
    }
  }

  // 3. User-Agent heuristics
  if (clientMetadata.deviceType === 'Bot/CLI') {
    indicators.push(`CLI / Automated User-Agent: ${clientMetadata.browser}`);
    riskScore += 3;
  }
  if (!clientMetadata.userAgent || clientMetadata.userAgent === 'Unavailable') {
    indicators.push('Missing User-Agent header');
    riskScore += 2;
  }

  // 4. Message content heuristics
  const rawMsg = payload.message || '';
  const urlMatches = rawMsg.match(/https?:\/\/[^\s]+/gi);
  if (urlMatches && urlMatches.length > 3) {
    indicators.push(`High URL count in message (${urlMatches.length} links)`);
    riskScore += 2;
  }

  if (/telegram|whatsapp|crypto|bitcoin|casino|viagra|pills|forex|guaranteed profit/i.test(rawMsg)) {
    indicators.push('Potential commercial/spam keywords present in message');
    riskScore += 1;
  }

  if (isDuplicate) {
    indicators.push('Duplicate message submission fingerprint detected');
  }

  // Risk classification
  let riskAssessment: 'LOW' | 'MEDIUM' | 'ELEVATED' = 'LOW';
  if (riskScore >= 6) {
    riskAssessment = 'ELEVATED';
  } else if (riskScore >= 2) {
    riskAssessment = 'MEDIUM';
  }

  return {
    rateLimitStatus: rateLimitStatusText,
    botHoneypotStatus,
    submissionTimingStatus: timingStatus,
    requestValidationStatus: 'PASSED (Strict RFC 5322 & length constraints met)',
    riskAssessment,
    detectedIndicators: indicators,
    isDuplicate,
  };
}
