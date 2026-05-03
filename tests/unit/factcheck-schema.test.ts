import { describe, it, expect } from 'vitest';

/**
 * Fact-check response schema validation tests.
 * Tests that the Zod schema correctly validates API response shapes,
 * without making any real AI API calls.
 */
import { z } from 'zod';

const FactCheckResponseSchema = z.object({
  verdict: z.enum(['TRUE', 'PARTIALLY_TRUE', 'FALSE', 'UNVERIFIED', 'OPINION']),
  explanation: z.string(),
  confidence: z.number(),
  language_detected: z.string(),
});

const FactCheckRequestSchema = z.object({
  claim: z.string().min(10).max(500),
});

describe('FactCheck request schema', () => {
  it('accepts a valid claim', () => {
    const result = FactCheckRequestSchema.safeParse({ claim: 'Voting is mandatory in India for all citizens.' });
    expect(result.success).toBe(true);
  });

  it('rejects a claim shorter than 10 characters', () => {
    const result = FactCheckRequestSchema.safeParse({ claim: 'Short' });
    expect(result.success).toBe(false);
  });

  it('rejects a claim longer than 500 characters', () => {
    const longClaim = 'a'.repeat(501);
    const result = FactCheckRequestSchema.safeParse({ claim: longClaim });
    expect(result.success).toBe(false);
  });

  it('rejects missing claim field', () => {
    const result = FactCheckRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('accepts a claim of exactly 10 characters', () => {
    const result = FactCheckRequestSchema.safeParse({ claim: '1234567890' });
    expect(result.success).toBe(true);
  });

  it('accepts a claim of exactly 500 characters', () => {
    const claim = 'a'.repeat(500);
    const result = FactCheckRequestSchema.safeParse({ claim });
    expect(result.success).toBe(true);
  });
});

describe('FactCheck response schema', () => {
  it('validates a correct TRUE response', () => {
    const response = { verdict: 'TRUE', explanation: 'This claim is accurate.', confidence: 92, language_detected: 'en' };
    expect(FactCheckResponseSchema.safeParse(response).success).toBe(true);
  });

  it('validates each valid verdict type', () => {
    const verdicts = ['TRUE', 'PARTIALLY_TRUE', 'FALSE', 'UNVERIFIED', 'OPINION'] as const;
    verdicts.forEach(verdict => {
      const result = FactCheckResponseSchema.safeParse({
        verdict, explanation: 'Test explanation.', confidence: 80, language_detected: 'en'
      });
      expect(result.success).toBe(true);
    });
  });

  it('rejects an invalid verdict type', () => {
    const result = FactCheckResponseSchema.safeParse({
      verdict: 'MAYBE', explanation: 'Test.', confidence: 50, language_detected: 'en'
    });
    expect(result.success).toBe(false);
  });

  it('rejects response missing explanation', () => {
    const result = FactCheckResponseSchema.safeParse({
      verdict: 'TRUE', confidence: 80, language_detected: 'en'
    });
    expect(result.success).toBe(false);
  });
});
