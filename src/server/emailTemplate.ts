import { ClientMetadata, SecuritySignals } from './types';
import { escapeHtml } from './security';

interface EmailTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  metadata: ClientMetadata;
  signals: SecuritySignals;
}

/**
 * Builds high-contrast, structured Plain Text email body
 */
export function buildPlainTextEmail({
  name,
  email,
  subject,
  message,
  metadata,
  signals,
}: EmailTemplateProps): string {
  const indicatorsText =
    signals.detectedIndicators.length > 0
      ? signals.detectedIndicators.map((ind) => `  - ${ind}`).join('\n')
      : '  - None detected (Clean request profile)';

  return [
    '==============================================================================',
    'SECURE CONTACT RELAY // NEW WEBSITE INQUIRY',
    `SOURCE: ${metadata.sourceWebsite}`,
    '==============================================================================',
    '',
    '[VISITOR MESSAGE]',
    `Name:     ${name}`,
    `Email:    ${email}`,
    `Subject:  ${subject}`,
    '',
    'Message Content:',
    '------------------------------------------------------------------------------',
    message,
    '------------------------------------------------------------------------------',
    '',
    '[REQUEST CONTEXT]',
    `Submission Time:  ${metadata.submissionTimeFormatted} (${metadata.submissionTimeUtc})`,
    `Source Website:   ${metadata.sourceWebsite}`,
    `Request Path:     ${metadata.requestPath}`,
    `Referrer:         ${metadata.referrer}`,
    `Origin Header:    ${metadata.origin}`,
    '',
    '[CLIENT INFORMATION]',
    `IP Address:       ${metadata.ipAddress} (${metadata.ipType}) [Private metadata]`,
    `Browser:          ${metadata.browser}`,
    `Operating System: ${metadata.operatingSystem}`,
    `Device Type:      ${metadata.deviceType}`,
    `Language:         ${metadata.preferredLanguage}`,
    `User-Agent:       ${metadata.userAgent}`,
    '',
    '[APPROXIMATE LOCATION (COARSE)]',
    `Country:          ${metadata.location.country}`,
    `Region / State:   ${metadata.location.region}`,
    `City:             ${metadata.location.city}`,
    `Timezone:         ${metadata.location.timezone}`,
    'Note: Coarse platform edge metadata only. No GPS or continuous tracking.',
    '',
    '[SECURITY & ABUSE SIGNALS]',
    `Risk Rating:      ${signals.riskAssessment}`,
    `Rate Limit:       ${signals.rateLimitStatus}`,
    `Bot / Honeypot:   ${signals.botHoneypotStatus}`,
    `Timing Delta:     ${signals.submissionTimingStatus}`,
    `Validation:       ${signals.requestValidationStatus}`,
    'Detected Signals:',
    indicatorsText,
    '',
    '==============================================================================',
    `Transmitted securely via ${metadata.sourceWebsite}`,
    '==============================================================================',
  ].join('\n');
}

/**
 * Builds responsive, dark-mode cybersecurity themed HTML email
 */
