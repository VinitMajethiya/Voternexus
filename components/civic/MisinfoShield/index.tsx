"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle,
  MessageSquare,
  ExternalLink,
  Share2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { FactCheckResult } from '@/types';

const VERDICT_THEMES: Record<string, { color: string, bg: string, icon: any, label: string }> = {
  TRUE: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2, label: 'Verified True' },
  PARTIALLY_TRUE: { color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertTriangle, label: 'Partially True' },
  FALSE: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: 'False Claim' },
  UNVERIFIED: { color: 'text-slate-500', bg: 'bg-slate-50', icon: HelpCircle, label: 'Unverified' },
  OPINION: { color: 'text-blue-600', bg: 'bg-blue-50', icon: MessageSquare, label: 'Opinion / Personal View' }
};

export default function MisinfoShield() {
  const [claim, setClaim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini/factcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim })
      });

      if (!response.ok) throw new Error('Failed to verify claim');
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Input Section */}
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-display">Misinformation Shield</h2>
          <p className="text-slate-500">Paste a viral claim, WhatsApp forward, or news headline to verify its accuracy.</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea 
              placeholder="e.g., Voting date has been changed in Pune constituency..."
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              className="w-full p-6 bg-white border border-slate-200 rounded-3xl min-h-[160px] focus:ring-2 focus:ring-phase/20 focus:border-phase outline-none transition-all shadow-sm resize-none"
              maxLength={500}
            />
            <div className="absolute bottom-4 right-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {claim.length} / 500
            </div>
          </div>
          
          <button 
            onClick={handleVerify}
            disabled={loading || claim.length < 10}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Verify Claim Accuracy
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            {/* Verdict Card */}
            {(() => {
              const theme = VERDICT_THEMES[result.verdict];
              const Icon = theme.icon;
              return (
                <div className={`p-8 rounded-[2rem] border-2 ${theme.bg} ${theme.color} border-current/10 space-y-6 shadow-xl`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Icon className="w-8 h-8" />
                      <span className="text-2xl font-black uppercase tracking-tighter">{theme.label}</span>
                    </div>
                    <div className="px-3 py-1 bg-white/50 rounded-full text-xs font-bold">
                      {result.confidence}% Confidence
                    </div>
                  </div>

                  <p className="text-xl font-bold leading-relaxed text-slate-900">
                    &quot;{result.explanation}&quot;
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((source, idx) => (
                      <a 
                        key={idx}
                        href={source.url}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-white/40 hover:bg-white/60 rounded-xl text-xs font-bold transition-all border border-current/5"
                      >
                        {source.is_official && <ShieldCheck className="w-3 h-3" />}
                        {source.publisher}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Share & Disclaimer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <AlertCircle className="w-4 h-4" />
                AI-Assisted Check. Exercise Judgment.
              </div>
              <button className="flex items-center gap-2 px-6 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-600 transition-all">
                <Share2 className="w-4 h-4" />
                Share Fact-Check Report
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
