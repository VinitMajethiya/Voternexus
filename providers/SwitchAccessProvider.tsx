'use client';

import React, { useEffect, useState } from 'react';
import { useAccessibilityPrefs } from '@/hooks/useAccessibilityPrefs';

export function SwitchAccessProvider({ children }: { children: React.ReactNode }) {
  const { motorImpairmentMode } = useAccessibilityPrefs();
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    if (!motorImpairmentMode) {
      setCurrentIndex(-1);
      return;
    }

    const updateFocusableElements = () => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      )).filter(el => {
        // Basic visibility check
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && !el.hasAttribute('disabled');
      });
      setFocusableElements(elements);
    };

    updateFocusableElements();

    // Re-evaluate on DOM mutations in case of dynamic rendering
    const observer = new MutationObserver(updateFocusableElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [motorImpairmentMode]);

  useEffect(() => {
    if (!motorImpairmentMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Space to move to next element
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        setCurrentIndex(nextIndex);
        
        const el = focusableElements[nextIndex];
        if (el) {
          el.focus();
          // Optional: Add visual focus ring for clarity
          el.style.outline = '4px solid #FFFF00';
          el.style.outlineOffset = '2px';
          
          // Cleanup previous outline
          const prevEl = focusableElements[currentIndex];
          if (prevEl && prevEl !== el) {
            prevEl.style.outline = '';
          }
        }
      }
      // Enter to trigger
      else if (e.code === 'Enter') {
        if (currentIndex >= 0 && focusableElements[currentIndex]) {
          // If it's a link or button, trigger click
          focusableElements[currentIndex].click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [motorImpairmentMode, currentIndex, focusableElements]);

  return <>{children}</>;
}