export function buildHtmlEmail({
  name,
  email,
  subject,
  message,
  metadata,
  signals,
}: EmailTemplateProps): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);
  const safeSourceWebsite = escapeHtml(metadata.sourceWebsite);
  const safeIp = escapeHtml(metadata.ipAddress);
  const safeBrowser = escapeHtml(metadata.browser);
  const safeOs = escapeHtml(metadata.operatingSystem);
  const safeDevice = escapeHtml(metadata.deviceType);
  const safeLanguage = escapeHtml(metadata.preferredLanguage);
  const safeUserAgent = escapeHtml(metadata.userAgent);
  const safePath = escapeHtml(metadata.requestPath);
  const safeReferrer = escapeHtml(metadata.referrer);
  const safeCountry = escapeHtml(metadata.location.country);
  const safeRegion = escapeHtml(metadata.location.region);
  const safeCity = escapeHtml(metadata.location.city);
  const safeTimezone = escapeHtml(metadata.location.timezone);

  const riskBadgeBg =
    signals.riskAssessment === 'ELEVATED'
      ? '#451a03; color: #f59e0b; border: 1px solid #d97706;'
      : signals.riskAssessment === 'MEDIUM'
      ? '#1e293b; color: #38bdf8; border: 1px solid #0284c7;'
      : '#064e3b; color: #34d399; border: 1px solid #059669;';

  const indicatorsHtml =
    signals.detectedIndicators.length > 0
      ? signals.detectedIndicators
          .map(
            (ind) =>
              `<li style="margin: 4px 0; color: #fcd34d; font-size: 12px; font-family: monospace;">${escapeHtml(
                ind
              )}</li>`
          )
          .join('')
      : '<li style="margin: 4px 0; color: #94a3b8; font-size: 12px; font-family: monospace;">None detected (Clean request profile)</li>';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Website Inquiry</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #070b14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; -webkit-font-smoothing: antialiased;">
  
  <table role="presentation" style="width: 100%; max-width: 660px; margin: 0 auto; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; border-collapse: separate; border-spacing: 0;">
    
    <!-- Top Header Banner -->
    <tr>
      <td style="padding: 24px 28px; background-color: #0d1527; border-bottom: 1px solid #1e293b;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td>
              <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #06b6d4; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">
                SECURE CONTACT RELAY
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
                New Website Inquiry
              </h1>
            </td>
            <td style="text-align: right; vertical-align: top;">
              <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 11px; font-weight: 600; background-color: #082f49; color: #38bdf8; border: 1px solid #0284c7;">
                ${safeSourceWebsite.replace(/^https?:\/\//, '')}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Main Content Body -->
    <tr>
      <td style="padding: 28px;">
        
        <!-- SECTION 1: VISITOR MESSAGE -->
        <div style="margin-bottom: 24px;">
          <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; border-bottom: 1px dashed #334155; padding-bottom: 6px;">
            [VISITOR MESSAGE]
          </div>

          <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; font-weight: 600; width: 90px;">Name:</td>
              <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; font-weight: 600;">Email:</td>
              <td style="padding: 6px 0; font-size: 14px;">
                <a href="mailto:${safeEmail}" style="color: #38bdf8; text-decoration: none; font-family: monospace; font-weight: 600;">
                  ${safeEmail}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; font-size: 13px; font-weight: 600;">Subject:</td>
              <td style="padding: 6px 0; color: #f8fafc; font-size: 14px; font-weight: 600;">${safeSubject}</td>
            </tr>
          </table>

          <div style="background-color: #060913; border: 1px solid #1e293b; border-radius: 8px; padding: 18px;">
            <div style="font-family: monospace; font-size: 10px; font-weight: 700; color: #06b6d4; text-transform: uppercase; margin-bottom: 8px;">
              Message Body:
            </div>
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.65; color: #f1f5f9; white-space: pre-wrap; word-break: break-word;">${safeMessage}</div>
          </div>
        </div>

        <!-- SECTION 2: REQUEST CONTEXT -->
        <div style="margin-bottom: 24px;">
          <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; border-bottom: 1px dashed #334155; padding-bottom: 6px;">
            [REQUEST CONTEXT]
          </div>

          <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: monospace;">
            <tr>
              <td style="padding: 4px 0; color: #94a3b8; width: 140px;">Submission Time:</td>
              <td style="padding: 4px 0; color: #cbd5e1;">${metadata.submissionTimeFormatted} <span style="color: #64748b;">(${metadata.submissionTimeUtc})</span></td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94a3b8;">Source Website:</td>
              <td style="padding: 4px 0; color: #38bdf8;"><a href="${safeSourceWebsite}" style="color: #38bdf8; text-decoration: none;">${safeSourceWebsite}</a></td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94a3b8;">Request Path:</td>
              <td style="padding: 4px 0; color: #cbd5e1;">${safePath}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94a3b8;">Referrer:</td>
              <td style="padding: 4px 0; color: #cbd5e1;">${safeReferrer}</td>
            </tr>
          </table>
        </div>

        <!-- SECTION 3: CLIENT INFORMATION -->
        <div style="margin-bottom: 24px;">
          <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; border-bottom: 1px dashed #334155; padding-bottom: 6px;">
            [CLIENT INFORMATION]
          </div>

          <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: monospace;">
            <tr>
              <td style="padding: 4px 0; color: #94a3b8; width: 140px;">IP Address:</td>
              <td style="padding: 4px 0; color: #e2e8f0;">
                <strong style="color: #ffffff;">${safeIp}</strong>
                <span style="color: #64748b; font-size: 11px; margin-left: 6px;">(${metadata.ipType}) [Private]</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94a3b8;">Browser:</td>
              <td style="padding: 4px 0; color: #cbd5e1;">${safeBrowser}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94a3b8;">Operating System:</td>
              <td style="padding: 4px 0; color: #cbd5e1;">${safeOs}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94a3b8;">Device Category:</td>
              <td style="padding: 4px 0; color: #cbd5e1;">${safeDevice}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94a3b8;">Preferred Language:</td>
              <td style="padding: 4px 0; color: #cbd5e1;">${safeLanguage}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94a3b8; vertical-align: top;">User-Agent:</td>
              <td style="padding: 4px 0; color: #64748b; font-size: 11px; word-break: break-all;">${safeUserAgent}</td>
            </tr>
          </table>
        </div>

        <!-- SECTION 4: APPROXIMATE LOCATION -->
        <div style="margin-bottom: 24px;">
          <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; border-bottom: 1px dashed #334155; padding-bottom: 6px;">
            [APPROXIMATE LOCATION (COARSE)]
          </div>

          <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: monospace;">
            <tr>
              <td style="padding: 4px 0; color: #94a3b8; width: 140px;">Country:</td>
              <td style="padding: 4px 0; color: #cbd5e1;">${safeCountry}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94a3b8;">Region / State:</td>
              <td style="padding: 4px 0; color: #cbd5e1;">${safeRegion}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94a3b8;">City:</td>
              <td style="padding: 4px 0; color: #cbd5e1;">${safeCity}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #94a3b8;">Timezone:</td>
              <td style="padding: 4px 0; color: #cbd5e1;">${safeTimezone}</td>
            </tr>
          </table>
          <div style="margin-top: 6px; font-size: 11px; color: #64748b; font-family: monospace;">
            * Approximate coarse location derived from hosting edge proxy headers. Zero GPS or persistent tracking.
          </div>
        </div>

        <!-- SECTION 5: SECURITY / ABUSE SIGNALS -->
        <div style="background-color: #070d1a; border: 1px solid #1e293b; border-radius: 8px; padding: 16px;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <tr>
              <td>
                <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #06b6d4; text-transform: uppercase;">
                  [SECURITY / ABUSE SIGNALS]
                </div>
              </td>
              <td style="text-align: right;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-family: monospace; font-size: 11px; font-weight: 700; background-color: ${riskBadgeBg}">
                  RISK: ${signals.riskAssessment}
                </span>
              </td>
            </tr>
          </table>

          <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: monospace; margin-bottom: 10px;">
            <tr>
              <td style="padding: 3px 0; color: #94a3b8; width: 140px;">Rate Limit:</td>
              <td style="padding: 3px 0; color: #cbd5e1;">${escapeHtml(signals.rateLimitStatus)}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; color: #94a3b8;">Bot / Honeypot:</td>
              <td style="padding: 3px 0; color: #cbd5e1;">${escapeHtml(signals.botHoneypotStatus)}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; color: #94a3b8;">Timing Delta:</td>
              <td style="padding: 3px 0; color: #cbd5e1;">${escapeHtml(signals.submissionTimingStatus)}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; color: #94a3b8;">Validation:</td>
              <td style="padding: 3px 0; color: #10b981;">${escapeHtml(signals.requestValidationStatus)}</td>
            </tr>
          </table>

          <div style="border-top: 1px solid #1e293b; padding-top: 8px; margin-top: 8px;">
            <div style="font-family: monospace; font-size: 11px; color: #94a3b8; margin-bottom: 4px;">Detected Threat Indicators:</div>
            <ul style="margin: 0; padding-left: 18px;">
              ${indicatorsHtml}
            </ul>
          </div>
        </div>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 18px 28px; background-color: #090f1d; border-top: 1px solid #1e293b; font-family: monospace; font-size: 11px; color: #64748b;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td>Transmitted via Direct Inquiry Transmitter</td>
            <td style="text-align: right;">
              <a href="${safeSourceWebsite}" style="color: #06b6d4; text-decoration: none;">${safeSourceWebsite}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>

</body>
</html>
`.trim();
}
