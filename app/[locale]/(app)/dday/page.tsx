"use client";

import React from 'react';
import BoothLocator from '@/components/civic/BoothLocator';
import QueueReporter from '@/components/civic/QueueReporter';
import VotedBadge from '@/components/civic/VotedBadge';
import { motion } from 'framer-motion';
import { Vote, MapPin, Share2, ShieldCheck } from 'lucide-react';

export default function DDayPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-phase p-8 md:p-12 rounded-[3rem] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="space-y-4 relative z-10 text-center md:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-bold font-display"
          >
            Today, You <br /> <span className="text-white/80">Make History.</span>
          </motion.h1>
          <p className="text-white/70 text-lg max-w-md">
            Your vote is your voice. We're here to make sure it's heard without friction.
          </p>
        </div>
        <div className="flex flex-col gap-4 relative z-10 w-full md:w-auto">
          <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center gap-4">
             <div className="p-2 bg-white/20 rounded-lg"><MapPin className="w-6 h-6" /></div>
             <div>
                <p className="text-[10px] font-bold uppercase text-white/60">Assigned Booth</p>
                <p className="font-bold">Pune West #101</p>
             </div>
          </div>
          <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center gap-4">
             <div className="p-2 bg-white/20 rounded-lg"><Vote className="w-6 h-6" /></div>
             <div>
                <p className="text-[10px] font-bold uppercase text-white/60">Polls Close In</p>
                <p className="font-bold">4h 32m</p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Utility Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-phase/10 rounded-lg text-phase">
              <MapPin className="w-6 h-6" />
           </div>
           <h2 className="text-3xl font-bold font-display">Booth Locator & Live Status</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-3">
              <BoothLocator />
           </div>
           <div className="lg:col-span-1">
              <QueueReporter boothId="pune_101" />
           </div>
        </div>
      </section>

      {/* Social Sharing Section */}
      <section className="pt-20 border-t border-slate-100 space-y-12">
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100 text-xs font-bold uppercase tracking-widest">
              <Share2 className="w-4 h-4 text-phase" />
              Spread the word
           </div>
           <h2 className="text-4xl lg:text-6xl font-bold font-display">Celebrate your Vote</h2>
        </div>
        <VotedBadge />
      </section>

      {/* Security Banner */}
      <div className="p-12 bg-slate-900 rounded-[3rem] text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-phase/5 blur-3xl pointer-events-none" />
        <div className="w-20 h-20 bg-phase/20 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-10 h-10 text-phase" />
        </div>
        <div className="space-y-4 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white">Privacy is our Priority</h3>
          <p className="text-slate-400">
            VoterNexus does not store your location, your Voter ID, or your identity. 
            All data processed in the Booth Locator and Badge Generator happens 
            locally in your browser or through anonymous, session-scoped API calls.
          </p>
        </div>
      </div>
    </div>
  );
}
