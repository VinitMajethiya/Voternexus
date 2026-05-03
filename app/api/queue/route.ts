import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

export const runtime = 'edge';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const ReportSchema = z.object({
  booth_id: z.string(),
  wait_level: z.enum(['short', 'moderate', 'long']),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const booth_id = searchParams.get('booth_id');

  if (!booth_id) return NextResponse.json({ error: 'Missing booth_id' }, { status: 400 });

  try {
    const key = `queue:${booth_id}`;
    const reports: any[] = await redis.get(key) || [];
    
    // Aggregate status
    const recent = reports.filter(r => Date.now() - r.timestamp < 45 * 60 * 1000);
    if (recent.length === 0) return NextResponse.json({ status: 'unknown' });

    const counts = { short: 0, moderate: 0, long: 0 };
    recent.forEach(r => {
      if (r.wait_level in counts) {
        counts[r.wait_level as keyof typeof counts]++;
      }
    });

    const status = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    
    return NextResponse.json({ 
      status, 
      report_count: recent.length,
      last_reported: recent[recent.length - 1].timestamp 
    });
  } catch (err) {
    console.error('[Queue API GET Error]:', err);
    return NextResponse.json({ status: 'unknown' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booth_id, wait_level } = ReportSchema.parse(body);
    
    // 1. Rate Limiting (Simple per IP)
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const limitKey = `rate:queue:${ip}:${booth_id}`;
    const isLimited = await redis.get(limitKey);
    
    if (isLimited) {
      return NextResponse.json({ error: 'You have already reported for this booth recently.' }, { status: 429 });
    }

    // 2. Add Report
    const key = `queue:${booth_id}`;
    const reports: any[] = await redis.get(key) || [];
    
    const newReport = {
      wait_level,
      timestamp: Date.now()
    };

    const updatedReports = [...reports.slice(-19), newReport]; // Keep last 20
    await redis.set(key, updatedReports, { ex: 7200 }); // 2 hour TTL
    
    // 3. Set Rate Limit
    await redis.set(limitKey, true, { ex: 900 }); // 15 min rate limit per booth per IP

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[Queue API POST Error]:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
