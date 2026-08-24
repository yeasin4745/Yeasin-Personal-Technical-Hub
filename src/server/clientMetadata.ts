import { ClientMetadata, CoarseLocation } from './types';

// Generic Request interface matching both Express.js Request and standard Node/Vercel IncomingMessage
export interface RequestLike {
  headers: Record<string, string | string[] | undefined>;
  url?: string;
  originalUrl?: string;
  method?: string;
  socket?: {
    remoteAddress?: string;
    encrypted?: boolean;
  };
  protocol?: string;
}

/**
 * Extracts a single header value safely as a trimmed string
 */
export function getHeader(req: RequestLike, headerName: string): string {
  const name = headerName.toLowerCase();
  const val = req.headers[name] || req.headers[headerName];
  if (Array.isArray(val)) {
    return val[0]?.trim() || '';
  }
  return typeof val === 'string' ? val.trim() : '';
}

/**
 * Validates IPv4 or IPv6 format
 */
function validateIpFormat(ip: string): { isValid: boolean; type: 'IPv4' | 'IPv6' | 'Local' | 'Unknown' } {
  if (!ip || ip === 'unknown' || ip === 'unknown-ip') {
    return { isValid: false, type: 'Unknown' };
  }

  // Strip port if present (e.g. 192.168.1.1:8080 or [2001:db8::1]:8080)
  let cleanIp = ip.trim();
  if (cleanIp.startsWith('[') && cleanIp.includes(']')) {
    cleanIp = cleanIp.slice(1, cleanIp.indexOf(']'));
  } else if (cleanIp.includes(':') && cleanIp.split(':').length === 2 && !cleanIp.includes('::')) {
    cleanIp = cleanIp.split(':')[0];
  }

  if (cleanIp === '127.0.0.1' || cleanIp === '::1' || cleanIp === 'localhost') {
    return { isValid: true, type: 'Local' };
  }

  // IPv4 regex (0.0.0.0 - 255.255.255.255)
  const ipv4Regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
  if (ipv4Regex.test(cleanIp)) {
    return { isValid: true, type: 'IPv4' };
  }

  // IPv6 regex
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$/;
  if (ipv6Regex.test(cleanIp) || cleanIp.includes(':')) {
    return { isValid: true, type: 'IPv6' };
  }

  return { isValid: false, type: 'Unknown' };
}

/**
 * Server-side trusted client IP extraction
 * Priority: Platform-specific trusted proxy headers -> X-Forwarded-For leftmost valid IP -> socket remote address
 */
export function extractClientIp(req: RequestLike): { ipAddress: string; ipType: 'IPv4' | 'IPv6' | 'Local' | 'Unknown' } {
  // 1. Vercel trusted IP headers
  const vercelForwardedFor = getHeader(req, 'x-vercel-forwarded-for');
  if (vercelForwardedFor) {
    const candidate = vercelForwardedFor.split(',')[0].trim();
    const check = validateIpFormat(candidate);
    if (check.isValid) return { ipAddress: candidate, ipType: check.type };
  }

  // 2. Cloudflare trusted header
  const cfConnectingIp = getHeader(req, 'cf-connecting-ip');
  if (cfConnectingIp) {
    const check = validateIpFormat(cfConnectingIp);
    if (check.isValid) return { ipAddress: cfConnectingIp, ipType: check.type };
  }

  // 3. Real-IP header
  const realIp = getHeader(req, 'x-real-ip');
  if (realIp) {
    const check = validateIpFormat(realIp);
    if (check.isValid) return { ipAddress: realIp, ipType: check.type };
  }

  // 4. Standard X-Forwarded-For header (leftmost IP)
  const forwardedFor = getHeader(req, 'x-forwarded-for');
  if (forwardedFor) {
    const parts = forwardedFor.split(',').map((p) => p.trim());
    for (const part of parts) {
      const check = validateIpFormat(part);
      if (check.isValid && check.type !== 'Local') {
        return { ipAddress: part, ipType: check.type };
      }
    }
    // If all are local or only first exists
    if (parts.length > 0) {
      const check = validateIpFormat(parts[0]);
      if (check.isValid) return { ipAddress: parts[0], ipType: check.type };
    }
  }

  // 5. Socket remote address fallback
  const socketAddress = req.socket?.remoteAddress || '';
  if (socketAddress) {
    let cleanSocket = socketAddress;
    if (cleanSocket.startsWith('::ffff:')) {
      cleanSocket = cleanSocket.replace('::ffff:', '');
    }
    const check = validateIpFormat(cleanSocket);
    if (check.isValid) return { ipAddress: cleanSocket, ipType: check.type };
  }

  return { ipAddress: 'Unavailable', ipType: 'Unknown' };
}

