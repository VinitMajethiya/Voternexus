"use client";

import React from 'react';
import EligibilityQuiz from '@/components/civic/EligibilityQuiz';
import DocumentChecklist from '@/components/civic/DocumentChecklist';
import TimelineTracker from '@/components/civic/TimelineTracker';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function ReadinessPage() {
  const t = useTranslations('readiness');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      <div>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 rounded-full w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      {/* Quiz Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl lg:text-6xl font-bold font-display">{t('title')}</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            {t('desc')}
          </p>
        </div>
        <EligibilityQuiz />
      </section>

      {/* Timeline Section */}
      <section className="pt-12 border-t border-slate-100">
        <TimelineTracker />
      </section>

      {/* Checklist Section */}
      <section className="pt-12 border-t border-slate-100">
        <DocumentChecklist />
      </section>
    </div>
  );
}
