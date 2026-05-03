"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  HelpCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import TriageFlow from '@/components/civic/TriageFlow';

interface Document {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const DOCUMENTS: Document[] = [
  { id: 'epic', name: 'Voter ID Card (EPIC)', icon: '🪪', description: 'The official elector photo identity card.' },
  { id: 'aadhaar', name: 'Aadhaar Card', icon: '🪪', description: 'UIDAI issued biometric identity card.' },
  { id: 'passport', name: 'Passport', icon: '📘', description: 'Valid Indian passport.' },
  { id: 'dl', name: 'Driving License', icon: '🚗', description: 'Issued by Regional Transport Office.' },
  { id: 'pan', name: 'PAN Card', icon: '📋', description: 'Income tax identity card.' },
  { id: 'mnrega', name: 'MNREGA Job Card', icon: '📄', description: 'National Rural Employment card.' },
  { id: 'passbook', name: 'Bank Passbook', icon: '🏦', description: 'Passbook with photo issued by Bank/Post Office.' },
  { id: 'health', name: 'Health Insurance Card', icon: '💊', description: 'Smart card issued under Ministry of Labour.' },
];

export default function DocumentChecklist() {
  const t = useTranslations('checklist');
  const [selected, setSelected] = useState<string[]>([]);
  const [isTriageOpen, setIsTriageOpen] = useState(false);

  const toggle = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isReady = selected.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold font-display">{t('title')}</h2>
          <p className="text-slate-500">{t('desc')}</p>
        </div>
        <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isReady ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {isReady ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {isReady ? t('ready') : t('not_ready')}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DOCUMENTS.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => toggle(doc.id)}
            className={`group p-6 rounded-bento border-2 cursor-pointer transition-all ${
              selected.includes(doc.id) 
                ? 'border-phase bg-phase/5 shadow-md' 
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <div className="flex flex-col h-full justify-between gap-6">
              <div className="space-y-4">
                <div className="text-4xl">{doc.icon}</div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-phase transition-colors">{doc.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{doc.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected.includes(doc.id) ? 'bg-phase border-phase' : 'border-slate-200'
                }`}>
                  {selected.includes(doc.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                {selected.includes(doc.id) && (
                   <span className="text-[10px] font-black text-phase uppercase tracking-widest">Verified</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass p-6 rounded-bento border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{t('lost_id_title')}</h4>
            <p className="text-sm text-slate-500">{t('lost_id_desc')}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsTriageOpen(true)}
          className="px-6 py-3 bg-slate-900 text-white rounded-pill font-bold hover:bg-slate-800 transition-all flex items-center gap-2 group"
        >
          {t('lost_id_cta')}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <TriageFlow isOpen={isTriageOpen} onClose={() => setIsTriageOpen(false)} />
    </div>
  );
}
