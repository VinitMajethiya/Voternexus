'use client';

import React, { useEffect, useState } from 'react';
import { useAccessibilityPrefs } from '@/hooks/useAccessibilityPrefs';
import { AccessibilityPanel } from '@/components/civic/AccessibilityPanel';
import { ReadingRuler } from '@/components/civic/ReadingRuler';
import { DwellClickOverlay } from '@/components/civic/DwellClickOverlay';
import { FloatingTTSButton } from '@/components/civic/VoiceNavigator/FloatingTTSButton';
import { AccessVoteAssistant } from '@/components/civic/AccessVoteAssistant';
import { ISLVideoPanel } from '@/components/civic/ISLVideoPanel';

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const prefs = useAccessibilityPrefs();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Apply text size
    root.style.fontSize = `${prefs.textSizeMultiplier * 100}%`;

    // Apply Contrast Profile
    root.classList.remove('hc-light', 'hc-dark', 'hc-yellow');
    if (prefs.contrastProfile === 'high-contrast-light') root.classList.add('hc-light');
    if (prefs.contrastProfile === 'high-contrast-dark') root.classList.add('hc-dark');
    if (prefs.contrastProfile === 'yellow-on-black') root.classList.add('hc-yellow');

    // Apply Dyslexia Font
    if (prefs.dyslexiaFont) {
      document.body.classList.add('font-dyslexic');
    } else {
      document.body.classList.remove('font-dyslexic');
    }

    // Apply Motor Impairment Target Sizes
    if (prefs.motorImpairmentMode) {
      root.classList.add('motor-mode');
    } else {
      root.classList.remove('motor-mode');
    }

    // Apply Simple Mode
    if (prefs.simpleMode) {
      document.body.classList.add('simple-mode');
    } else {
      document.body.classList.remove('simple-mode');
    }
  }, [prefs, mounted]);

  return (
    <>
      {children}
      {mounted && (
        <>
          <ReadingRuler />
          <DwellClickOverlay />
          <AccessibilityPanel />
          <FloatingTTSButton />
          <AccessVoteAssistant />
          <ISLVideoPanel />
        </>
      )}
    </>
  );
}
