import Anthropic from '@anthropic-ai/sdk';
import { ZodSchema } from 'zod';

const client = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY || 'mock_key_for_build' 
});

export async function runStructuredExtraction<T>(
  systemPrompt: string,
  userContent: string,
  schema: ZodSchema<T>,
  options?: { maxTokens?: number; timeoutMs?: number }
): Promise<{ data: T; confidence: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? 15000
  );

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: options?.maxTokens ?? 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    }, { signal: controller.signal });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    // Clean potential markdown formatting
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanedText);
    const validated = schema.parse(parsed);

    return { data: validated, confidence: calculateConfidence(response) };
  } catch (error) {
    console.error('[AI Client Error]:', error);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function calculateConfidence(response: any): number {
  // Use stop_reason and token usage as proxy signals as per AGENT.md section 8
  if (response.stop_reason !== 'end_turn') return 40;
  const ratio = response.usage.output_tokens / response.usage.input_tokens;
  if (ratio < 0.05) return 55; 
  if (ratio > 0.5) return 70;  
  return 85;
}
