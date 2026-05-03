import { describe, it, expect } from 'vitest';

/**
 * Queue aggregation logic tests.
 * We isolate and test the pure aggregation logic from /api/queue/route.ts
 * without importing the route directly (which requires Edge runtime + Redis).
 */

type WaitLevel = 'short' | 'moderate' | 'long';

interface QueueReport {
  wait_level: WaitLevel;
  timestamp: number;
}

// Pure function extracted from route handler for testability
function aggregateQueueStatus(reports: QueueReport[], now: number = Date.now()): WaitLevel | 'unknown' {
  const recent = reports.filter(r => now - r.timestamp < 45 * 60 * 1000);
  if (recent.length === 0) return 'unknown';

  const counts: Record<WaitLevel, number> = { short: 0, moderate: 0, long: 0 };
  recent.forEach(r => { counts[r.wait_level]++; });

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as WaitLevel;
}

const MINS = 60 * 1000;
const now = Date.now();

describe('Queue aggregation logic', () => {
  it('returns unknown for empty reports', () => {
    expect(aggregateQueueStatus([])).toBe('unknown');
  });

  it('returns unknown when all reports are older than 45 minutes', () => {
    const oldReport: QueueReport = { wait_level: 'long', timestamp: now - 50 * MINS };
    expect(aggregateQueueStatus([oldReport], now)).toBe('unknown');
  });

  it('returns the majority wait level', () => {
    const reports: QueueReport[] = [
      { wait_level: 'long', timestamp: now - 5 * MINS },
      { wait_level: 'long', timestamp: now - 10 * MINS },
      { wait_level: 'short', timestamp: now - 15 * MINS },
    ];
    expect(aggregateQueueStatus(reports, now)).toBe('long');
  });

  it('returns short when all recent reports are short', () => {
    const reports: QueueReport[] = [
      { wait_level: 'short', timestamp: now - 5 * MINS },
      { wait_level: 'short', timestamp: now - 20 * MINS },
    ];
    expect(aggregateQueueStatus(reports, now)).toBe('short');
  });

  it('excludes stale reports from aggregation', () => {
    const reports: QueueReport[] = [
      { wait_level: 'long', timestamp: now - 60 * MINS }, // stale
      { wait_level: 'long', timestamp: now - 55 * MINS }, // stale
      { wait_level: 'short', timestamp: now - 10 * MINS }, // recent
    ];
    // The 2 stale 'long' reports should not count — 'short' wins
    expect(aggregateQueueStatus(reports, now)).toBe('short');
  });

  it('handles a mix of all three levels correctly', () => {
    const reports: QueueReport[] = [
      { wait_level: 'short', timestamp: now - 5 * MINS },
      { wait_level: 'moderate', timestamp: now - 10 * MINS },
      { wait_level: 'moderate', timestamp: now - 15 * MINS },
      { wait_level: 'long', timestamp: now - 20 * MINS },
    ];
    expect(aggregateQueueStatus(reports, now)).toBe('moderate');
  });
});
