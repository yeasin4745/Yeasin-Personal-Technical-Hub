import { ClientMetadata, SecuritySignals } from './types';
import { buildPlainTextEmail, buildHtmlEmail } from './emailTemplate';

interface DispatchEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  metadata: ClientMetadata;
  signals: SecuritySignals;
}

export interface DeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
  statusCode: number;
}

/**
 * Safely dispatches transactional contact notification email via Resend REST API
 */
export async function dispatchContactEmail({
  name,
  email,
  subject,
  message,
  metadata,
  signals,
}: DispatchEmailParams): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipientEmail = process.env.CONTACT_EMAIL?.trim();
  const senderEmail = process.env.CONTACT_FROM_EMAIL?.trim();

  // If environment variables are not configured (e.g. Local Dev or Preview sandbox)
  if (!apiKey || !recipientEmail || !senderEmail) {
    console.info(
      `[Contact Dev Log] Submission processed for ${name} <${email}> | Subject: "${subject}" | (Notice: Set RESEND_API_KEY, CONTACT_EMAIL, and CONTACT_FROM_EMAIL to activate live outbound delivery)`
    );
    return {
      success: true,
      statusCode: 200,
      messageId: `dev-simulated-${Date.now()}`,
    };
  }

  // Generate structured Plain Text and HTML content
  const plainText = buildPlainTextEmail({ name, email, subject, message, metadata, signals });
  const html = buildHtmlEmail({ name, email, subject, message, metadata, signals });

  // Safe subject header: strip any carriage returns or newlines to prevent email header injection
  const safeSubjectHeader = `[Website Inquiry] ${subject.replace(/[\r\n]+/g, ' ').trim()}`;

  // Use AbortController for network timeout safety (8 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'YeasinPortfolio-ContactRelay/2.0',
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [recipientEmail],
        reply_to: email, // Directly sets visitor's email for instant 1-click reply
        subject: safeSubjectHeader,
        text: plainText,
        html: html,
        headers: {
          'X-Entity-Ref-ID': `inquiry-${Date.now()}`,
          'X-Inquiry-Source': metadata.sourceWebsite,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseBody = await resendResponse.json().catch(() => null);

    // If Resend returns 200..299, it is confirmed successful
    if (resendResponse.ok && responseBody && responseBody.id) {
      console.info(`[Email Dispatched] Provider ID: ${responseBody.id} | Destination: ${recipientEmail} | From: "${name}" <${email}>`);
      return {
        success: true,
        statusCode: 200,
        messageId: responseBody.id,
      };
    }

    // Provider error handling (without leaking API keys or secrets)
    const providerErrorMessage = responseBody?.message || resendResponse.statusText || 'Email delivery failed';
    console.error(`[Resend Error ${resendResponse.status}]`, providerErrorMessage);

    return {
      success: false,
      statusCode: 502,
      error: 'Message transmission could not be completed by the email relay. Please try again or reach out directly.',
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorObj = err as Error;
    if (errorObj?.name === 'AbortError') {
      console.error('[Resend Timeout] Email delivery request timed out after 8s');
      return {
        success: false,
        statusCode: 504,
        error: 'Email delivery gateway timed out. Please try again or reach out directly.',
      };
    }

    console.error('[Resend Network Error]', errorObj?.message || 'Network exception');
    return {
      success: false,
      statusCode: 500,
      error: 'An internal transmission error occurred. Please try again later.',
    };
  }
}
