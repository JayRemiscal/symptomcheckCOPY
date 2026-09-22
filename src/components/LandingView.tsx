import React from 'react';
import { Activity, Brain, Database } from 'lucide-react';
import { SupportedLanguage } from '../data/translations';
import { LanguageService } from '../services/LanguageService';

interface LandingViewProps {
  currentLanguage?: SupportedLanguage;
  onStartAssessment: () => void;
  onOpenAdmin?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  currentLanguage,
  onStartAssessment,
}) => {
  const t = (key: string) => LanguageService.t(key, currentLanguage);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20 max-w-5xl mx-auto w-full text-center">
      {/* Hero Header */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-[1.2] max-w-3xl">
        {t('heroTitle')}
      </h1>


      {/* Hero Subtitle */}
      <p className="mt-4 sm:mt-6 text-slate-500 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-normal">
        {t('heroSub')}
      </p>

      {/* Start Symptom Assessment CTA Button */}
      <button
        id="start-assessment-btn"
        onClick={onStartAssessment}
        className="mt-8 px-6 py-3 sm:px-7 sm:py-3.5 bg-[#0d9488] hover:bg-[#0f766e] active:scale-[0.99] text-white font-medium text-base rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer group"
      >
        <span>{t('startAssessment')}</span>
        <div className="w-5 h-5 rounded-full border-[1.5px] border-white/90 flex items-center justify-center ml-0.5 group-hover:scale-105 transition-transform">
          <svg
            className="w-2.5 h-2.5 fill-white text-white ml-0.5"
            viewBox="0 0 24 24"
          >
            <polygon points="6,4 18,12 6,20" />
          </svg>
        </div>
      </button>

      {/* 3 Step Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-16 text-left">
        {/* Card 1: Select symptoms */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div>
            <div className="text-[#0d9488] mb-5">
              <Activity className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              {t('step1Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {t('step1Desc')}
            </p>
          </div>
        </div>

        {/* Card 2: Review selections */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div>
            <div className="text-[#0d9488] mb-5">
              <Brain className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              {t('step2Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {t('step2Desc')}
            </p>
          </div>
        </div>

        {/* Card 3: See the reasoning */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-[0_2px_12px_-3px_rgba(15,23,42,0.06)] flex flex-col justify-between">
          <div>
            <div className="text-[#0d9488] mb-5">
              <Database className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              {t('step3Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {t('step3Desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
