import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertOctagon,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Download,
  FileText,
  HeartPulse,
  Layers,
  PhoneCall,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react';
import { SYMPTOM_DEFINITIONS } from '../data/symptoms';
import { AGE_BRACKET_DISCLAIMER, getAgeBracket, getConditionsForProfile } from '../data/ageBrackets';
import { UserProfile, InferenceCycleResult, TriageSeverity } from '../types';

interface TriageResultsViewProps {
  result: InferenceCycleResult;
  userProfile?: UserProfile | null;
  onStartNewAssessment: () => void;
  onOpenExportModal: () => void;
  onOpenLogin?: () => void;
  onFindHospitals?: () => void;
}


export const TriageResultsView: React.FC<TriageResultsViewProps> = ({
  result,
  userProfile,
  onStartNewAssessment,
  onOpenExportModal,
  onOpenLogin,
  onFindHospitals,
}) => {

  const [whyDrawerOpen, setWhyDrawerOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'facts' | 'rules'>('overview');

  const { severity, primaryTriage } = result;

  // Resolve human labels for selected symptoms
  const symptomLabelMap = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const s of SYMPTOM_DEFINITIONS) {
      map.set(s.id, s.label);
    }
    return map;
  }, []);

  // Visual configuration for Triage Severity Banner
  const severityConfig: Record<
    TriageSeverity,
    {
      bgClass: string;
      borderClass: string;
      textClass: string;
      badgeClass: string;
      subtextClass: string;
      icon: React.ReactNode;
      categoryLabel: string;
      tagline: string;
    }
  > = {
    critical: {
      bgClass: 'bg-gradient-to-r from-rose-600 via-rose-600 to-rose-700 text-white shadow-lg shadow-rose-950/15',
      borderClass: 'border-rose-700',
      textClass: 'text-white',
      badgeClass: 'bg-white/20 text-white border border-white/30 backdrop-blur-xs font-bold',
      subtextClass: 'text-rose-100',
      icon: <AlertOctagon className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0 stroke-[2.2]" />,
      categoryLabel: 'Critical Emergency',
      tagline: 'Seek Immediate Emergency Medical Care',
    },
    moderate: {
      bgClass: 'bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-950/15',
      borderClass: 'border-amber-600',
      textClass: 'text-slate-950',
      badgeClass: 'bg-slate-950/20 text-slate-950 border border-slate-950/30 backdrop-blur-xs font-bold',
      subtextClass: 'text-slate-900 font-medium',
      icon: <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-slate-950 shrink-0 stroke-[2.2]" />,
      categoryLabel: 'Moderate Risk',
      tagline: 'Consult Primary Care Physician / Urgent Care',
    },
    mild: {
      bgClass: 'bg-gradient-to-r from-teal-600 via-teal-600 to-teal-700 text-white shadow-lg shadow-teal-950/15',
      borderClass: 'border-teal-700',
      textClass: 'text-white',
      badgeClass: 'bg-white/20 text-white border border-white/30 backdrop-blur-xs font-bold',
      subtextClass: 'text-teal-100',
      icon: <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0 stroke-[2.2]" />,
      categoryLabel: 'Mild Presentation',
      tagline: 'Self-Care / Home Isolation Recommended',
    },
  };

  const currentTheme = severityConfig[severity];

  return (
    <div className="flex flex-col min-h-[calc(100vh-60px)] pb-32">
      {/* 1. Triage Severity Banner */}
      <div
        id="triage-severity-banner"
        className={`w-full py-5 sm:py-7 px-3.5 sm:px-6 transition-all ${currentTheme.bgClass}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-black/15 backdrop-blur-xs border border-white/20 shrink-0">
                {currentTheme.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap ${currentTheme.badgeClass}`}
                  >
                    {currentTheme.categoryLabel}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight mt-1.5 leading-tight">
                  {currentTheme.tagline}
                </h1>
                <p className={`text-xs sm:text-sm mt-0.5 sm:mt-1 max-w-2xl opacity-95 leading-relaxed ${currentTheme.subtextClass}`}>
                  {primaryTriage.title}
                </p>
              </div>
            </div>

            {/* Emergency Action Shortcut for Critical Cases */}
            {severity === 'critical' && (
              <div className="w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                <a
                  id="btn-emergency-call"
                  href="tel:911"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white text-rose-800 font-extrabold text-xs sm:text-sm shadow-lg hover:bg-rose-50 active:bg-rose-100 transition-all uppercase tracking-wide min-h-[46px]"
                >
                  <PhoneCall className="w-4 h-4 text-rose-700 animate-pulse shrink-0" />
                  <span>Call Emergency (911)</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full px-3.5 sm:px-5 pt-4 sm:pt-6 space-y-4 sm:space-y-6 flex-1">
        {/* Patient Profile Identification Summary */}
        {userProfile ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm uppercase">
                {userProfile.fullName.charAt(0) || 'P'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-base text-slate-900">
                    {userProfile.fullName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                    {userProfile.age} yrs old ({userProfile.gender})
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  <span>📱 {userProfile.mobileNumber}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>📍 {userProfile.address}</span>
                </p>
              </div>
            </div>

            {onOpenLogin && (
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200 shrink-0 self-end sm:self-center cursor-pointer"
              >
                Edit Profile
              </button>
            )}
          </div>
        ) : (
          onOpenLogin && (
            <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-teal-500/30 text-teal-300 border border-teal-500/40">
                  Unregistered Assessment
                </span>
                <h3 className="font-bold text-sm sm:text-base mt-1">
                  Attach Patient Record to this Triage Summary
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Sign in with your name, age, mobile number & address to personalize your exported report.
                </p>
              </div>
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
              >
                Sign In Now
              </button>
            </div>
          )
        )}



        {/* 2. Primary Recommendation Card */}

        <div
          id="primary-recommendation-card"
          className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.04)] overflow-hidden"
        >
          <div className="px-4 sm:px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base md:text-lg truncate">
                Clinical Care Directives
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 whitespace-nowrap shrink-0">
              <span className="hidden xs:inline">{primaryTriage.recommendations.length} Action Items</span>
              <span className="xs:hidden">{primaryTriage.recommendations.length} {primaryTriage.recommendations.length === 1 ? 'Step' : 'Steps'}</span>
            </span>
          </div>

          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
            {/* Explanation Note */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-50/60 via-sky-50/30 to-white border border-teal-100/80 text-slate-700 text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-slate-900 block mb-1">Clinical Assessment Rationale:</span>
              {primaryTriage.explanation}
            </div>

            {/* Primary Action Steps */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                Immediate Care Steps
              </h3>
              <ul className="space-y-2.5">
                {primaryTriage.recommendations.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 text-slate-800 text-xs sm:text-sm leading-relaxed"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100/80 text-teal-800 border border-teal-200 text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="flex-1 font-medium">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Symptom-Specific Targeted Care Cards */}
            {result.symptomAdvice && result.symptomAdvice.length > 0 && (
              <div className="pt-3 sm:pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-none">
                        Targeted Care by Reported Symptom
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Specific comfort measures and symptom-relief steps tailored to your selections
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100/80">
                    {result.symptomAdvice.length} {result.symptomAdvice.length === 1 ? 'Symptom' : 'Symptoms'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.symptomAdvice.map((advice) => (
                    <div
                      key={advice.symptomId}
                      className={`p-4 rounded-2xl border transition-all ${
                        advice.isEmergencyFlag
                          ? 'bg-rose-50/40 border-rose-200/90'
                          : 'bg-gradient-to-br from-teal-50/30 via-sky-50/20 to-white border-slate-200/80'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-900">
                            {advice.symptomLabel}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                              advice.isEmergencyFlag
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : advice.category === 'respiratory'
                                ? 'bg-sky-50 text-sky-700 border border-sky-200/70'
                                : advice.category === 'systemic'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200/70'
                                : 'bg-purple-50 text-purple-800 border border-purple-200/70'
                            }`}
                          >
                            {advice.isEmergencyFlag ? 'Red Flag' : advice.category.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-teal-700">
                          {advice.actionTitle}
                        </span>
                      </div>

                      <ul className="space-y-1.5 pl-1 pt-1">
                        {advice.recommendations.map((rec, rIdx) => (
                          <li
                            key={rIdx}
                            className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5"></span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. "Why This Outcome?" Accordion */}
        <div
          id="why-this-outcome-accordion"
          className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.04)] overflow-hidden"
        >
          <button
            id="btn-toggle-why-drawer"
            onClick={() => setWhyDrawerOpen(!whyDrawerOpen)}
            className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white hover:opacity-95 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
                <Workflow className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Clinical Logic Explanation
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  Detailed evidence trace of how your symptoms triggered each care guideline
                </p>
              </div>
            </div>
            <div className="p-1 text-slate-300 shrink-0">
              {whyDrawerOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {whyDrawerOpen && (
            <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              {/* Navigation Pills */}
              <div className="flex border-b border-slate-100 pb-3 gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Step-by-Step Pathway
                </button>
                <button
                  onClick={() => setActiveTab('facts')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
                    activeTab === 'facts'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Identified Factors ({Object.keys(result.finalWorkingMemory).length})
                </button>
                <button
                  onClick={() => setActiveTab('rules')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
                    activeTab === 'rules'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Clinical Rules Applied ({result.firedRules.length})
                </button>
              </div>

              {/* Sub-Panel 1: Step-by-Step Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-4 sm:space-y-5">
                  {/* Step 1: User Selected Symptoms */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
                      1. Symptoms Reported
                    </div>
                    {result.initialSymptoms.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No symptoms were selected.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {result.initialSymptoms.map((symId) => (
                          <span
                            key={symId}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200/80"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                            {symptomLabelMap.get(symId) || symId}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Step 2: Intermediate Derived Facts / Patterns */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0"></span>
                      2. Clinical Patterns Identified
                    </div>
                    {result.derivedFacts.length === 0 ? (
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                        Your symptoms directly matched the clinical criteria without needing intermediate inference steps.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {result.derivedFacts.map((factTrace, idx) => (
                          <div
                            key={idx}
                            className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-sky-50/90 border border-sky-200 text-xs"
                          >
                            <div>
                              <span className="font-bold text-sky-950 block text-xs">
                                {factTrace.fact.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                              </span>
                              <span className="text-sky-800 text-[11px] mt-0.5 block">
                                Inferred by rule: {factTrace.byRuleName}
                              </span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-sky-200/80 text-sky-900 font-bold text-[10px] shrink-0">
                              Step {factTrace.derivedInPass}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Step 3: Assessment Conclusion */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
                      3. Synthesis Conclusion
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-1.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-teal-300 font-bold">
                          Assigned Triage Tier: {severity.toUpperCase()}
                        </span>

                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {primaryTriage.title}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Panel 2: Identified Clinical Factors */}
              {activeTab === 'facts' && (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      All Factors Evaluated
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Active symptoms and evaluated medical markers during this check:
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(result.finalWorkingMemory).map(([factKey]) => (
                      <div
                        key={factKey}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <span className="font-semibold text-slate-800 truncate pr-2">
                          {symptomLabelMap.get(factKey) ||
                            factKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 shrink-0">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Panel 3: Medical Rules Evaluated */}
              {activeTab === 'rules' && (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Medical Rules Applied ({result.firedRules.length})
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Clinical forward-chaining rules matched to your symptom profile:
                    </p>
                  </div>
                  <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden">
                    {result.firedRules.map((rule, idx) => (
                      <div key={idx} className="p-3.5 bg-white hover:bg-slate-50 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-900 truncate">
                              {rule.ruleName}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold shrink-0">
                            Step {rule.passNumber}
                          </span>
                        </div>
                        <div className="mt-1.5 text-slate-600 pl-7 text-[11px]">
                          Inferred Result:{' '}
                          <span className="font-bold text-slate-900">
                            {rule.assertedFact.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


            </div>
          )}
        </div>
        
        {/* Age Bracket — Possible Conditions for Your Age Group */}
        {(() => {
          const age = userProfile?.age ?? null;
          const gender = userProfile?.gender ?? '';
          const bracket = age !== null ? getAgeBracket(age) : null;
          if (!bracket) return null;
          const conditions = getConditionsForProfile(age, gender);
          return (
            <div
              id="age-bracket-card"
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.04)] overflow-hidden"
            >
              {/* Card header */}
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-slate-900 text-sm sm:text-base leading-none">
                      Possible Conditions for Your Profile
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {gender} · Age {age} · <span className="font-semibold text-indigo-600">{bracket.label}</span>
                      {' '}({bracket.minAge}–{bracket.maxAge ?? '60+'} yrs)
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold shrink-0 whitespace-nowrap">
                  {conditions.length} conditions
                </span>
              </div>

              {/* Conditions chip grid */}
              <div className="px-4 sm:px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {conditions.map((condition, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-800 text-xs font-semibold"
                    >
                      {condition}
                    </span>
                  ))}
                </div>

                {/* Disclaimer */}
                <p className="mt-4 text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
                  ⚠️ {AGE_BRACKET_DISCLAIMER}
                </p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 4. Action Buttons Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3.5 sm:px-5 pt-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] sm:py-4 shadow-[0_-4px_24px_rgba(15,23,42,0.06)]">
        <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-2.5">
          <button
            id="btn-start-new-assessment"
            onClick={onStartNewAssessment}
            className="flex-1 min-h-[48px] flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200/90 font-bold text-xs sm:text-sm transition-all shadow-2xs hover:shadow-xs active:scale-[0.99]"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">New</span>
          </button>

          {onFindHospitals && (
            <button
              id="btn-find-hospital"
              onClick={onFindHospitals}
              className="flex-1 min-h-[48px] flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200 font-bold text-xs sm:text-sm transition-all shadow-2xs active:scale-[0.99]"
            >
              <span className="text-base leading-none">🏥</span>
              <span className="truncate">Hospitals</span>
            </button>
          )}

          <button
            id="btn-export-report"
            onClick={onOpenExportModal}
            className="flex-1 min-h-[48px] flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 active:from-teal-700 active:to-teal-800 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-teal-700/20 active:scale-[0.99]"
          >
            <Download className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="truncate">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};
