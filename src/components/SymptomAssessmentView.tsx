import React, { useMemo, useState } from 'react';
import { LanguageService } from '../services/LanguageService';
import { SupportedLanguage } from '../data/translations';
import {
  AlertTriangle,
  Brain,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
  Sparkles,
  Thermometer,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import { SYMPTOM_DEFINITIONS } from '../data/symptoms';
import { SymptomCategory, SymptomDefinition } from '../types';

interface SymptomAssessmentViewProps {
  selectedSymptoms: string[];
  currentLanguage: SupportedLanguage;
  onToggleSymptom: (symptomId: string) => void;
  onClearSymptoms: () => void;
  onApplyPreset: (symptomIds: string[]) => void;
  onEvaluate: () => void;
}

export const SymptomAssessmentView: React.FC<SymptomAssessmentViewProps> = ({
  selectedSymptoms,
  currentLanguage,
  onToggleSymptom,
  onClearSymptoms,
  onApplyPreset,
  onEvaluate,
}) => {
  const t = (key: string) => LanguageService.t(key, currentLanguage);

  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<SymptomCategory, boolean>>({
    respiratory: false,
    systemic: false,
    neurological_general: false,
  });

  const toggleSection = (category: SymptomCategory) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredSymptoms = useMemo(() => {
    if (!searchQuery.trim()) return SYMPTOM_DEFINITIONS;
    const query = searchQuery.toLowerCase().trim();
    return SYMPTOM_DEFINITIONS.filter(
      (s) =>
        s.label.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const categorizedSymptoms = useMemo(() => {
    const groups: Record<SymptomCategory, SymptomDefinition[]> = {
      respiratory: [],
      systemic: [],
      neurological_general: [],
    };
    for (const item of filteredSymptoms) {
      if (groups[item.category]) {
        groups[item.category].push(item);
      }
    }
    return groups;
  }, [filteredSymptoms]);

  const countSelectedInCategory = (category: SymptomCategory) => {
    const items = SYMPTOM_DEFINITIONS.filter((s) => s.category === category);
    return items.filter((s) => selectedSymptoms.includes(s.id)).length;
  };

  const quickPresets = [
    {
      id: 'preset_airway_emergency',
      label: 'Airway Emergency',
      badge: 'Critical',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      symptoms: ['shortness_of_breath', 'cyanosis'],
    },
    {
      id: 'preset_meningitis',
      label: 'Meningeal Triad',
      badge: 'Critical',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      symptoms: ['high_fever', 'stiff_neck', 'severe_headache'],
    },
    {
      id: 'preset_flu',
      label: 'Severe Flu',
      badge: 'Moderate',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      symptoms: ['fever', 'chills', 'body_aches', 'fatigue'],
    },
    {
      id: 'preset_cold',
      label: 'Mild Cold',
      badge: 'Mild',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      symptoms: ['sore_throat', 'dry_cough'],
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-60px)] pb-32">
      {/* Header Info Card / Dashboard Hero Banner */}
      <div className="px-3.5 sm:px-5 pt-4 sm:pt-6">
        <div className="max-w-4xl mx-auto space-y-3">


          <div className="bg-gradient-to-br from-white via-sky-50/50 to-teal-50/40 border border-teal-100/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_4px_20px_-4px_rgba(13,148,136,0.06)]">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  {t('assessmentTitle')}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  {t('assessmentSub')}
                </p>
              </div>

            </div>

            {/* Quick Clinical Simulation Presets */}
            <div className="mt-4 pt-3.5 border-t border-teal-100/60">
              <div className="flex items-center justify-between gap-1.5 text-xs font-semibold text-slate-600 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{t('presets')}</span>
                </span>
                <span className="text-[10px] text-slate-400 sm:hidden">Swipe &rarr;</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:flex-wrap">
                {quickPresets.map((preset) => (
                  <button
                    key={preset.id}
                    id={`btn-preset-${preset.id}`}
                    onClick={() => onApplyPreset(preset.symptoms)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 border border-slate-200/90 hover:border-teal-300 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all shrink-0 whitespace-nowrap active:scale-95"
                  >
                    <span>{preset.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold border shrink-0 ${preset.badgeColor}`}>
                      {preset.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full px-3.5 sm:px-5 pt-4 sm:pt-6 flex-1">
        {/* Fast Search Filter */}
        <div className="relative mb-4 sm:mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="input-symptom-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms (e.g., cough, fever, chest pain, wheezing)..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200/90 bg-white text-slate-900 placeholder:text-slate-400 text-base sm:text-sm focus:outline-none focus:ring-3 focus:ring-teal-500/20 focus:border-teal-500 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Stack */}
        <div className="space-y-4 sm:space-y-5">
          {/* 1. Respiratory Section */}
          <div
            id="section-respiratory"
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.04)] overflow-hidden transition-all hover:border-teal-100"
          >
            <button
              id="header-collapse-respiratory"
              onClick={() => toggleSection('respiratory')}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50/60 transition-colors text-left border-b border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">
                      Respiratory
                    </span>
                    {countSelectedInCategory('respiratory') > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold whitespace-nowrap shrink-0">
                        {countSelectedInCategory('respiratory')} selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dry Cough, Shortness of Breath, Sore Throat, Wheezing, etc.
                  </p>
                </div>
              </div>
              <div className="p-1 text-slate-400 hover:text-slate-600">
                {collapsedSections.respiratory ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </div>
            </button>

            {!collapsedSections.respiratory && (
              <div className="p-3 sm:p-4 divide-y divide-slate-100">
                {categorizedSymptoms.respiratory.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No matching respiratory symptoms found.
                  </p>
                ) : (
                  categorizedSymptoms.respiratory.map((symptom) => {
                    const isChecked = selectedSymptoms.includes(symptom.id);
                    return (
                      <label
                        key={symptom.id}
                        htmlFor={`checkbox-${symptom.id}`}
                        className={`flex items-start gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all ${isChecked
                          ? 'bg-gradient-to-r from-teal-50/80 via-sky-50/40 to-white border border-teal-200/90 shadow-2xs'
                          : 'hover:bg-slate-50/70 border border-transparent'
                          }`}
                      >
                        <input
                          type="checkbox"
                          id={`checkbox-${symptom.id}`}
                          checked={isChecked}
                          onChange={() => onToggleSymptom(symptom.id)}
                          className="mt-1 h-5 w-5 rounded-md border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer accent-teal-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-bold ${isChecked ? 'text-teal-950' : 'text-slate-800'
                                }`}
                            >
                              {symptom.label}
                            </span>
                            {symptom.isEmergencyFlag && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                Red Flag
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {symptom.description}
                          </p>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* 2. Systemic Section */}
          <div
            id="section-systemic"
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.04)] overflow-hidden transition-all hover:border-teal-100"
          >
            <button
              id="header-collapse-systemic"
              onClick={() => toggleSection('systemic')}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50/60 transition-colors text-left border-b border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">
                      Systemic
                    </span>
                    {countSelectedInCategory('systemic') > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold whitespace-nowrap shrink-0">
                        {countSelectedInCategory('systemic')} selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fever, Fatigue, Chills, Body Aches, etc.
                  </p>
                </div>
              </div>
              <div className="p-1 text-slate-400 hover:text-slate-600">
                {collapsedSections.systemic ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </div>
            </button>

            {!collapsedSections.systemic && (
              <div className="p-3 sm:p-4 divide-y divide-slate-100">
                {categorizedSymptoms.systemic.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No matching systemic symptoms found.
                  </p>
                ) : (
                  categorizedSymptoms.systemic.map((symptom) => {
                    const isChecked = selectedSymptoms.includes(symptom.id);
                    return (
                      <label
                        key={symptom.id}
                        htmlFor={`checkbox-${symptom.id}`}
                        className={`flex items-start gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all ${isChecked
                          ? 'bg-gradient-to-r from-teal-50/80 via-sky-50/40 to-white border border-teal-200/90 shadow-2xs'
                          : 'hover:bg-slate-50/70 border border-transparent'
                          }`}
                      >
                        <input
                          type="checkbox"
                          id={`checkbox-${symptom.id}`}
                          checked={isChecked}
                          onChange={() => onToggleSymptom(symptom.id)}
                          className="mt-1 h-5 w-5 rounded-md border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer accent-teal-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-bold ${isChecked ? 'text-teal-950' : 'text-slate-800'
                                }`}
                            >
                              {symptom.label}
                            </span>
                            {symptom.isEmergencyFlag && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                Red Flag
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {symptom.description}
                          </p>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* 3. Neurological / General Section */}
          <div
            id="section-neurological-general"
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.04)] overflow-hidden transition-all hover:border-teal-100"
          >
            <button
              id="header-collapse-neurological"
              onClick={() => toggleSection('neurological_general')}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50/60 transition-colors text-left border-b border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">
                      Neurological / General
                    </span>
                    {countSelectedInCategory('neurological_general') > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold whitespace-nowrap shrink-0">
                        {countSelectedInCategory('neurological_general')} selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Severe Headache, Loss of Taste/Smell, Stiff Neck, Cyanosis, etc.
                  </p>
                </div>
              </div>
              <div className="p-1 text-slate-400 hover:text-slate-600">
                {collapsedSections.neurological_general ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </div>
            </button>

            {!collapsedSections.neurological_general && (
              <div className="p-3 sm:p-4 divide-y divide-slate-100">
                {categorizedSymptoms.neurological_general.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No matching neurological symptoms found.
                  </p>
                ) : (
                  categorizedSymptoms.neurological_general.map((symptom) => {
                    const isChecked = selectedSymptoms.includes(symptom.id);
                    return (
                      <label
                        key={symptom.id}
                        htmlFor={`checkbox-${symptom.id}`}
                        className={`flex items-start gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all ${isChecked
                          ? 'bg-gradient-to-r from-teal-50/80 via-sky-50/40 to-white border border-teal-200/90 shadow-2xs'
                          : 'hover:bg-slate-50/70 border border-transparent'
                          }`}
                      >
                        <input
                          type="checkbox"
                          id={`checkbox-${symptom.id}`}
                          checked={isChecked}
                          onChange={() => onToggleSymptom(symptom.id)}
                          className="mt-1 h-5 w-5 rounded-md border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer accent-teal-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-bold ${isChecked ? 'text-teal-950' : 'text-slate-800'
                                }`}
                            >
                              {symptom.label}
                            </span>
                            {symptom.isEmergencyFlag && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                Red Flag
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {symptom.description}
                          </p>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar with "Evaluate Symptoms" Primary Button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3.5 sm:px-5 pt-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] sm:py-4 shadow-[0_-4px_24px_rgba(15,23,42,0.06)]">
        <div className="max-w-4xl mx-auto flex items-center gap-2.5 sm:gap-3">
          {selectedSymptoms.length > 0 && (
            <button
              id="btn-bottom-clear-all"
              onClick={onClearSymptoms}
              className="p-3 sm:px-4 sm:py-3.5 rounded-2xl border border-slate-200/90 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 transition-colors flex items-center justify-center shrink-0 shadow-2xs"
              title="Clear all selected symptoms"
              aria-label="Clear all selected symptoms"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold ml-1.5">Reset</span>
            </button>
          )}

          <button
            id="btn-evaluate-symptoms"
            onClick={onEvaluate}
            className="flex-1 w-full min-h-[50px] flex items-center justify-center gap-2.5 py-3.5 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 active:from-teal-700 active:to-teal-800 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-teal-700/20 hover:shadow-xl hover:shadow-teal-700/25 transition-all focus:outline-none focus:ring-4 focus:ring-teal-500/25 select-none"
          >
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-white shrink-0" />
            <span className="truncate">{t('evaluateSymptoms')}</span>
            <span className="ml-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] sm:text-xs font-mono font-bold shrink-0">
              {selectedSymptoms.length}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
