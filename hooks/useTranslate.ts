'use client';

import { useState, useCallback } from 'react';

export function useTranslate() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (text: string | string[], target: string) => {
    setIsTranslating(true);
    setError(null);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.translatedText;
    } catch (err) {
      console.error(err);
      setError('Translation error');
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  return { translate, isTranslating, error };
}
