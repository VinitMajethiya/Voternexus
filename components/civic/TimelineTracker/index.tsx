"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Search,
  MapPin
} from 'lucide-react';
import { format, parseISO, isPast, isToday, differenceInCalendarDays } from 'date-fns';
import electionSchedule from '@/data/election-schedule.json';
import constituencies from '@/data/constituencies.json';

interface Milestone {
  label: string;
  date: string;
  key: string;
}

export default function TimelineTracker() {
  const [selectedConstituency, setSelectedConstituency] = useState(constituencies[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const schedule = useMemo(() => {
    return electionSchedule.find(s => s.constituency.toLowerCase() === selectedConstituency.toLowerCase()) || electionSchedule[0];
  }, [selectedConstituency]);

  const milestones: Milestone[] = [
    { label: "Nomination Deadline", date: schedule.nomination_deadline, key: 'nomination' },
    { label: "Withdrawal Deadline", date: schedule.withdrawal_deadline, key: 'withdrawal' },
    { label: "Voter Registration Cutoff", date: schedule.registration_cutoff, key: 'registration' },
    { label: "MCC Start", date: schedule.mcc_start, key: 'mcc' },
    { label: "Polling Day", date: schedule.polling_day, key: 'polling' },
    { label: "Counting Day", date: schedule.counting_day, key: 'counting' }
  ];

  const filteredConstituencies = constituencies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Header & Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold font-display">Road to the Booth</h2>
          <p className="text-slate-500">Your personalized election timeline for <span className="text-phase font-bold">{schedule.constituency}, {schedule.state}</span>.</p>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold hover:border-phase transition-all shadow-sm"
          >
            <MapPin className="w-4 h-4 text-phase" />
            <span>Change Constituency</span>
            <ChevronRight className={`w-4 h-4 transform transition-transform ${isSelectorOpen ? 'rotate-90' : ''}`} />
          </button>

          {isSelectorOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search city or state..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-phase/20"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredConstituencies.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedConstituency(c.id);
                      setIsSelectorOpen(false);
                    }}
                    className="w-full px-6 py-3 text-left hover:bg-slate-50 flex flex-col gap-0.5 transition-colors"
                  >
                    <span className="text-sm font-bold text-slate-900">{c.name}</span>
                    <span className="text-xs text-slate-400">{c.state}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden md:block" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative">
          {milestones.map((m, idx) => {
            const date = parseISO(m.date);
            const past = isPast(date) && !isToday(date);
            const today = isToday(date);
            const daysLeft = differenceInCalendarDays(date, new Date());
            const isNext = daysLeft > 0 && (idx === 0 || isPast(parseISO(milestones[idx-1].date)));

            return (
              <motion.div 
                key={m.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex md:flex-col items-center gap-6 md:gap-8 flex-1 w-full"
              >
                {/* Dot */}
                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-500 ${
                  past ? 'bg-slate-50 border-slate-200 text-slate-400' : 
                  today || isNext ? 'bg-white border-phase text-phase shadow-lg scale-110' : 
                  'bg-white border-slate-100 text-slate-200'
                }`}>
                  {past ? <CheckCircle2 className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                  {(today || isNext) && (
                    <div className="absolute inset-0 rounded-full bg-phase/20 animate-ping" />
                  )}
                </div>

                {/* Content */}
                <div className="text-left md:text-center space-y-2 md:max-w-[120px]">
                  <p className={`text-xs font-black uppercase tracking-widest ${past ? 'text-slate-400' : 'text-slate-900'}`}>
                    {m.label}
                  </p>
                  <p className={`text-sm font-bold ${past ? 'text-slate-300' : 'text-phase'}`}>
                    {format(date, 'MMM dd, yyyy')}
                  </p>
                  {isNext && daysLeft > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-phase/10 rounded-lg text-[10px] font-bold text-phase">
                      <Clock className="w-3 h-3" />
                      {daysLeft} days left
                    </div>
                  )}
                </div>

                {/* Mobile Vertical Line */}
                {idx < milestones.length - 1 && (
                  <div className="absolute top-12 left-6 w-0.5 h-full bg-slate-100 md:hidden" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Status Banner */}
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-6">
        <div className="p-4 bg-white rounded-2xl shadow-sm text-phase">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900">Next Big Step: {milestones.find(m => differenceInCalendarDays(parseISO(m.date), new Date()) > 0)?.label}</h4>
          <p className="text-sm text-slate-500">Stay prepared. The window for voter registration usually closes 3 weeks before polling.</p>
        </div>
      </div>
    </div>
  );
}
