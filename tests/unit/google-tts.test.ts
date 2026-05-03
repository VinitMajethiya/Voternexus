import { describe, it, expect } from 'vitest';
import { stripHTML } from '@/lib/google-tts';

describe('stripHTML', () => {
  it('removes simple HTML tags', () => {
    expect(stripHTML('<p>Hello</p>')).toBe('Hello');
  });

  it('removes nested tags', () => {
    expect(stripHTML('<div><strong>Vote</strong> Today</div>')).toBe('Vote Today');
  });

  it('removes self-closing tags', () => {
    expect(stripHTML('Line 1<br/>Line 2')).toBe('Line 1Line 2');
  });

  it('removes anchor tags and preserves text content', () => {
    expect(stripHTML('<a href="https://eci.gov.in">ECI</a>')).toBe('ECI');
  });

  it('handles plain text with no HTML unchanged', () => {
    const text = 'Please cast your vote today.';
    expect(stripHTML(text)).toBe(text);
  });

  it('handles empty string', () => {
    expect(stripHTML('')).toBe('');
  });

  it('removes multiple tags across a long string', () => {
    const input = '<h1>VoterNexus</h1><p>An <em>inclusive</em> platform.</p>';
    expect(stripHTML(input)).toBe('VoterNexusAn inclusive platform.');
  });
});
