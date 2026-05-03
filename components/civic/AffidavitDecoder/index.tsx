"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Search, 
  ExternalLink, 
  AlertCircle,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Scale,
  CreditCard,
  Banknote,
  Loader2
} from 'lucide-react';
import { AffidavitSummary } from '@/types';

export default function AffidavitDecoder() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AffidavitSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/gemini/affidavit-vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType: file.type })
        });

        if (!response.ok) throw new Error('Failed to analyze affidavit image');
        
        const data = await response.json();
        // Fallback for missing source URL in image uploads
        if (!data.source_url) data.source_url = '#';
        setResult(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDecode = async (inputUrl?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/affidavit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl || url })
      });

      if (!response.ok) throw new Error('Failed to decode affidavit');
      
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
          <h2 className="text-3xl font-bold font-display">Affidavit Decoder</h2>
          <p className="text-slate-500">Paste an official affidavit URL (MyNeta or ECI) to get a summarized bento view.</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Paste affidavit PDF URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-phase/20 focus:border-phase outline-none transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => handleDecode()}
            disabled={loading || !url}
            className="btn-primary px-8 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
            Decode
          </button>
        </div>
        
        <div className="relative">
           <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
           <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-300"><span className="bg-white px-2">OR UPLOAD IMAGE</span></div>
        </div>

        <div className="flex justify-center">
          <label className="btn-primary px-8 py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 bg-slate-800 hover:bg-slate-700 w-full md:w-auto">
             <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={loading} />
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
             Upload Scanned Affidavit
          </label>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Disclaimer */}
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4 text-amber-800 text-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>
                <strong>Mandatory Disclaimer:</strong> This is an automated AI summary of an official legal document. 
                VoterNexus does not guarantee 100% accuracy. Always verify with the original affidavit before 
                drawing conclusions.
              </p>
            </div>

            {/* Bento Grid Output */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto">
              {/* Assets Card */}
              <div className="md:col-span-2 bento-card flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-green-50 rounded-xl text-green-600">
                      <Banknote className="w-6 h-6" />
                   </div>
                   <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                     result.confidence_score > 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                   }`}>
                     Confidence: {result.confidence_score}%
                   </div>
                </div>
                <div className="mt-8 space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Declared Assets</p>
                  <h3 className="text-4xl font-black text-slate-900">
                    {result.assets_inr ? `₹${result.assets_inr.toLocaleString('en-IN')}` : 'Not Declared'}
                  </h3>
                </div>
              </div>

              {/* Liabilities Card */}
              <div className="md:col-span-2 bento-card flex flex-col justify-between">
                <div className="p-3 bg-red-50 rounded-xl text-red-600 w-fit">
                   <CreditCard className="w-6 h-6" />
                </div>
                <div className="mt-8 space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Liabilities</p>
                  <h3 className="text-4xl font-black text-slate-900">
                    {result.liabilities_inr ? `₹${result.liabilities_inr.toLocaleString('en-IN')}` : 'Zero'}
                  </h3>
                </div>
              </div>

              {/* Criminal Cases Card */}
              <div className="md:col-span-2 row-span-2 bento-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-700">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold">Criminal Cases</h4>
                </div>
                
                {result.criminal_cases.length > 0 ? (
                  <div className="space-y-4">
                    {result.criminal_cases.map((c, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">IPC Section {c.ipc_section}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                            c.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                          }`}>{c.status}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800">{c.plain_description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                     <CheckCircle2 className="w-12 h-12 mb-4" />
                     <p className="font-bold">No Criminal Records Found</p>
                  </div>
                )}
              </div>

              {/* Education Card */}
              <div className="md:col-span-1 bento-card">
                 <div className="p-2 bg-blue-50 rounded-lg text-blue-600 w-fit mb-4">
                    <GraduationCap className="w-5 h-5" />
                 </div>
                 <p className="text-xs font-bold text-slate-400 uppercase mb-1">Education</p>
                 <p className="font-bold text-slate-800">{result.education || 'Not Specified'}</p>
              </div>

              {/* Profession Card */}
              <div className="md:col-span-1 bento-card">
                 <div className="p-2 bg-purple-50 rounded-lg text-purple-600 w-fit mb-4">
                    <Briefcase className="w-5 h-5" />
                 </div>
                 <p className="text-xs font-bold text-slate-400 uppercase mb-1">Profession</p>
                 <p className="font-bold text-slate-800">{result.profession || 'Not Specified'}</p>
              </div>

              {/* Source Card */}
              <div className="md:col-span-2 bento-card bg-slate-900 text-white flex items-center justify-between">
                <div className="space-y-1">
                   <h4 className="font-bold">Official Document</h4>
                   <p className="text-xs text-slate-400">Verified from ECI / MyNeta Servers</p>
                </div>
                <a 
                  href={result.source_url} 
                  target="_blank" 
                  className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
