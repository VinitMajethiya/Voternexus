'use client';

import React, { useState } from 'react';
import { useAccessibilityPrefs } from '@/hooks/useAccessibilityPrefs';
import { Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ISLVideoPanel() {
  const { signLanguageVideos } = useAccessibilityPrefs();
  const [isMinimized, setIsMinimized] = useState(false);
  
  if (!signLanguageVideos) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className={`fixed top-24 right-4 z-[9900] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 transition-all ${
          isMinimized ? 'w-48 h-32' : 'w-72 h-48'
        }`}
        aria-label="Indian Sign Language Interpreter Panel"
      >
        {/* Mock Video Feed Placeholder */}
        <div className="w-full h-full relative bg-slate-800 flex items-center justify-center">
           {/* In a real implementation, a <video> element or WebRTC stream would go here */}
           <div className="flex flex-col items-center opacity-50">
             <span className="text-4xl mb-2">🤟</span>
             <p className="text-white font-bold text-xs text-center px-4">
               ISL Interpreter<br/>(Live Feed Placeholder)
             </p>
           </div>

           {/* Controls */}
           <div className="absolute top-2 right-2 flex gap-2">
             <button 
               onClick={() => setIsMinimized(!isMinimized)}
               className="p-1.5 bg-black/50 text-white rounded hover:bg-black/80 transition-colors focus:ring-2 focus:ring-yellow-400"
               aria-label={isMinimized ? "Maximize ISL Panel" : "Minimize ISL Panel"}
             >
               {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
             </button>
           </div>
           
           <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-sm animate-pulse flex items-center gap-1">
             <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
             LIVE
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
