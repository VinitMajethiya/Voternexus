import { v2 } from '@google-cloud/translate';

// Instantiate a client. It will automatically use the GOOGLE_APPLICATION_CREDENTIALS
// environment variable if set, or application default credentials.
// For API Key usage: new v2.Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY })
export const translateClient = new v2.Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY || undefined,
});
