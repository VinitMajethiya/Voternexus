import { describe, it, expect, vi } from 'vitest';
import { getElectionPhase } from '@/lib/election-phase';
import { parseISO } from 'date-fns';

describe('getElectionPhase', () => {
  it('detects election-day correctly', () => {
    // 2024-05-13 is the polling day in the sample schedule
    const target = parseISO('2024-05-13');
    expect(getElectionPhase(target)).toBe('election-day');
  });

  it('detects election-week (0-7 days before)', () => {
    const target = parseISO('2024-05-10');
    expect(getElectionPhase(target)).toBe('election-week');
  });

  it('detects campaign (14-60 days before)', () => {
    const target = parseISO('2024-04-15');
    expect(getElectionPhase(target)).toBe('campaign');
  });

  it('detects pre-election (>60 days before)', () => {
    const target = parseISO('2024-01-01');
    expect(getElectionPhase(target)).toBe('pre-election');
  });

  it('detects post-election (after polling day)', () => {
    const target = parseISO('2024-05-14');
    expect(getElectionPhase(target)).toBe('post-election');
  });
});
