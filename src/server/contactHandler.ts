import { RequestLike, extractClientMetadata, getHeader } from './clientMetadata';
import {
  validateContactSubmission,
  checkRateLimits,
  checkAndRecordDuplicate,
  evaluateSecuritySignals,
} from './security';
import { dispatchContactEmail } from './resendDelivery';
import { ContactProcessResult } from './types';

// Response writer abstraction
export interface ResponseLike {
  setHeader(name: string, value: string | string[]): this | void;
  status(code: number): this;
  json(body: unknown): this | void;
  send?(body: unknown): this | void;
  end?(): this | void;
}

/**
 * Validates request Origin / Referer for safe CORS handling
 */
function handleCorsAndHeaders(req: RequestLike, res: ResponseLike): boolean {
  // Set fundamental security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  const origin = getHeader(req, 'origin');
  if (origin) {
    const isAllowed =
      /https:\/\/(?:[a-z0-9-]+\.)*vercel\.app$/i.test(origin) ||
      /https:\/\/(?:[a-z0-9-]+\.)*run\.app$/i.test(origin) ||
      /https:\/\/(?:www\.)?yeasin4745\.dev$/i.test(origin) ||
      /https:\/\/(?:www\.)?yeasin\.dev$/i.test(origin) ||
      /^http:\/\/localhost:\d+$/i.test(origin) ||
      /^http:\/\/127\.0\.0\.1:\d+$/i.test(origin);

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
      res.setHeader('Access-Control-Max-Age', '86400');
    }
  }

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(204);
    if (res.end) res.end();
    else if (res.send) res.send('');
    return true; // Terminate early
  }

  return false;
}

/**
 * Unified Contact Handler logic for both Express.js and Vercel Serverless
 */
export async function processContactRequest(
  req: RequestLike,
  res: ResponseLike,
  rawBody: unknown
): Promise<ContactProcessResult> {
  // 1. CORS and Security Headers
  const isPreflight = handleCorsAndHeaders(req, res);
  if (isPreflight) {
    return { statusCode: 204, success: true };
  }

  // 2. Strict HTTP Method Check
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    const result = {
      statusCode: 405,
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported on this endpoint.',
    };
    res.status(405).json(result);
    return result;
  }

  // 3. Content-Type Check
  const contentType = getHeader(req, 'content-type');
  if (contentType && !contentType.toLowerCase().includes('application/json')) {
    const result = {
      statusCode: 415,
      success: false,
      error: 'Unsupported Media Type. Expected Content-Type: application/json.',
    };
    res.status(415).json(result);
    return result;
  }

  try {
    // 4. Extract Server-Side Client & Request Metadata
    const metadata = extractClientMetadata(req);

    // 5. Server-Side Schema & Sanitization Validation
    const validation = validateContactSubmission(rawBody);
    if (!validation.isValid || !validation.sanitizedPayload) {
      const result = {
        statusCode: 400,
        success: false,
        error: validation.errors[0] || 'Invalid submission data.',
      };
      res.status(400).json(result);
      return result;
    }

    const { name, email, subject, message } = validation.sanitizedPayload;
    const bodyObj = rawBody as Record<string, unknown>;

    // 6. Layered Rate Limiting & Burst Protection
    const rateCheck = checkRateLimits(metadata.ipAddress, email);
    if (!rateCheck.isAllowed) {
      console.warn(`[Rate Limit Tripped] IP: ${metadata.ipAddress} | Email: ${email} | Reason: ${rateCheck.reason}`);
      const result = {
        statusCode: 429,
        success: false,
        error: 'Too many requests. Please try again later.',
      };
      res.status(429).json(result);
      return result;
    }

    // 7. Bot Honeypot Trap
    const botField = typeof bodyObj.botField === 'string' ? bodyObj.botField : '';
    if (botField && botField.trim() !== '') {
      console.warn(`[Bot Trap Activated] IP: ${metadata.ipAddress} | Trap Token: "${botField.slice(0, 20)}"`);
      // Silent 200 response to misdirect automated spam bots without sending email
      const result = {
        statusCode: 200,
        success: true,
        message: 'Message transmitted successfully.',
      };
      res.status(200).json(result);
      return result;
    }

    // 8. Submission Timing Delta Check
    const renderedAt = typeof bodyObj.renderedAt === 'number' ? bodyObj.renderedAt : 0;
    const now = Date.now();
    if (renderedAt > 0 && now - renderedAt < 1200) {
      console.warn(`[Automated Timing Trap] IP: ${metadata.ipAddress} | Duration: ${now - renderedAt}ms`);
      // Sub-second submission = automated script. Return 200 silently without dispatching email
      const result = {
        statusCode: 200,
        success: true,
        message: 'Message transmitted successfully.',
      };
      res.status(200).json(result);
      return result;
    }

    // 9. Duplicate Message Suppression
    const isDuplicate = checkAndRecordDuplicate(name, email, subject, message);
    if (isDuplicate) {
      console.info(`[Duplicate Suppressed] Duplicate submission from ${email} within 10-min window.`);
      // Return success idempotently without triggering duplicate outbound email
      const result = {
        statusCode: 200,
        success: true,
        message: 'Message transmitted successfully.',
      };
      res.status(200).json(result);
      return result;
    }

    // 10. Security Signals & Threat Analysis for Notification
    const signals = evaluateSecuritySignals(
      { name, email, subject, message, botField, renderedAt },
      metadata,
      rateCheck.statusText,
      isDuplicate
    );

    // 11. Transactional Email Dispatch via Resend
    const delivery = await dispatchContactEmail({
      name,
      email,
      subject,
      message,
      metadata,
      signals,
    });

    if (delivery.success) {
      const result = {
        statusCode: 200,
        success: true,
        message: 'Message transmitted successfully.',
        messageId: delivery.messageId,
      };
      res.status(200).json(result);
      return result;
    }

    // Delivery failure from provider
    const failureResult = {
      statusCode: delivery.statusCode || 502,
      success: false,
      error: delivery.error || 'Message delivery is temporarily unavailable. Please try again later.',
    };
    res.status(failureResult.statusCode).json(failureResult);
    return failureResult;
  } catch (err) {
    console.error('[Contact Controller Exception]', err);
    const result = {
      statusCode: 500,
      success: false,
      error: 'An internal transmission error occurred. Please try again later.',
    };
    res.status(500).json(result);
    return result;
  }
}
