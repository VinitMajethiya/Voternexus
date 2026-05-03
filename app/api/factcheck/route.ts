import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runStructuredExtraction } from '@/lib/ai-client';
import { FACT_CHECK_PROMPT } from '@/lib/prompts/factcheck';
import { sanitizeText } from '@/lib/sanitize';
import { franc } from 'franc-min';

export const runtime = 'edge';

const FactCheckRequestSchema = z.object({
  claim: z.string().min(10).max(500),
});

const FactCheckResponseSchema = z.object({
  verdict: z.enum(['TRUE', 'PARTIALLY_TRUE', 'FALSE', 'UNVERIFIED', 'OPINION']),
  explanation: z.string(),
  confidence: z.number(),
  language_detected: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claim } = FactCheckRequestSchema.parse(body);

    // 1. Language Detection
    const langCode = franc(claim);
    
    // 2. Sanitize
    const sanitizedClaim = sanitizeText(claim);

    // 3. AI Fact Check
    const { data, confidence } = await runStructuredExtraction(
      FACT_CHECK_PROMPT,
      sanitizedClaim,
      FactCheckResponseSchema
    );

    // 4. Mock Web Grounding (In Phase 2 we target official sources list)
    const sources = [
      {
        title: "ECI Model Code of Conduct",
        url: "https://www.eci.gov.in/mcc/",
        publisher: "Election Commission of India",
        is_official: true
      },
      {
        title: "PIB Fact Check",
        url: "https://factcheck.pib.gov.in/",
        publisher: "Press Information Bureau",
        is_official: true
      }
    ];

    return NextResponse.json({
      ...data,
      sources,
      claim: sanitizedClaim,
      confidence: Math.min(data.confidence, confidence)
    });

  } catch (error: any) {
    console.error('[FactCheck API Error]:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid claim format', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to verify claim' }, { status: 500 });
  }
}
