'use client';

import React from 'react';
import { useVoiceTTS } from '@/hooks/useVoiceTTS';

export function FloatingTTSButton() {
  const { speak, stop, isPlaying, isLoading } = useVoiceTTS();

  const handleToggle = () => {
    if (isPlaying || isLoading) {
      stop();
    } else {
      // Prioritize <main> content, fallback to document.body
      const contentElement = document.querySelector('main') || document.body;
      // Very basic text extraction (in a real app, this would be more refined to respect aria-hidden, etc.)
      const textToRead = contentElement.innerText;
      speak(textToRead || 'No content found to read.');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-20 right-4 z-40 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors focus:ring-4 focus:ring-yellow-400"
      aria-label={isPlaying ? 'Stop Reading Page' : 'Read Page Aloud'}
      title={isPlaying ? 'Stop Reading Page' : 'Read Page Aloud'}
    >
      {isLoading ? (
        <span className="block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      ) : isPlaying ? (
        <span className="text-xl leading-none" aria-hidden="true">⏸</span>
      ) : (
        <span className="text-xl leading-none" aria-hidden="true">🔊</span>
      )}
    </button>
  );
}
