"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Vote, ArrowRight, ShieldCheck, Gamepad2, FileSearch, MapPin } from 'lucide-react';
import { usePhase } from '@/components/layout/PhaseProvider';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function LandingPage() {
  const { phase } = usePhase();
  const t = useTranslations('landing');

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="glass sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-phase rounded-lg">
              <Vote className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">
              Voter<span className="text-phase">Nexus</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <Link href="/readiness" className="btn-primary">
              {t('get_started')}
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-20 lg:py-32 text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-slate-50 text-slate-600 border border-slate-100 text-sm font-medium"
          >
            <ShieldCheck className="w-4 h-4 text-phase" />
            <span>{t('official_tool')}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-8xl font-bold tracking-tight leading-[1.05]"
          >
            {t('hero_title')} <br />
            <span className="text-phase">{t('hero_nexus')}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto"
          >
            {t('hero_desc')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/readiness" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
              {t('prepare')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/learn" className="px-8 py-3 bg-white border border-slate-200 rounded-pill font-bold hover:bg-slate-50 transition-all w-full sm:w-auto">
              {t('simulate')}
            </Link>
          </motion.div>
        </section>

        {/* Feature Teasers */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureTeaser 
            icon={<Gamepad2 className="w-6 h-6" />}
            title={t('evm_title')}
            desc={t('evm_desc')}
          />
          <FeatureTeaser 
            icon={<FileSearch className="w-6 h-6" />}
            title={t('affidavit_title')}
            desc={t('affidavit_desc')}
          />
          <FeatureTeaser 
            icon={<MapPin className="w-6 h-6" />}
            title={t('booth_title')}
            desc={t('booth_desc')}
          />
        </section>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-400">{t('footer')}</p>
      </footer>
    </div>
  );
}

function FeatureTeaser({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bento-card space-y-4 group">
      <div className="p-3 bg-slate-50 rounded-2xl w-fit text-phase group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
