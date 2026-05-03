'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2, Sparkles, X } from 'lucide-react';
import { useVoiceTTS } from '@/hooks/useVoiceTTS';
import { useAccessibilityPrefs } from '@/hooks/useAccessibilityPrefs';

export function AccessVoteAssistant() {
  const { voiceNavigation, simpleMode } = useAccessibilityPrefs();
  const { speak, stop } = useVoiceTTS();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleIntent(text);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Shortcut Alt+V to toggle listening
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'KeyV') {
        toggleListening();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setAssistantReply(null);
      stop();
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleIntent = async (text: string) => {
    const lower = text.toLowerCase();
    
    // Very basic intent matching for demonstration
    if (lower.includes('home')) {
      window.location.href = '/';
      speak('Navigating to home page');
    } else if (lower.includes('fact check') || lower.includes('misinformation')) {
      speak('Opening the Misinformation Shield');
      setAssistantReply('Navigating to Misinformation Shield...');
    } else if (lower.includes('explain')) {
      setAssistantReply('Analyzing the page content...');
      speak('Analyzing the page to provide a simple explanation.');
      
      setTimeout(() => {
        const reply = simpleMode 
          ? "This is VoterNexus. It helps you check news and find your polling booth easily."
          : "VoterNexus is a comprehensive civic platform. You can verify claims using the Misinformation Shield or view candidate affidavits.";
        setAssistantReply(reply);
        speak(reply);
      }, 2000);
    } else {
      const reply = "I heard you say: " + text + ". Try saying 'explain this page' or 'go home'.";
      setAssistantReply(reply);
      speak(reply);
    }
  };

  // Only render if the user has enabled voice navigation in preferences
  if (!voiceNavigation) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-4 max-w-sm">
      <AnimatePresence>
        {assistantReply && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl relative border-2 border-blue-500/30"
          >
            <button 
              onClick={() => { setAssistantReply(null); stop(); }}
              className="absolute top-2 right-2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-blue-400 mb-2 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              AccessVote AI
            </div>
            <p className="text-sm font-medium leading-relaxed">{assistantReply}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleListening}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
          isListening ? 'bg-red-500 animate-pulse scale-110' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
        } text-white focus:ring-4 focus:ring-yellow-400`}
        aria-label={isListening ? 'Stop listening' : 'Start Voice Assistant (Alt+V)'}
        title="Voice Assistant (Alt+V)"
      >
        {isListening ? <Loader2 className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
      </button>

      {transcript && !assistantReply && (
        <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-100 text-xs font-bold text-slate-600 animate-fade-in-up">
          "{transcript}"
        </div>
      )}
    </div>
  );
}
