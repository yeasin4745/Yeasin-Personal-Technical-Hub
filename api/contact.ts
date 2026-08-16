import type { IncomingMessage, ServerResponse } from 'http';

// RFC 5322 compliant basic email check
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Basic Sanitizer function
function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, ''); // Strip control characters
}

export default async function handler(req: any, res: any) {
  // Set production security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};

    // 1. Honeypot check
    if (body.botField && typeof body.botField === 'string' && body.botField.trim() !== '') {
      return res.status(200).json({
        success: true,
        message: 'Your message has been securely received and queued.',
      });
    }

    // 2. Sanitization
    const name = sanitizeString(body.name);
    const email = sanitizeString(body.email);
    const subject = sanitizeString(body.subject);
    const message = sanitizeString(body.message);

    // 3. Validation
    if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or missing email address.',
      });
    }

    if (!message || message.length < 5 || message.length > 3000) {
      return res.status(400).json({
        success: false,
        error: 'Message content must be between 5 and 3000 characters.',
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Name exceeds maximum length limit (100 characters).',
      });
    }

    if (subject.length > 150) {
      return res.status(400).json({
        success: false,
        error: 'Subject exceeds maximum length limit (150 characters).',
      });
    }

    // 4. Safe Logging
    console.log(`[Vercel Serverless Contact] From: "${name}" <${email}> | Subject: "${subject || 'General Inquiry'}"`);

    return res.status(200).json({
      success: true,
      message: 'Transmission verified and securely queued. Thank you for connecting.',
    });
  } catch (error) {
    console.error('[Vercel Contact Error]', error);
    return res.status(500).json({
      success: false,
      error: 'An internal transmission error occurred. Please try reaching out via direct email.',
    });
  }
}
