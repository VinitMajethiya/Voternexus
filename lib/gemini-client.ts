import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
export const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generateGroundedFactCheck(claim: string, systemPrompt: string) {
  // Using the Google Search grounding tool
  // The SDK might use `googleSearch` or `googleSearchRetrieval` depending on version
  const modelWithSearch = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    tools: [{ googleSearchRetrieval: { dynamicRetrievalConfig: { mode: 'MODE_DYNAMIC', dynamicThreshold: 0.3 } } } as any]
  });

  const result = await modelWithSearch.generateContent({
    contents: [
      { role: 'user', parts: [{ text: `${systemPrompt}\n\nClaim to fact-check: "${claim}"` }] }
    ]
  });

  return result;
}
