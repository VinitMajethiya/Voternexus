"use client";

import React from 'react';
import EVMSimulator from '@/components/civic/EVMSimulator';
import AffidavitDecoder from '@/components/civic/AffidavitDecoder';
import MisinfoShield from '@/components/civic/MisinfoShield';
import { motion } from 'framer-motion';
import { Info, ShieldAlert, FileText, Search, Gamepad2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Tab = 'EVM' | 'AFFIDAVIT' | 'MISINFO';

export default function LearnPage() {
  const [activeTab, setActiveTab] = React.useState<Tab>('EVM');
  const t = useTranslations('learn');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      <div>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 rounded-full w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl lg:text-6xl font-bold font-display"
          >
            {t('title')} <span className="text-phase">{t('power')}</span>
          </motion.h1>
          <p className="text-slate-500 text-lg">
            {t('desc')}
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 text-xs font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span>{t('ai_guidance')}</span>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex p-1.5 bg-slate-100 rounded-[2rem] w-fit mx-auto">
        <TabButton 
          active={activeTab === 'EVM'} 
          onClick={() => setActiveTab('EVM')}
          icon={<Gamepad2 className="w-4 h-4" />}
          label={t('tab_evm')}
        />
        <TabButton 
          active={activeTab === 'AFFIDAVIT'} 
          onClick={() => setActiveTab('AFFIDAVIT')}
          icon={<FileText className="w-4 h-4" />}
          label={t('tab_affidavit')}
        />
        <TabButton 
          active={activeTab === 'MISINFO'} 
          onClick={() => setActiveTab('MISINFO')}
          icon={<Search className="w-4 h-4" />}
          label={t('tab_misinfo')}
        />
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'EVM' && <EVMSimulator />}
        {activeTab === 'AFFIDAVIT' && <AffidavitDecoder />}
        {activeTab === 'MISINFO' && <MisinfoShield />}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-100">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-phase/10 rounded-lg">
                <Info className="w-5 h-5 text-phase" />
             </div>
             <h3 className="text-2xl font-bold text-slate-900">{t('why_title')}</h3>
          </div>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>{t('why_p1')}</p>
            <p>{t('why_p2')}</p>
            <ul className="list-disc list-inside space-y-2 font-medium">
              <li>{t('why_l1')}</li>
              <li>{t('why_l2')}</li>
              <li>{t('why_l3')}</li>
              <li>{t('why_l4')}</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-phase/20 blur-3xl rounded-full -mr-16 -mt-16" />
          <h3 className="text-2xl font-bold font-display">{t('privacy_title')}</h3>
          <p className="text-slate-400 leading-relaxed">
            {t('privacy_desc')}
          </p>
          <div className="pt-4">
             <button className="flex items-center gap-2 text-sm font-bold text-phase hover:underline transition-all">
                {t('privacy_cta')}
                <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-pill text-xs font-bold transition-all ${
        active 
          ? 'bg-white text-phase shadow-sm' 
          : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
