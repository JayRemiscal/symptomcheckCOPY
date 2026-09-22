import React from 'react';
import {
  Download,
  FileText,
  Printer,
  X,
} from 'lucide-react';
import { SYMPTOM_DEFINITIONS } from '../data/symptoms';
import { UserProfile, InferenceCycleResult } from '../types';

interface ExportReportModalProps {
  result: InferenceCycleResult;
  userProfile?: UserProfile | null;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  result,
  userProfile,
  onClose,
}) => {

  const symptomLabelMap = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const s of SYMPTOM_DEFINITIONS) {
      map.set(s.id, s.label);
    }
    return map;
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = () => {
    const originalTitle = document.title;
    const dateStr = new Date(result.evaluatedAt).toISOString().split('T')[0];
    document.title = `SymptomCheck_Triage_Report_${dateStr}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const formattedDateTime = React.useMemo(() => {
    const d = new Date(result.evaluatedAt);
    const dateStr = d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeStr = d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${dateStr} • ${timeStr}`;
  }, [result.evaluatedAt]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Clean Modal Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-white truncate">
                Triage Summary Report
              </h3>
              <p className="text-[11px] text-slate-300 truncate">
                Clinical assessment evaluation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              id="btn-print-report"
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Print report"
              aria-label="Print report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              id="btn-close-export-modal"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-sm text-slate-800">
          <div id="printable-triage-report" className="space-y-4 sm:space-y-5">
            {/* Elegant Document Header */}
            <div className="border-b border-slate-200/90 pb-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200/80 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-teal-800">
                  Clinical Triage Record
                </span>
                <span className="text-[11px] sm:text-xs font-medium text-slate-500">
                  {formattedDateTime}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-bold text-slate-900 mt-2 tracking-tight">
                Patient Assessment Summary
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated clinical decision support evaluation
              </p>

              {/* Patient Details Block */}
              {userProfile && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900">Patient:</span> {userProfile.fullName} ({userProfile.age} yrs)
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Mobile:</span> {userProfile.mobileNumber}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-bold text-slate-900">Address:</span> {userProfile.address}
                  </div>
                </div>
              )}
            </div>


            {/* Refined Triage Tier Card */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl border ${
                result.severity === 'critical'
                  ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                  : result.severity === 'moderate'
                  ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                    result.severity === 'critical'
                      ? 'bg-rose-200/90 text-rose-900'
                      : result.severity === 'moderate'
                      ? 'bg-amber-200/90 text-amber-900'
                      : 'bg-emerald-200/90 text-emerald-900'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      result.severity === 'critical'
                        ? 'bg-rose-600 animate-pulse'
                        : result.severity === 'moderate'
                        ? 'bg-amber-600'
                        : 'bg-emerald-600'
                    }`}
                  ></span>
                  {result.severity.toUpperCase()} TIER
                </span>
              </div>

              <div className="font-bold text-sm sm:text-base text-slate-900 mt-1.5">
                {result.primaryTriage.title}
              </div>
              <p className="text-xs sm:text-sm mt-1 leading-relaxed text-slate-700">
                {result.primaryTriage.explanation}
              </p>
            </div>

            {/* Immediate Recommendations */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Primary Triage Directives
              </h4>
              <ul className="space-y-2">
                {result.primaryTriage.recommendations.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Targeted Care by Reported Symptom */}
            {result.symptomAdvice && result.symptomAdvice.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Targeted Care by Reported Symptom
                </h4>
                <div className="space-y-2.5">
                  {result.symptomAdvice.map((advice) => (
                    <div
                      key={advice.symptomId}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50/60"
                    >
                      <div className="flex items-center justify-between gap-2 font-semibold text-xs text-slate-900 mb-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                          <span>{advice.symptomLabel}</span>
                          {advice.isEmergencyFlag && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-rose-100 text-rose-800">
                              Red Flag
                            </span>
                          )}
                        </span>
                        <span className="text-slate-500 font-normal italic text-[11px]">
                          {advice.actionTitle}
                        </span>
                      </div>
                      <ul className="space-y-1 pl-3 text-xs text-slate-700">
                        {advice.recommendations.map((rec, rIdx) => (
                          <li key={rIdx} className="list-disc pl-0.5 leading-relaxed">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recorded Symptoms */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reported Symptoms ({result.initialSymptoms.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.initialSymptoms.map((symId) => (
                  <span
                    key={symId}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-700"
                  >
                    {symptomLabelMap.get(symId) || symId}
                  </span>
                ))}
              </div>
            </div>

            {/* Evaluation Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="font-bold text-slate-800">
                Evaluation Details
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                <div>Rules Checked: {result.firedRules.length}</div>
                <div>Confidence Score: {Math.round(result.aggregateConfidence * 100)}%</div>
                <div>Execution Time: {result.executionTimeMs} ms</div>
              </div>
              {result.derivedFacts.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-700 block mb-1">
                    Identified Clinical Indicators:
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                    {result.derivedFacts.map((df, i) => (
                      <li key={i}>
                        {df.fact.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-500 leading-relaxed italic border border-slate-200/80">
              Medical Disclaimer: This report is generated by an on-device clinical decision support engine. It does not substitute professional medical diagnosis. If you are experiencing a life-threatening emergency, call 911 immediately.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            id="btn-save-pdf"
            onClick={handleSavePDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white text-xs sm:text-sm font-bold transition-all shadow-sm shadow-teal-700/20 active:scale-[0.99]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save as PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all border border-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
