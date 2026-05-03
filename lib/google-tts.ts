import textToSpeech from '@google-cloud/text-to-speech';

// Instantiate a client. It will automatically use the GOOGLE_APPLICATION_CREDENTIALS
// environment variable if set, or application default credentials.
export const ttsClient = new textToSpeech.TextToSpeechClient();

export const VOICE_CONFIG: Record<string, { languageCode: string; name: string; ssmlGender: 'FEMALE' | 'MALE' }> = {
  en: { languageCode: 'en-IN', name: 'en-IN-Wavenet-A', ssmlGender: 'FEMALE' },
  hi: { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-A', ssmlGender: 'FEMALE' },
  mr: { languageCode: 'mr-IN', name: 'mr-IN-Wavenet-A', ssmlGender: 'FEMALE' },
  ta: { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-B', ssmlGender: 'FEMALE' },
  te: { languageCode: 'te-IN', name: 'te-IN-Wavenet-A', ssmlGender: 'FEMALE' },
  bn: { languageCode: 'bn-IN', name: 'bn-IN-Wavenet-A', ssmlGender: 'FEMALE' },
};

export function stripHTML(text: string) {
  return text.replace(/<[^>]*>?/gm, '');
}
