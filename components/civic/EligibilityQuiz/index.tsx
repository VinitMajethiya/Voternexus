"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ExternalLink,
  UserCheck,
  Flag,
  Search
} from 'lucide-react';
import { useTranslations } from 'next-intl';

type Step = 'AGE' | 'CITIZEN' | 'REGISTERED' | 'RESULT';

interface QuizState {
  ageOk: boolean | null;
  citizenOk: boolean | null;
  registeredOk: boolean | null;
}

export default function EligibilityQuiz() {
  const t = useTranslations('quiz');
  const [step, setStep] = useState<Step>('AGE');
  const [state, setState] = useState<QuizState>({
    ageOk: null,
    citizenOk: null,
    registeredOk: null,
  });

  const handleAnswer = (answer: boolean | 'NOT_SURE') => {
    if (step === 'AGE') {
      if (answer === false) {
        setStep('RESULT');
        setState({ ...state, ageOk: false });
      } else {
        setState({ ...state, ageOk: true });
        setStep('CITIZEN');
      }
    } else if (step === 'CITIZEN') {
      if (answer === false) {
        setStep('RESULT');
        setState({ ...state, citizenOk: false });
      } else {
        setState({ ...state, citizenOk: true });
        setStep('REGISTERED');
      }
    } else if (step === 'REGISTERED') {
      setState({ ...state, registeredOk: answer === true });
      setStep('RESULT');
    }
  };

  const reset = () => {
    setStep('AGE');
    setState({ ageOk: null, citizenOk: null, registeredOk: null });
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass rounded-bento p-8 md:p-12 shadow-2xl border border-white/20">
      <AnimatePresence mode="wait">
        {step === 'AGE' && (
          <QuizStep 
            key="age"
            icon={<UserCheck className="w-10 h-10 text-phase" />}
            question={t('q1_title')}
            description={t('q1_desc')}
            onAnswer={(ans) => handleAnswer(ans)}
            yesLabel={t('yes')}
            noLabel={t('no')}
          />
        )}

        {step === 'CITIZEN' && (
          <QuizStep 
            key="citizen"
            icon={<Flag className="w-10 h-10 text-phase" />}
            question={t('q2_title')}
            description={t('q2_desc')}
            onAnswer={(ans) => handleAnswer(ans)}
            onBack={() => setStep('AGE')}
            yesLabel={t('yes')}
            noLabel={t('no')}
          />
        )}

        {step === 'REGISTERED' && (
          <QuizStep 
            key="registered"
            icon={<Search className="w-10 h-10 text-phase" />}
            question={t('q3_title')}
            description={t('q3_desc')}
            onAnswer={(ans) => handleAnswer(ans)}
            onBack={() => setStep('CITIZEN')}
            showNotSure
            yesLabel={t('yes')}
            noLabel={t('no')}
            notSureLabel={t('not_sure')}
          />
        )}

        {step === 'RESULT' && (
          <QuizResult 
            key="result"
            state={state}
            onReset={reset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function QuizStep({ 
  icon, 
  question, 
  description, 
  onAnswer, 
  onBack, 
  showNotSure = false,
  yesLabel,
  noLabel,
  notSureLabel
}: { 
  icon: React.ReactNode, 
  question: string, 
  description: string, 
  onAnswer: (ans: any) => void,
  onBack?: () => void,
  showNotSure?: boolean,
  yesLabel: string,
  noLabel: string,
  notSureLabel?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-slate-50 rounded-2xl">
          {icon}
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold font-display">{question}</h2>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={() => onAnswer(true)}
          className="btn-primary flex items-center justify-center gap-2 group"
        >
          {yesLabel}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={() => onAnswer(false)}
          className="w-full py-4 px-6 bg-white border border-gray-200 text-slate-700 rounded-pill font-bold hover:bg-slate-50 transition-all"
        >
          {noLabel}
        </button>
        {showNotSure && (
          <button 
            onClick={() => onAnswer('NOT_SURE')}
            className="w-full py-4 px-6 bg-slate-100 text-slate-600 rounded-pill font-bold hover:bg-slate-200 transition-all"
          >
            {notSureLabel}
          </button>
        )}
      </div>

      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-phase transition-colors text-sm font-medium mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      )}
    </motion.div>
  );
}

function QuizResult({ state, onReset }: { state: QuizState, onReset: () => void }) {
  const t = useTranslations('quiz');
  const isEligible = state.ageOk && state.citizenOk;
  const isReady = isEligible && state.registeredOk;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className={`p-6 rounded-full ${isReady ? 'bg-green-100' : 'bg-amber-100'}`}>
          <CheckCircle2 className={`w-12 h-12 ${isReady ? 'text-green-600' : 'text-amber-600'}`} />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-bold font-display">
            {isReady ? t('result_eligible_title') : isEligible ? t('result_partial_title') : t('result_ineligible_title')}
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            {isReady 
              ? t('result_eligible_body')
              : isEligible 
                ? t('result_partial_body')
                : t('result_ineligible_body')}
          </p>
        </div>
      </div>

      <div className="pt-4 space-y-4">
        <button 
          onClick={onReset}
          className="text-sm font-bold text-phase hover:underline"
        >
          {t('restart')}
        </button>
      </div>
    </motion.div>
  );
}
