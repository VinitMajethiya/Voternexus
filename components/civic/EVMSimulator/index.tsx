"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stamp, 
  Hand, 
  CheckCircle2, 
  ArrowRight,
  Monitor,
  Volume2,
  VolumeX,
  Keyboard
} from 'lucide-react';

type SimState = 'IDLE' | 'OFFICER_STAMP' | 'AT_BALLOT_UNIT' | 'CANDIDATE_SELECTION' | 'VOTE_CAST' | 'VVPAT_SHOWING' | 'VVPAT_DROPPED' | 'COMPLETE';

interface Candidate {
  id: number;
  name: string;
  symbol: string;
  party: string | null;
}

const SIMULATED_CANDIDATES: Candidate[] = [
  { id: 1, name: "Candidate A", symbol: "☀️", party: "Party Alpha" },
  { id: 2, name: "Candidate B", symbol: "🌙", party: "Party Beta" },
  { id: 3, name: "Candidate C", symbol: "⭐", party: "Party Gamma" },
  { id: 4, name: "NOTA", symbol: "✗", party: null },
];

export default function EVMSimulator() {
  const [state, setState] = useState<SimState>('IDLE');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Programmatic Beep using Web Audio API
  const playBeep = () => {
    if (!soundEnabled) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1);
  };

  const handleStart = () => setState('OFFICER_STAMP');
  
  const handleStamp = () => {
    playBeep(); // Short blip
    setTimeout(() => setState('AT_BALLOT_UNIT'), 1000);
  };

  const handleEnterBallot = () => {
    setState('CANDIDATE_SELECTION');
  };

  const handleVote = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setState('VOTE_CAST');
    playBeep(); // The long EVM beep
    
    setTimeout(() => {
      setState('VVPAT_SHOWING');
      setTimeout(() => {
        setState('VVPAT_DROPPED');
        setTimeout(() => setState('COMPLETE'), 1500);
      }, 4000); // VVPAT shows for 3s + animation
    }, 1000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      {/* Simulator Frame */}
      <div className="relative aspect-video bg-slate-900 rounded-[3rem] border-[12px] border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
        
        {/* Environment Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 opacity-50" />
        
        <AnimatePresence mode="wait">
          {state === 'IDLE' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="z-10 text-center space-y-8 p-12"
            >
              <div className="w-24 h-24 bg-phase/20 rounded-full flex items-center justify-center mx-auto ring-8 ring-phase/10">
                <Monitor className="w-12 h-12 text-phase" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white font-display">Voting Sandbox</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  Practice the full voting process in a safe, fictional environment. No real data is recorded.
                </p>
              </div>
              <button 
                onClick={handleStart}
                className="btn-primary px-12 py-4 text-lg"
              >
                Enter Polling Booth
              </button>
            </motion.div>
          )}

          {state === 'OFFICER_STAMP' && (
            <motion.div 
              key="stamp"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="z-10 text-center space-y-12"
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Step 1: Get your Voter Slip</h3>
                <p className="text-slate-400">The Presiding Officer will stamp your slip and ink your finger.</p>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStamp}
                className="group relative w-64 h-64 bg-white/5 rounded-3xl border-4 border-dashed border-white/20 flex flex-col items-center justify-center gap-4 hover:border-phase/50 transition-all"
              >
                <div className="p-6 bg-phase/10 rounded-full group-hover:bg-phase/20 transition-colors">
                  <Stamp className="w-16 h-16 text-phase" />
                </div>
                <span className="text-white font-bold">Click to Stamp Slip</span>
              </motion.button>
            </motion.div>
          )}

          {state === 'AT_BALLOT_UNIT' && (
            <motion.div 
              key="walk"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="z-10 text-center space-y-8"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto"
              >
                <Hand className="w-16 h-16 text-phase" />
              </motion.div>
              <h3 className="text-3xl font-bold text-white">Walk to the Ballot Unit</h3>
              <button 
                onClick={handleEnterBallot}
                className="btn-primary"
              >
                Approach Machine
              </button>
            </motion.div>
          )}

          {state === 'CANDIDATE_SELECTION' && (
            <motion.div 
              key="ballot"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              className="z-10 w-full max-w-2xl bg-slate-200 rounded-2xl p-6 shadow-inner flex flex-col gap-1 border-8 border-slate-300"
            >
              {/* Ballot Header */}
              <div className="bg-white p-3 border-b-2 border-slate-300 flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Parliamentary Constituency 2024</span>
                <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse" />
              </div>

              {SIMULATED_CANDIDATES.map((c) => (
                <div key={c.id} className="bg-white p-4 flex items-center justify-between gap-4 border-b border-slate-100">
                  <div className="flex items-center gap-6 flex-1">
                    <span className="text-xl font-black text-slate-300 w-6">{c.id}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 leading-none">{c.name}</span>
                      <span className="text-[10px] text-slate-400">{c.party || 'None'}</span>
                    </div>
                  </div>
                  <div className="text-3xl grayscale brightness-50" aria-hidden="true">{c.symbol}</div>
                  <button 
                    onClick={() => handleVote(c)}
                    aria-label={`Vote for ${c.name}`}
                    role="button"
                    className="w-12 h-12 rounded-full bg-blue-600 shadow-[0_4px_0_rgb(30,58,138)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center focus:ring-4 focus:ring-blue-300 outline-none"
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {state === 'VOTE_CAST' && (
            <motion.div key="beep" className="z-10 flex flex-col items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-green-500 shadow-[0_0_50px_rgba(34,197,94,0.5)] flex items-center justify-center">
                 <div className="w-12 h-12 rounded-full bg-green-300 animate-pulse" />
              </div>
              <h3 className="text-3xl font-black text-white italic tracking-widest uppercase animate-pulse">BEEP...</h3>
            </motion.div>
          )}

          {state === 'VVPAT_SHOWING' && (
            <motion.div key="vvpat" className="z-10 flex flex-col items-center gap-12">
               <div className="relative w-72 h-96 bg-slate-800 rounded-xl border-4 border-slate-700 shadow-2xl overflow-hidden p-6">
                  <div className="absolute top-0 left-0 w-full h-2 bg-slate-900" />
                  
                  {/* The Slip */}
                  <motion.div 
                    initial={{ y: 300 }}
                    animate={{ y: [300, 0, 0, 400] }}
                    transition={{ 
                      times: [0, 0.2, 0.8, 1],
                      duration: 4
                    }}
                    className="w-full bg-white aspect-[3/4] rounded shadow-lg p-6 flex flex-col items-center justify-center text-center gap-4"
                  >
                    <div className="text-5xl">{selectedCandidate?.symbol}</div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Candidate Selected</p>
                      <p className="text-lg font-bold text-slate-900">{selectedCandidate?.name}</p>
                    </div>
                    <div className="w-full border-t border-dashed border-slate-200 pt-4">
                       <p className="text-[8px] text-slate-400">Voter Verifiable Paper Audit Trail</p>
                    </div>
                  </motion.div>

                  <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
               </div>
               <p className="text-slate-400 font-bold animate-pulse">Verify your vote on the VVPAT screen</p>
            </motion.div>
          )}

          {state === 'COMPLETE' && (
            <motion.div 
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="z-10 text-center space-y-8"
            >
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white font-display">Vote Cast Successfully!</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  You have successfully completed the practice session. You are now familiar with the EVM and VVPAT process.
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setState('IDLE')}
                  className="btn-primary"
                >
                  Simulate Again
                </button>
                <button 
                   onClick={() => window.location.href = '/readiness'}
                   className="px-8 py-3 bg-white/10 text-white border border-white/20 rounded-pill font-bold hover:bg-white/20 transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD Controls */}
        <div className="absolute top-8 right-8 flex gap-4 z-50">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-white transition-colors border border-white/10"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <div className="px-4 py-2 bg-white/5 rounded-2xl text-xs font-bold text-slate-400 flex items-center gap-2 border border-white/10">
            <Keyboard className="w-4 h-4" />
            <span>Tab / Space enabled</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <InstructionCard 
           step="1"
           title="Slip Authentication"
           desc="Officer stamps your slip after verifying your ID."
           active={state === 'OFFICER_STAMP'}
         />
         <InstructionCard 
           step="2"
           title="Machine Access"
           desc="Approach the secret ballot compartment alone."
           active={state === 'AT_BALLOT_UNIT'}
         />
         <InstructionCard 
           step="3"
           title="Cast Vote"
           desc="Press the blue button next to your candidate."
           active={state === 'CANDIDATE_SELECTION'}
         />
         <InstructionCard 
           step="4"
           title="Verify VVPAT"
           desc="Ensure the slip matches your choice before it drops."
           active={state === 'VVPAT_SHOWING'}
         />
      </div>
    </div>
  );
}

function InstructionCard({ step, title, desc, active }: { step: string, title: string, desc: string, active: boolean }) {
  return (
    <div className={`p-6 rounded-bento border-2 transition-all duration-500 ${
      active ? 'border-phase bg-phase/5 shadow-lg scale-105' : 'border-slate-100 bg-white opacity-50'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mb-4 ${
        active ? 'bg-phase text-white' : 'bg-slate-100 text-slate-400'
      }`}>
        {step}
      </div>
      <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
