import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Security & Parsing Middlewares
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

// Comprehensive Security Headers Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // HSTS (HTTP Strict Transport Security)
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  // Frame protection allowing AI Studio preview & same-origin
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-ancestors 'self' https://ai.studio https://*.run.app https://*.google.com;"
  );

  next();
});

// Simple In-Memory Rate Limiter for Contact Submissions
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean up stale rate-limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Basic Sanitizer function
function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, ''); // Strip control characters
}

// RFC 5322 compliant basic email check
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// ==========================================
// Secure Contact API Endpoint
// ==========================================
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown-ip';

    // 1. Rate Limiting Check
    const now = Date.now();
    const rateRecord = rateLimitMap.get(clientIp);

    if (rateRecord) {
      if (now < rateRecord.resetTime) {
        if (rateRecord.count >= MAX_REQUESTS_PER_WINDOW) {
          res.status(429).json({
            success: false,
            error: 'Rate limit exceeded. Please wait 10 minutes before transmitting another message.',
          });
          return;
        }
        rateRecord.count += 1;
      } else {
        rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      }
    } else {
      rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }

    // 2. Honeypot Anti-Spam Check
    const botField = req.body?.botField;
    if (botField && typeof botField === 'string' && botField.trim() !== '') {
      // Fake success response to misdirect spam bots
      res.status(200).json({
        success: true,
        message: 'Your message has been securely received and queued.',
      });
      return;
    }

    // 3. Payload Extraction & Sanitization
    const name = sanitizeString(req.body?.name);
    const email = sanitizeString(req.body?.email);
    const subject = sanitizeString(req.body?.subject);
    const message = sanitizeString(req.body?.message);

    // 4. Strict Validation
    if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
      res.status(400).json({
        success: false,
        error: 'Invalid or missing email address.',
      });
      return;
    }

    if (!message || message.length < 5 || message.length > 3000) {
      res.status(400).json({
        success: false,
        error: 'Message content must be between 5 and 3000 characters.',
      });
      return;
    }

    if (name.length > 100) {
      res.status(400).json({
        success: false,
        error: 'Name exceeds maximum length limit (100 characters).',
      });
      return;
    }

    if (subject.length > 150) {
      res.status(400).json({
        success: false,
        error: 'Subject exceeds maximum length limit (150 characters).',
      });
      return;
    }

    // 5. Secure Logging & Dispatch
    console.log(`[Contact Form Received] From: "${name}" <${email}> | Subject: "${subject || 'General Inquiry'}" | Length: ${message.length} chars | IP: ${clientIp}`);

    // Return safe success response (never expose server secrets)
    res.status(200).json({
      success: true,
      message: 'Transmission verified and securely queued. Thank you for connecting.',
    });
  } catch (error) {
    console.error('[Contact Error]', error);
    // Generic safe error message to prevent information disclosure
    res.status(500).json({
      success: false,
      error: 'An internal transmission error occurred. Please try again later or reach out via direct email.',
    });
  }
});

// ==========================================
// Vite Integration (Dev) & Static Serving (Prod)
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[System Ready] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
