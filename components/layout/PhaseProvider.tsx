"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ElectionPhase } from '@/types';
import { getElectionPhase } from '@/lib/election-phase';

interface PhaseContextType {
  phase: ElectionPhase;
  setPhase: (phase: ElectionPhase) => void; // For testing/demo purposes
}

const PhaseContext = createContext<PhaseContextType | undefined>(undefined);

const PHASE_COLORS: Record<ElectionPhase, string> = {
  'pre-election': '#1A56DB',
  'campaign': '#F59E0B',
  'election-week': '#FF6B2C',
  'election-day': '#18A96F',
  'post-election': '#64748B',
};

export function PhaseProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<ElectionPhase>('pre-election');

  useEffect(() => {
    const currentPhase = getElectionPhase();
    setPhase(currentPhase);
  }, []);

  useEffect(() => {
    // Inject CSS variable for phase color as per AGENT.md section 9.3
    document.documentElement.style.setProperty(
      '--color-phase-accent',
      PHASE_COLORS[phase]
    );
  }, [phase]);

  return (
    <PhaseContext.Provider value={{ phase, setPhase }}>
      {children}
    </PhaseContext.Provider>
  );
}

export function usePhase() {
  const context = useContext(PhaseContext);
  if (context === undefined) {
    throw new Error('usePhase must be used within a PhaseProvider');
  }
  return context;
}
