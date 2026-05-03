import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateGroundedFactCheck } from '@/lib/gemini-client';
import { FACT_CHECK_PROMPT } from '@/lib/prompts/factcheck';

export const runtime = 'edge';

const FactCheckSchema = z.object({
  claim: z.string().min(10).max(500),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = FactCheckSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid claim', details: parsed.error.flatten() }, { status: 400 });
    }

    const { claim } = parsed.data;

    // Use Gemini with Grounding instead of Claude
    const result = await generateGroundedFactCheck(claim, FACT_CHECK_PROMPT);
    const text = result.response.text();
    
    // Parse the JSON out of the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Failed to parse Gemini JSON output');
    }
    
    const parsedResult = JSON.parse(jsonMatch[0]);

    // Grounding data extraction
    const sources = [];
    const candidates = result.response.candidates || [];
    if (candidates.length > 0 && candidates[0].groundingMetadata && candidates[0].groundingMetadata.groundingChunks) {
      const chunks = candidates[0].groundingMetadata.groundingChunks;
      for (const chunk of chunks) {
         if (chunk.web && chunk.web.uri) {
           sources.push({
             title: chunk.web.title || 'Source',
             url: chunk.web.uri,
             publisher: new URL(chunk.web.uri).hostname,
             is_official: chunk.web.uri.includes('.gov.in') || chunk.web.uri.includes('eci.gov.in') || chunk.web.uri.includes('pib.gov.in')
           });
         }
      }
    }

    // Default authoritative source fallback
    if (sources.length === 0) {
      sources.push({
        title: 'Election Commission of India',
        url: 'https://eci.gov.in',
        publisher: 'eci.gov.in',
        is_official: true
      });
    }

    return NextResponse.json({
      claim,
      verdict: parsedResult.verdict || 'UNVERIFIED',
      explanation: parsedResult.explanation || 'Could not be verified.',
      confidence: parsedResult.confidence || 50,
      language_detected: parsedResult.language_detected || 'en',
      sources: sources
    });
  } catch (err) {
    console.error('[api/gemini/factcheck]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
