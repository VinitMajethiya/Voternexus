'use client';

import React, { useState } from 'react';
import { useAccessibilityPrefs } from '@/hooks/useAccessibilityPrefs';

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const prefs = useAccessibilityPrefs();

  const togglePanel = () => setIsOpen(!isOpen);

  if (!isOpen) {
    return (
      <button
        onClick={togglePanel}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-yellow-400"
        aria-label="Open Accessibility Panel"
      >
        <span className="text-xl" aria-hidden="true">♿</span>
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Accessibility</h2>
        <button
          onClick={togglePanel}
          className="text-gray-500 hover:text-gray-900 p-2 focus:ring-2 focus:ring-blue-600"
          aria-label="Close Accessibility Panel"
        >
          ✕
        </button>
      </div>
      
      <div className="p-4 space-y-6">
        {/* VISION */}
        <section>
          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Vision</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="contrast-select" className="block text-sm font-medium text-gray-700 mb-1">
                High Contrast
              </label>
              <select
                id="contrast-select"
                value={prefs.contrastProfile}
                onChange={(e) => prefs.setPref('contrastProfile', e.target.value as any)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
              >
                <option value="standard">Standard</option>
                <option value="high-contrast-light">High Contrast Light</option>
                <option value="high-contrast-dark">High Contrast Dark</option>
                <option value="yellow-on-black">Yellow on Black</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="text-size" className="block text-sm font-medium text-gray-700 mb-1">
                Text Size
              </label>
              <select
                id="text-size"
                value={prefs.textSizeMultiplier}
                onChange={(e) => prefs.setPref('textSizeMultiplier', parseFloat(e.target.value) as any)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
              >
                <option value={1}>100% (Default)</option>
                <option value={1.25}>125%</option>
                <option value={1.5}>150%</option>
                <option value={1.75}>175%</option>
                <option value={2}>200%</option>
              </select>
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={prefs.readingRuler}
                onChange={() => prefs.togglePref('readingRuler')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Reading Ruler</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={prefs.dyslexiaFont}
                onChange={() => prefs.togglePref('dyslexiaFont')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Dyslexia Font</span>
            </label>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* HEARING */}
        <section>
          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Hearing</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={prefs.signLanguageVideos}
                onChange={() => prefs.togglePref('signLanguageVideos')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Sign Language Videos</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={prefs.visualAlertsOnly}
                onChange={() => prefs.togglePref('visualAlertsOnly')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Visual Alerts Only</span>
            </label>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* MOTOR */}
        <section>
          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Motor</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={prefs.motorImpairmentMode}
                onChange={() => prefs.togglePref('motorImpairmentMode')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Motor Impairment Mode</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={prefs.dwellClick}
                onChange={() => prefs.togglePref('dwellClick')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Dwell Click</span>
            </label>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* COGNITIVE */}
        <section>
          <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Cognitive</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={prefs.simpleMode}
                onChange={() => prefs.togglePref('simpleMode')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Simple Mode</span>
            </label>
          </div>
        </section>

      </div>
    </div>
  );
}
