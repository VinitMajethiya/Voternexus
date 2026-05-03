import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { translateClient } from '@/lib/google-translate';
import { Redis } from '@upstash/redis';

// Using nodejs runtime for google cloud compatibility
export const runtime = 'nodejs';

// Initialize Redis for caching translations (silent fallback if env not set)
let redis: Redis | null = null;
try {
  redis = Redis.fromEnv();
} catch (e) {
  console.warn('Redis env vars not set. Caching will be disabled.');
}

const TranslateSchema = z.object({
  text: z.union([z.string(), z.array(z.string())]),
  target: z.string(),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = TranslateSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }

    const { text, target, source } = parsed.data;

    // Fast return if translating to English and source is implicitly english or already english
    if (target === 'en' && typeof text === 'string' && /^[a-zA-Z0-9\s.,!?'"-]+$/.test(text)) {
      return NextResponse.json({ translatedText: text, fromCache: true });
    }

    // Cache key generation
    const textStr = Array.isArray(text) ? text.join('|') : text;
    // Basic hash for key
    const hash = Buffer.from(textStr).toString('base64').substring(0, 64);
    const cacheKey = `translate:${target}:${hash}`;

    // Try to fetch from Redis Cache
    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return NextResponse.json({ translatedText: cached, fromCache: true });
        }
      } catch (e) {
        console.warn('Redis cache read failed, falling back to API', e);
      }
    }

    // Call Google Translate API
    let response = await translateClient.translate(text as any, target);
    let translations = response[0];
    translations = Array.isArray(translations) ? translations : [translations];
    const translatedText = Array.isArray(text) ? translations : translations[0];

    // Save to Cache (7 days TTL = 604800 seconds)
    if (redis) {
      try {
        await redis.setex(cacheKey, 604800, translatedText);
      } catch (e) {
        console.warn('Redis cache write failed', e);
      }
    }

    return NextResponse.json({ translatedText, fromCache: false });
  } catch (err) {
    console.error('[api/translate]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
