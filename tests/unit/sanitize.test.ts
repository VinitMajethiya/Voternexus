import { describe, it, expect } from 'vitest';
import { sanitizeText, cleanPdfText } from '@/lib/sanitize';

describe('sanitizeText', () => {
  it('redacts a standard Aadhaar number', () => {
    const input = 'My Aadhaar is 1234 5678 9012';
    expect(sanitizeText(input)).not.toContain('1234 5678 9012');
    expect(sanitizeText(input)).toContain('[REDACTED_ID]');
  });

  it('redacts a hyphenated Aadhaar number', () => {
    const input = 'ID: 1234-5678-9012';
    expect(sanitizeText(input)).toContain('[REDACTED_ID]');
  });

  it('redacts an Indian mobile phone number', () => {
    const input = 'Call me at 9876543210';
    expect(sanitizeText(input)).not.toContain('9876543210');
    expect(sanitizeText(input)).toContain('[REDACTED_PHONE]');
  });

  it('redacts a phone number with +91 prefix', () => {
    const input = 'Phone: +91 9876543210';
    expect(sanitizeText(input)).toContain('[REDACTED_PHONE]');
  });

  it('redacts a PAN card number', () => {
    const input = 'PAN: ABCDE1234F';
    expect(sanitizeText(input)).not.toContain('ABCDE1234F');
    expect(sanitizeText(input)).toContain('[REDACTED_PAN]');
  });

  it('does not modify clean text with no PII', () => {
    const input = 'This is a normal sentence about voting.';
    expect(sanitizeText(input)).toBe(input);
  });

  it('handles empty string gracefully', () => {
    expect(sanitizeText('')).toBe('');
  });

  it('handles redacting multiple PII items in one string', () => {
    const input = 'Aadhaar 1234 5678 9012, PAN ABCDE1234F, Phone 9876543210';
    const result = sanitizeText(input);
    expect(result).toContain('[REDACTED_ID]');
    expect(result).toContain('[REDACTED_PAN]');
    expect(result).toContain('[REDACTED_PHONE]');
  });
});

describe('cleanPdfText', () => {
  it('collapses multiple spaces into one', () => {
    expect(cleanPdfText('hello   world')).toBe('hello world');
  });

  it('trims leading and trailing whitespace', () => {
    expect(cleanPdfText('  hello  ')).toBe('hello');
  });

  it('removes non-printable ASCII characters', () => {
    // \x00 is a null byte — common in raw PDF text
    const input = 'hello\x00world';
    expect(cleanPdfText(input)).toBe('helloworld');
  });

  it('preserves normal alphanumeric and punctuation', () => {
    const input = 'Candidate: Rahul. Assets: ₹1,00,000';
    // Non-ASCII chars like ₹ will be stripped, rest preserved
    expect(cleanPdfText(input)).toContain('Candidate: Rahul.');
  });
});
