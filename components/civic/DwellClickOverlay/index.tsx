'use client';

import React, { useState, useEffect } from 'react';
import { useAccessibilityPrefs } from '@/hooks/useAccessibilityPrefs';

export function DwellClickOverlay() {
  const { dwellClick, dwellClickTime } = useAccessibilityPrefs();
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isDwelling, setIsDwelling] = useState(false);

  useEffect(() => {
    if (!dwellClick) return;

    let dwellTimer: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);

      const target = document.elementFromPoint(e.clientX, e.clientY);
      const isClickable = target?.closest('button, a, input, select, [role="button"], [tabindex="0"]');
      
      if (isClickable !== hoveredElement) {
        setHoveredElement(isClickable || null);
        setIsDwelling(false);
      }
    };

    if (hoveredElement) {
      setIsDwelling(true);
      dwellTimer = setTimeout(() => {
        (hoveredElement as HTMLElement).click();
        setIsDwelling(false);
        setHoveredElement(null); // Reset after click
      }, dwellClickTime * 1000);
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(dwellTimer);
    };
  }, [dwellClick, dwellClickTime, hoveredElement]);

  if (!dwellClick || !isDwelling) return null;

  return (
    <div 
      className="fixed pointer-events-none z-[10000] rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
      style={{
        left: mouseX - 20,
        top: mouseY - 20,
        width: '40px',
        height: '40px',
        animationDuration: `${dwellClickTime}s`,
        animationTimingFunction: 'linear'
      }}
      aria-hidden="true"
    />
  );
}
