'use client';

import React, { useState, useEffect } from 'react';
import { useAccessibilityPrefs } from '@/hooks/useAccessibilityPrefs';

export function ReadingRuler() {
  const { readingRuler } = useAccessibilityPrefs();
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    if (!readingRuler) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingRuler]);

  if (!readingRuler) return null;

  return (
    <div 
      className="fixed left-0 w-full pointer-events-none z-[9999]"
      style={{
        top: mouseY,
        height: '2.5rem',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
      }}
      aria-hidden="true"
    />
  );
}