/**
 * Parses User-Agent header to determine Browser, OS, and Device Category
 */
export function parseUserAgent(uaString: string): {
  browser: string;
  browserVersion: string;
  operatingSystem: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot/CLI' | 'Unknown';
} {
  if (!uaString || uaString.trim() === '') {
    return {
      browser: 'Unavailable / Unspecified',
      browserVersion: '',
      operatingSystem: 'Unavailable',
      deviceType: 'Unknown',
    };
  }

  const ua = uaString.trim();

  // 1. Bot & CLI Tools detection
  if (/curl|postman|insomnia|wget|python-requests|axios|node-fetch|got|go-http-client|bot|crawler|spider|slurp|facebookexternalhit/i.test(ua)) {
    let botName = 'Automated Agent / Script';
    if (/curl/i.test(ua)) botName = 'cURL CLI';
    else if (/postman/i.test(ua)) botName = 'Postman API Client';
    else if (/python-requests/i.test(ua)) botName = 'Python Requests';
    else if (/insomnia/i.test(ua)) botName = 'Insomnia REST Client';
    else if (/wget/i.test(ua)) botName = 'Wget CLI';
    else if (/googlebot/i.test(ua)) botName = 'Googlebot Crawler';

    return {
      browser: botName,
      browserVersion: '',
      operatingSystem: 'CLI / Headless Environment',
      deviceType: 'Bot/CLI',
    };
  }

  // 2. Device Type detection
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot/CLI' | 'Unknown' = 'Desktop';
  if (/iPad|Tablet|(Android(?!.*Mobile))/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/Mobile|iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    deviceType = 'Mobile';
  }

  // 3. Operating System detection
  let operatingSystem = 'Unknown OS';
  if (/Windows NT 10\.0/i.test(ua)) operatingSystem = 'Windows 10 / 11';
  else if (/Windows NT 6\.3/i.test(ua)) operatingSystem = 'Windows 8.1';
  else if (/Windows NT 6\.1/i.test(ua)) operatingSystem = 'Windows 7';
  else if (/Windows/i.test(ua)) operatingSystem = 'Windows';
  else if (/Mac OS X 10[._]\d+([._]\d+)?/i.test(ua) || /Macintosh/i.test(ua)) {
    const match = ua.match(/Mac OS X (10[._\d]+)/i);
    operatingSystem = match ? `macOS (${match[1].replace(/_/g, '.')})` : 'macOS';
  } else if (/iPhone OS ([\d_]+)/i.test(ua)) {
    const match = ua.match(/iPhone OS ([\d_]+)/i);
    operatingSystem = match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS';
  } else if (/iPad.*OS ([\d_]+)/i.test(ua)) {
    const match = ua.match(/OS ([\d_]+)/i);
    operatingSystem = match ? `iPadOS ${match[1].replace(/_/g, '.')}` : 'iPadOS';
  } else if (/Android ([\d.]+)/i.test(ua)) {
    const match = ua.match(/Android ([\d.]+)/i);
    operatingSystem = match ? `Android ${match[1]}` : 'Android';
  } else if (/CrOS/i.test(ua)) {
    operatingSystem = 'ChromeOS';
  } else if (/Ubuntu/i.test(ua)) {
    operatingSystem = 'Ubuntu Linux';
  } else if (/Fedora/i.test(ua)) {
    operatingSystem = 'Fedora Linux';
  } else if (/Debian/i.test(ua)) {
    operatingSystem = 'Debian Linux';
  } else if (/Linux/i.test(ua)) {
    operatingSystem = 'Linux';
  }

  // 4. Browser detection
  let browser = 'Unknown Browser';
  let browserVersion = '';

  if (/Edg\/([\d.]+)/i.test(ua)) {
    const match = ua.match(/Edg\/([\d.]+)/i);
    browser = 'Microsoft Edge';
    browserVersion = match ? match[1] : '';
  } else if (/OPR\/([\d.]+)/i.test(ua) || /Opera\/([\d.]+)/i.test(ua)) {
    const match = ua.match(/(?:OPR|Opera)\/([\d.]+)/i);
    browser = 'Opera';
    browserVersion = match ? match[1] : '';
  } else if (/Brave/i.test(ua)) {
    browser = 'Brave';
  } else if (/SamsungBrowser\/([\d.]+)/i.test(ua)) {
    const match = ua.match(/SamsungBrowser\/([\d.]+)/i);
    browser = 'Samsung Internet';
    browserVersion = match ? match[1] : '';
  } else if (/Chrome\/([\d.]+)/i.test(ua)) {
    const match = ua.match(/Chrome\/([\d.]+)/i);
    browser = 'Google Chrome';
    browserVersion = match ? match[1] : '';
  } else if (/Firefox\/([\d.]+)/i.test(ua)) {
    const match = ua.match(/Firefox\/([\d.]+)/i);
    browser = 'Mozilla Firefox';
    browserVersion = match ? match[1] : '';
  } else if (/Version\/([\d.]+).*Safari/i.test(ua)) {
    const match = ua.match(/Version\/([\d.]+).*Safari/i);
    browser = 'Apple Safari';
    browserVersion = match ? match[1] : '';
  } else if (/Safari/i.test(ua)) {
    browser = 'Safari';
  }

  return {
    browser,
    browserVersion,
    operatingSystem,
    deviceType,
  };
}

