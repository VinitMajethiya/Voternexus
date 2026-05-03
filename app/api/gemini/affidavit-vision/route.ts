import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { geminiModel } from '@/lib/gemini-client';

export const runtime = 'nodejs';

const AFFIDAVIT_EXTRACTION_PROMPT = `
SYSTEM:
You are a neutral civic data extraction assistant for the Indian election system.
Your only job is to extract factual financial and biographical data from Indian
candidate affidavits filed with the Election Commission of India.

Rules:
- Extract ONLY what is explicitly stated in the document image.
- Do not infer, estimate, or editorialize.
- Do not make any political judgments about candidates.
- If a field is absent, return null. Never fabricate values.
- For criminal_cases, translate IPC section numbers into plain English descriptions.
- Respond ONLY with valid JSON. No preamble, no markdown fences.

Target JSON Schema:
{
  "candidate_name": "string",
  "constituency": "string",
  "election_year": "number",
  "assets_inr": "number | null",
  "liabilities_inr": "number | null",
  "criminal_cases": [{"ipc_section": "string", "plain_description": "string", "status": "pending|acquitted|convicted|unknown"}],
  "education": "string | null",
  "profession": "string | null",
  "source_url": "string",
  "confidence_score": "number (0-100)",
  "parsed_at": "ISO timestamp"
}
`;

const AffidavitVisionSchema = z.object({
  imageBase64: z.string().min(100),
  mimeType: z.string().default('image/jpeg'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = AffidavitVisionSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }

    const { imageBase64, mimeType } = parsed.data;

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const result = await geminiModel.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Data,
        }
      },
      AFFIDAVIT_EXTRACTION_PROMPT,
    ]);

    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Failed to parse Gemini JSON output');
    }
    
    const parsedResult = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsedResult);
  } catch (err) {
    console.error('[api/gemini/affidavit-vision]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
