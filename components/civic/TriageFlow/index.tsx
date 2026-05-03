"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  HelpCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import triageData from '@/data/triage-tree.json';

interface TriageOption {
  label: string;
  next_id: string;
}

interface TriageTerminal {
  title: string;
  steps: string[];
  cta_label: string;
  cta_url: string;
}

interface TriageNode {
  id: string;
  question?: string;
  options?: TriageOption[];
  terminal?: TriageTerminal;
}

const typedTriageData = triageData as Record<string, TriageNode>;

export default function TriageFlow({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [history, setHistory] = useState<string[]>(['start']);
  const currentNodeId = history[history.length - 1];
  const currentNode = typedTriageData[currentNodeId];

  const handleOptionSelect = (nextId: string) => {
    setHistory([...history, nextId]);
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  const reset = () => {
    setHistory(['start']);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-phase rounded-lg">
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Voter Support Triage</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentNodeId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {currentNode.terminal ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-green-50 rounded-2xl">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold font-display text-slate-900">
                      {currentNode.terminal.title}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {currentNode.terminal.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-500">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>

                  <a 
                    href={currentNode.terminal.cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {currentNode.terminal.cta_label}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-display text-slate-900 leading-tight">
                    {currentNode.question}
                  </h2>

                  <div className="grid gap-3">
                    {currentNode.options?.map((option) => (
                      <button
                        key={option.next_id}
                        onClick={() => handleOptionSelect(option.next_id)}
                        className="w-full p-4 rounded-2xl border border-slate-100 bg-white hover:border-phase hover:bg-phase/5 text-left transition-all group flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-700 group-hover:text-phase">
                          {option.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-phase transform group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          {history.length > 1 ? (
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-phase transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          ) : (
            <div />
          )}
          <button 
            onClick={reset}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
          >
            Start Over
          </button>
        </div>
      </motion.div>
    </div>
  );
}
