import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { geminiModel } from '@/lib/gemini-client';

export const runtime = 'nodejs';

const COMPARE_PROMPT = `
SYSTEM:
You are a neutral election analysis AI. Your task is to compare two political candidates based on the provided profiles.
Extract and compare their data in a structured, unbiased format. Never favor one candidate over another.
Always output valid JSON without any markdown or conversational text.

Target JSON Schema:
{
  "comparison_matrix": {
    "education": { "candidate_1": "string", "candidate_2": "string" },
    "assets_inr": { "candidate_1": "number or string", "candidate_2": "number or string" },
    "criminal_cases": { "candidate_1": "number", "candidate_2": "number" },
    "key_promises": { "candidate_1": ["string"], "candidate_2": ["string"] }
  },
  "neutral_summary": "A brief 2-3 sentence objective comparison."
}
`;

const CompareSchema = z.object({
  candidate1: z.string().min(10),
  candidate2: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = CompareSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }

    const { candidate1, candidate2 } = parsed.data;

    const result = await geminiModel.generateContent([
      COMPARE_PROMPT,
      `Candidate 1 Data:\n${candidate1}\n\nCandidate 2 Data:\n${candidate2}`
    ]);

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse Gemini JSON output');
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error('[api/gemini/compare]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
