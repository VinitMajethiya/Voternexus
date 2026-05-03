import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ContrastProfile = 'standard' | 'high-contrast-light' | 'high-contrast-dark' | 'yellow-on-black' | 'custom';
export type TextSizeMultiplier = 1 | 1.25 | 1.5 | 1.75 | 2;
export type DwellClickTime = 0.8 | 1.5 | 2.5 | 4;

export interface AccessibilityPrefs {
  // Vision
  contrastProfile: ContrastProfile;
  textSizeMultiplier: TextSizeMultiplier;
  readingRuler: boolean;
  dyslexiaFont: boolean;

  // Hearing
  signLanguageVideos: boolean;
  visualAlertsOnly: boolean;

  // Motor
  motorImpairmentMode: boolean;
  dwellClick: boolean;
  dwellClickTime: DwellClickTime;

  // Cognitive
  simpleMode: boolean;
  autoReadPages: boolean;

  // Voice
  voiceNavigation: boolean;
}

interface AccessibilityStore extends AccessibilityPrefs {
  setPref: <K extends keyof AccessibilityPrefs>(key: K, value: AccessibilityPrefs[K]) => void;
  togglePref: (key: keyof Pick<AccessibilityPrefs, 'readingRuler' | 'dyslexiaFont' | 'signLanguageVideos' | 'visualAlertsOnly' | 'motorImpairmentMode' | 'dwellClick' | 'simpleMode' | 'autoReadPages' | 'voiceNavigation'>) => void;
}

const defaultPrefs: AccessibilityPrefs = {
  contrastProfile: 'standard',
  textSizeMultiplier: 1,
  readingRuler: false,
  dyslexiaFont: false,
  signLanguageVideos: false,
  visualAlertsOnly: false,
  motorImpairmentMode: false,
  dwellClick: false,
  dwellClickTime: 1.5,
  simpleMode: false,
  autoReadPages: false,
  voiceNavigation: false,
};

export const useAccessibilityPrefs = create<AccessibilityStore>()(
  persist(
    (set) => ({
      ...defaultPrefs,
      setPref: (key, value) => set((state) => ({ ...state, [key]: value })),
      togglePref: (key) => set((state) => ({ ...state, [key]: !state[key] as boolean })),
    }),
    {
      name: 'vn_a11y_prefs',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : sessionStorage)),
    }
  )
);
