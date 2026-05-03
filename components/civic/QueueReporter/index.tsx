"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface QueueStatus {
  status: 'short' | 'moderate' | 'long' | 'unknown';
  report_count: number;
  last_reported: number | null;
}

export default function QueueReporter({ boothId }: { boothId: string }) {
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [boothId]);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/queue?booth_id=${boothId}`);
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error('Failed to fetch queue status');
    }
  };

  const handleReport = async (level: 'short' | 'moderate' | 'long') => {
    setReporting(true);
    try {
      const res = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booth_id: boothId, wait_level: level })
      });
      if (res.ok) {
        setSubmitted(true);
        fetchStatus();
      }
    } catch (err) {
      console.error('Failed to submit report');
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="bento-card bg-slate-900 text-white space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h4 className="font-bold">Live Queue Status</h4>
          <p className="text-xs text-slate-400">Real-time reports from fellow voters</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          status?.status === 'short' ? 'bg-green-500/20 text-green-400' :
          status?.status === 'moderate' ? 'bg-amber-500/20 text-amber-400' :
          status?.status === 'long' ? 'bg-red-500/20 text-red-400' :
          'bg-slate-500/20 text-slate-400'
        }`}>
          {status?.status || 'Calculating...'}
        </div>
      </div>

      <div className="flex items-center gap-6 py-4 border-y border-white/10">
        <div className="flex flex-col items-center flex-1">
          <span className="text-2xl font-black">{status?.report_count || 0}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Recent Reports</span>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="flex flex-col items-center flex-1">
          <span className="text-sm font-bold">
            {status?.last_reported ? new Date(status.last_reported).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Last Update</span>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">How long is the wait now?</p>
        
        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center gap-2 text-green-400 text-sm font-bold"
          >
            <CheckCircle2 className="w-4 h-4" />
            Thanks for reporting!
          </motion.div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <ReportButton 
              onClick={() => handleReport('short')} 
              level="Short" 
              color="bg-green-500" 
              disabled={reporting}
            />
            <ReportButton 
              onClick={() => handleReport('moderate')} 
              level="Moderate" 
              color="bg-amber-500" 
              disabled={reporting}
            />
            <ReportButton 
              onClick={() => handleReport('long')} 
              level="Long" 
              color="bg-red-500" 
              disabled={reporting}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-[10px] text-slate-500 italic">
        <AlertCircle className="w-3 h-3" />
        Anonymous reporting. No PII stored.
      </div>
    </div>
  );
}

function ReportButton({ onClick, level, color, disabled }: { onClick: () => void, level: string, color: string, disabled: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${color} text-white`}
    >
      {disabled ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : level}
    </button>
  );
}
