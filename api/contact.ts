import type { IncomingMessage, ServerResponse } from 'http';

// RFC 5322 compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// In-Memory Rate Limiter for Serverless Instance
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Basic Sanitizer function
function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, ''); // Strip control characters
}

// HTML escape helper for email body safety
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown-ip';

    // 1. In-Memory Rate Limiting Check
    const now = Date.now();
    const rateRecord = rateLimitMap.get(clientIp);

    if (rateRecord) {
      if (now < rateRecord.resetTime) {
        if (rateRecord.count >= MAX_REQUESTS_PER_WINDOW) {
          return res.status(429).json({
            success: false,
            error: 'Rate limit exceeded. Please wait a few moments before transmitting another message.',
          });
        }
        rateRecord.count += 1;
      } else {
        rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      }
    } else {
      rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }

    const body = req.body || {};

    // 2. Honeypot Anti-Spam Check (Invisible bot trap field)
    const botField = body.botField;
    if (botField && typeof botField === 'string' && botField.trim() !== '') {
      // Fake success response to misdirect spam bots
      return res.status(200).json({
        success: true,
        message: 'Message transmitted successfully.',
      });
    }

    // 3. Submission Timing Delta Check (Trap instant automated POST submissions)
    const formRenderTime = typeof body.renderedAt === 'number' ? body.renderedAt : 0;
    if (formRenderTime > 0 && now - formRenderTime < 1200) {
      // Form submitted in under 1.2 seconds from render -> Automated spam bot
      return res.status(200).json({
        success: true,
        message: 'Message transmitted successfully.',
      });
    }

    // 4. Payload Extraction & Sanitization
    const name = sanitizeString(body.name);
    const email = sanitizeString(body.email);
    const subject = sanitizeString(body.subject);
    const message = sanitizeString(body.message);

    // 5. Strict Server-Side Validation
    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Name is required (minimum 2 characters).',
      });
    }
    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Name exceeds maximum length limit (100 characters).',
      });
    }

    if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
      return res.status(400).json({
        success: false,
        error: 'A valid email address is required.',
      });
    }

    if (!subject || subject.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Subject topic is required (minimum 2 characters).',
      });
    }
    if (subject.length > 150) {
      return res.status(400).json({
        success: false,
        error: 'Subject exceeds maximum length limit (150 characters).',
      });
    }

    if (!message || message.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required (minimum 10 characters).',
      });
    }
    if (message.length > 3000) {
      return res.status(400).json({
        success: false,
        error: 'Message exceeds maximum length limit (3000 characters).',
      });
    }

    // 6. Dynamic Server-Side Environment Variables (Configured in Vercel)
    const emailApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_EMAIL;
    const senderEmail = process.env.CONTACT_FROM_EMAIL;

    const plainTextContent = [
      'New Website Inquiry',
      '',
      'Name:',
      name,
      '',
      'Email:',
      email,
      '',
      'Subject:',
      subject,
      '',
      'Message:',
      message,
      '',
      'Website:',
      'https://yeasin4745-dev.vercel.app',
    ].join('\n');

    const htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; background-color: #0b101c; color: #e2e8f0; border-radius: 10px; border: 1px solid #1e293b;">
  <div style="border-bottom: 1px solid #1e293b; padding-bottom: 14px; margin-bottom: 18px;">
    <h2 style="color: #06b6d4; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">New Website Inquiry</h2>
    <span style="font-family: monospace; font-size: 11px; color: #64748b;">ORIGIN: yeasin4745-dev.vercel.app</span>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px;">
    <tr>
      <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; font-weight: 600; width: 80px;">Name:</td>
      <td style="padding: 6px 0; color: #f8fafc; font-size: 14px; font-weight: 600;">${escapeHtml(name)}</td>
    </tr>
    <tr>
      <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; font-weight: 600;">Email:</td>
      <td style="padding: 6px 0; font-size: 14px;"><a href="mailto:${escapeHtml(email)}" style="color: #38bdf8; text-decoration: none; font-family: monospace;">${escapeHtml(email)}</a></td>
    </tr>
    <tr>
      <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; font-weight: 600;">Subject:</td>
      <td style="padding: 6px 0; color: #f8fafc; font-size: 14px;">${escapeHtml(subject)}</td>
    </tr>
  </table>

  <div style="background-color: #070a12; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; margin-top: 10px;">
    <span style="display: block; font-size: 11px; font-weight: 700; font-family: monospace; color: #06b6d4; text-transform: uppercase; margin-bottom: 8px;">Message Payload:</span>
    <p style="white-space: pre-wrap; margin: 0; color: #f1f5f9; font-size: 13px; line-height: 1.6;">${escapeHtml(message)}</p>
  </div>

  <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b; font-family: monospace; display: flex; justify-content: space-between;">
    <span>Transmitted via Direct Inquiry Transmitter</span>
    <span>•</span>
    <a href="https://yeasin4745-dev.vercel.app" style="color: #06b6d4; text-decoration: none;">https://yeasin4745-dev.vercel.app</a>
  </div>
</div>
`.trim();

    if (emailApiKey && recipientEmail && senderEmail) {
      // Send transactional email via Resend REST API
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${emailApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: senderEmail,
          to: [recipientEmail],
          reply_to: email, // Sets sender email as reply-to for direct response
          subject: `[Website Inquiry] ${subject}`,
          text: plainTextContent,
          html: htmlContent,
        }),
      });

      if (!emailRes.ok) {
        const errorData = await emailRes.json().catch(() => null);
        console.error('[Email Provider Error]', errorData || emailRes.statusText);
        return res.status(502).json({
          success: false,
          error: 'Unable to deliver message at this time. Please try again or reach out directly via email.',
        });
      }

      console.log(`[Email Dispatched] To: ${recipientEmail} | From: "${name}" <${email}>`);
    } else {
      console.log(`[Contact Service Logged] From: "${name}" <${email}> | Subject: "${subject}" | (Note: Set RESEND_API_KEY, CONTACT_EMAIL, and CONTACT_FROM_EMAIL in Vercel to activate live email forwarding)`);
    }

    return res.status(200).json({
      success: true,
      message: 'Message transmitted successfully.',
    });
  } catch (error) {
    console.error('[Contact Handler Error]', error);
    return res.status(500).json({
      success: false,
      error: 'An internal transmission error occurred. Please try again later or reach out via direct email.',
    });
  }
}
