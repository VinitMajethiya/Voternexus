/**
 * Input sanitization utilities for VoterNexus.
 * Ensures no PII or sensitive data escapes to logs or third-party APIs.
 */

export function sanitizeText(text: string): string {
  if (!text) return '';

  // Redact potential Aadhaar Numbers (12 digits, often spaced or hyphenated)
  const aadhaarRegex = /\d{4}[ -]?\d{4}[ -]?\d{4}/g;
  
  // Redact potential Phone Numbers
  const phoneRegex = /(\+91[\-\s]?)?[6-9]\d{9}/g;

  // Redact potential PAN numbers
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/g;

  return text
    .replace(aadhaarRegex, '[REDACTED_ID]')
    .replace(phoneRegex, '[REDACTED_PHONE]')
    .replace(panRegex, '[REDACTED_PAN]');
}

export function cleanPdfText(text: string): string {
  // Remove excessive whitespace, non-printable characters, etc.
  return text
    .replace(/[^\x20-\x7E\n\r\t]/g, '') // Remove non-printable ASCII
    .replace(/\s+/g, ' ')               // Collapse whitespace
    .trim();
}
