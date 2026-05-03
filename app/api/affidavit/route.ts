import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
const pdf = require('pdf-parse');
import { createWorker } from 'tesseract.js';
import { runStructuredExtraction } from '@/lib/ai-client';
import { AFFIDAVIT_EXTRACTION_PROMPT } from '@/lib/prompts/affidavit';
import { sanitizeText, cleanPdfText } from '@/lib/sanitize';
import axios from 'axios';

export const runtime = 'nodejs'; // Required for pdf-parse and tesseract

const AffidavitRequestSchema = z.object({
  url: z.string().url().optional(),
  file: z.string().optional(), // base64 string
});

const AffidavitResponseSchema = z.object({
  candidate_name: z.string(),
  constituency: z.string(),
  election_year: z.number(),
  assets_inr: z.number().nullable(),
  liabilities_inr: z.number().nullable(),
  criminal_cases: z.array(z.object({
    ipc_section: z.string(),
    plain_description: z.string(),
    status: z.enum(['pending', 'acquitted', 'convicted', 'unknown'])
  })),
  education: z.string().nullable(),
  profession: z.string().nullable(),
  source_url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, file } = AffidavitRequestSchema.parse(body);

    let pdfBuffer: Buffer;

    if (url) {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      pdfBuffer = Buffer.from(response.data);
    } else if (file) {
      pdfBuffer = Buffer.from(file.split(',')[1], 'base64');
    } else {
      return NextResponse.json({ error: 'No PDF source provided' }, { status: 400 });
    }

    // 1. Attempt standard PDF text extraction
    let extractedText = '';
    try {
      const data = await pdf(pdfBuffer);
      extractedText = data.text;
    } catch (err) {
      console.warn('[PDF Parse Error]:', err);
    }

    // 2. Fallback to OCR if text is sparse (likely a scanned PDF)
    if (extractedText.trim().length < 500) {
      console.log('[OCR Fallback Triggered]');
      const worker = await createWorker('eng');
      const ret = await worker.recognize(pdfBuffer);
      extractedText = ret.data.text;
      await worker.terminate();
    }

    // 3. Sanitize and Clean
    const cleanedText = cleanPdfText(sanitizeText(extractedText));

    // 4. Run AI Extraction
    const { data, confidence } = await runStructuredExtraction(
      AFFIDAVIT_EXTRACTION_PROMPT,
      cleanedText,
      AffidavitResponseSchema
    );

    return NextResponse.json({
      ...data,
      confidence_score: confidence,
      parsed_at: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[Affidavit API Error]:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request or response format', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to process affidavit' }, { status: 500 });
  }
}
