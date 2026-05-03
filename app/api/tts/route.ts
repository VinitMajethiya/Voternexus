import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ttsClient, VOICE_CONFIG, stripHTML } from '@/lib/google-tts';

// Next.js Route Handlers using Google Cloud client libraries may require nodejs runtime
export const runtime = 'nodejs';

const TTSSchema = z.object({
  text: z.string().min(1),
  locale: z.string().default('en'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = TTSSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }

    const { text, locale } = parsed.data;
    const sanitized = stripHTML(text).slice(0, 5000);

    const voiceConfig = VOICE_CONFIG[locale] ?? VOICE_CONFIG['en'];

    const [response] = await ttsClient.synthesizeSpeech({
      input: { text: sanitized },
      voice: voiceConfig,
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9 },
    });

    if (!response.audioContent) {
      throw new Error('No audio content returned');
    }

    // Return the audio buffer as a streaming response
    return new Response(response.audioContent as any, {
      headers: {
        'Content-Type': 'audio/mp3',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (err) {
    console.error('[api/tts]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
