export interface ContactSubmissionPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  botField?: string;
  renderedAt?: number;
}

export interface ClientMetadata {
  ipAddress: string;
  ipType: 'IPv4' | 'IPv6' | 'Local' | 'Unknown';
  userAgent: string;
  browser: string;
  browserVersion: string;
  operatingSystem: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot/CLI' | 'Unknown';
  preferredLanguage: string;
  sourceWebsite: string;
  requestPath: string;
  referrer: string;
  origin: string;
  host: string;
  protocol: string;
  submissionTimeUtc: string;
  submissionTimeFormatted: string;
  location: CoarseLocation;
}

export interface CoarseLocation {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
  isAvailable: boolean;
}

export interface SecuritySignals {
  rateLimitStatus: string;
  botHoneypotStatus: string;
  submissionTimingStatus: string;
  requestValidationStatus: string;
  riskAssessment: 'LOW' | 'MEDIUM' | 'ELEVATED';
  detectedIndicators: string[];
  isDuplicate: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedPayload?: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
}

export interface ContactProcessResult {
  statusCode: number;
  success: boolean;
  message?: string;
  error?: string;
  messageId?: string;
}