/**
 * Extracts approximate coarse geolocation metadata from hosting platform headers.
 * Never extracts precise GPS coordinates or street addresses.
 */
export function extractCoarseLocation(req: RequestLike): CoarseLocation {
  // 1. Country
  const countryCode =
    getHeader(req, 'x-vercel-ip-country') ||
    getHeader(req, 'cf-ipcountry') ||
    getHeader(req, 'x-country-code') ||
    getHeader(req, 'x-client-geo-country') ||
    '';

  // 2. Region / State
  const regionRaw =
    getHeader(req, 'x-vercel-ip-country-region') ||
    getHeader(req, 'cf-region') ||
    getHeader(req, 'x-region') ||
    getHeader(req, 'x-client-geo-region') ||
    '';

  // 3. City
  const cityRaw =
    getHeader(req, 'x-vercel-ip-city') ||
    getHeader(req, 'cf-ipcity') ||
    getHeader(req, 'x-city') ||
    getHeader(req, 'x-client-geo-city') ||
    '';

  // 4. Timezone
  const timezone =
    getHeader(req, 'x-vercel-ip-timezone') ||
    getHeader(req, 'cf-timezone') ||
    getHeader(req, 'x-timezone') ||
    '';

  let region = regionRaw ? decodeURIComponent(regionRaw) : 'Unavailable';
  let city = cityRaw ? decodeURIComponent(cityRaw) : 'Unavailable';

  const isAvailable = Boolean(countryCode || (region && region !== 'Unavailable') || (city && city !== 'Unavailable'));

  return {
    country: countryCode ? countryCode.toUpperCase() : 'Unavailable',
    countryCode: countryCode ? countryCode.toUpperCase() : '',
    region: region || 'Unavailable',
    city: city || 'Unavailable',
    timezone: timezone || 'Unavailable',
    isAvailable,
  };
}

/**
 * Known trusted source website allowlist & dynamic origin resolver
 */
const TRUSTED_ORIGINS_ALLOWLIST = [
  'https://yeasin4745-dev.vercel.app',
  'https://yeasin4745-node.vercel.app',
  'https://yeasin4745.dev',
  'https://yeasin.dev',
];

/**
 * Resolves the source website dynamically from request metadata & safe environment configuration.
 * Avoids hardcoding any incorrect static origin.
 */
