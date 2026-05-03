'use client';

import { useState, useCallback, useRef } from 'react';
import { useLocale } from 'next-intl';

export function useVoiceTTS() {
  const locale = useLocale();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    // Also stop any Web Speech API fallback
    window.speechSynthesis.cancel();
  }, []);

  const speakFallback = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === 'en' ? 'en-IN' : `${locale}-IN`;
    utterance.rate = 0.9;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      setError('Failed to play audio fallback.');
    };

    window.speechSynthesis.speak(utterance);
  }, [locale]);

  const speak = useCallback(async (text: string) => {
    stop();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, locale }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setError('Error playing audio. Falling back to native speech.');
        speakFallback(text);
      };

      await audio.play();
    } catch (err) {
      console.error('TTS API failed, falling back to Web Speech API:', err);
      speakFallback(text);
    } finally {
      setIsLoading(false);
    }
  }, [locale, stop, speakFallback]);

  return {
    speak,
    stop,
    isPlaying,
    isLoading,
    error,
  };
}