export function resolveSourceWebsite(req: RequestLike): {
  sourceWebsite: string;
  origin: string;
  host: string;
  protocol: string;
} {
  const originHeader = getHeader(req, 'origin');
  const refererHeader = getHeader(req, 'referer');
  const forwardedHost = getHeader(req, 'x-forwarded-host');
  const hostHeader = forwardedHost || getHeader(req, 'host') || 'yeasin4745-dev.vercel.app';
  
  const forwardedProto = getHeader(req, 'x-forwarded-proto');
  const protocol = forwardedProto ? forwardedProto.split(',')[0].trim() : req.socket?.encrypted ? 'https' : 'https';

  // Check if Origin matches any trusted production origin
  if (originHeader) {
    for (const trusted of TRUSTED_ORIGINS_ALLOWLIST) {
      if (originHeader.toLowerCase() === trusted.toLowerCase() || originHeader.toLowerCase() === `${trusted.toLowerCase()}/`) {
        return {
          sourceWebsite: trusted,
          origin: originHeader,
          host: hostHeader,
          protocol,
        };
      }
    }
    // Check if origin matches vercel or run.app preview domains
    if (/\.vercel\.app$/i.test(originHeader) || /\.run\.app$/i.test(originHeader) || /localhost|127\.0\.0\.1/i.test(originHeader)) {
      return {
        sourceWebsite: originHeader.replace(/\/+$/, ''),
        origin: originHeader,
        host: hostHeader,
        protocol,
      };
    }
  }

  // Check Referer header
  if (refererHeader) {
    try {
      const parsedUrl = new URL(refererHeader);
      const originFromReferer = parsedUrl.origin;
      for (const trusted of TRUSTED_ORIGINS_ALLOWLIST) {
        if (originFromReferer.toLowerCase() === trusted.toLowerCase()) {
          return {
            sourceWebsite: trusted,
            origin: originFromReferer,
            host: parsedUrl.host,
            protocol: parsedUrl.protocol.replace(':', ''),
          };
        }
      }
      if (/\.vercel\.app$/i.test(originFromReferer) || /\.run\.app$/i.test(originFromReferer) || /localhost|127\.0\.0\.1/i.test(originFromReferer)) {
        return {
          sourceWebsite: originFromReferer,
          origin: originFromReferer,
          host: parsedUrl.host,
          protocol: parsedUrl.protocol.replace(':', ''),
        };
      }
    } catch {
      // ignore invalid referer URL parsing
    }
  }

  // Check environment variables (e.g. APP_URL, VITE_SITE_URL, SITE_URL)
  const envUrl = process.env.APP_URL || process.env.VITE_SITE_URL || process.env.SITE_URL;
  if (envUrl && envUrl.trim() !== '') {
    const cleanEnvUrl = envUrl.trim().replace(/\/+$/, '');
    return {
      sourceWebsite: cleanEnvUrl,
      origin: originHeader || cleanEnvUrl,
      host: hostHeader,
      protocol,
    };
  }

  // Dynamic host fallback
  const dynamicOrigin = `${protocol}://${hostHeader}`;
  return {
    sourceWebsite: dynamicOrigin,
    origin: originHeader || dynamicOrigin,
    host: hostHeader,
    protocol,
  };
}

/**
 * Extracts formatted Preferred Language from Accept-Language header
 */
export function extractPreferredLanguage(req: RequestLike): string {
  const acceptLang = getHeader(req, 'accept-language');
  if (!acceptLang) return 'Unavailable';
  
  // Format primary language tags (e.g. 'en-US,en;q=0.9,bn;q=0.8') -> 'en-US (Primary)'
  const primaryLang = acceptLang.split(',')[0].trim();
  return primaryLang || 'Unavailable';
}

/**
 * Aggregates complete Client & Request Metadata safely
 */
export function extractClientMetadata(req: RequestLike): ClientMetadata {
  const { ipAddress, ipType } = extractClientIp(req);
  const userAgentString = getHeader(req, 'user-agent');
  const uaParsed = parseUserAgent(userAgentString);
  const location = extractCoarseLocation(req);
  const sourceInfo = resolveSourceWebsite(req);
  const preferredLanguage = extractPreferredLanguage(req);
  const referrer = getHeader(req, 'referer') || 'None / Direct Navigation';
  const requestPath = req.originalUrl || req.url || '/api/contact';

  const now = new Date();
  const submissionTimeUtc = now.toISOString();
  const submissionTimeFormatted = now.toUTCString();

  return {
    ipAddress,
    ipType,
    userAgent: userAgentString || 'Unavailable',
    browser: uaParsed.browserVersion ? `${uaParsed.browser} ${uaParsed.browserVersion}` : uaParsed.browser,
    browserVersion: uaParsed.browserVersion,
    operatingSystem: uaParsed.operatingSystem,
    deviceType: uaParsed.deviceType,
    preferredLanguage,
    sourceWebsite: sourceInfo.sourceWebsite,
    requestPath,
    referrer,
    origin: sourceInfo.origin,
    host: sourceInfo.host,
    protocol: sourceInfo.protocol,
    submissionTimeUtc,
    submissionTimeFormatted,
    location,
  };
}
