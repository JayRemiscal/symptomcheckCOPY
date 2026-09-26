import React, { useCallback, useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertOctagon,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  LogIn,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';
import { HistoryEntry, InferenceCycleResult, TriageSeverity, UserProfile } from '../types';
import { HistoryService } from '../services/HistoryService';
import { SupportedLanguage } from '../data/translations';
import { LanguageService } from '../services/LanguageService';

type SeverityFilter = 'all' | TriageSeverity;

interface HistoryViewProps {
  profile: UserProfile | null;
  onStartAssessment: () => void;
  onOpenLogin: () => void;
  /** Called when user taps "View Details" — navigates to results view */
  onViewResult: (result: InferenceCycleResult) => void;
  currentLanguage?: SupportedLanguage;
}

/* ─── Single history card ──────────────────────────────────── */
const HistoryCard: React.FC<{
  entry: HistoryEntry;
  onDelete: (id: string) => void;
  onView: (result: InferenceCycleResult) => void;
  t: (key: string) => string;
}> = ({ entry, onDelete, onView, t }) => {
  const [expanded, setExpanded] = useState(false);

  const SEVERITY_CONFIG: Record<
    TriageSeverity,
    { label: string; badgeClass: string; iconBg: string; icon: React.ReactNode }
  > = {
    critical: {
      label: t('filterCritical'),
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      iconBg: 'bg-rose-100 text-rose-600',
      icon: <AlertOctagon className="w-4 h-4" />,
    },
    moderate: {
      label: t('filterModerate'),
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-600',
      icon: <AlertCircle className="w-4 h-4" />,
    },
    mild: {
      label: t('filterMild'),
      badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
      iconBg: 'bg-teal-100 text-teal-600',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  };

  const cfg = SEVERITY_CONFIG[entry.severity];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.06)] overflow-hidden transition-all hover:shadow-[0_4px_16px_-4px_rgba(15,23,42,0.1)]">
      {/* Card header */}
      <div className="px-4 py-3.5 flex items-start gap-3">
        {/* Severity icon */}
        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.iconBg}`}>
          {cfg.icon}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${cfg.badgeClass}`}>
              {cfg.label}
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(entry.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · {new Date(entry.savedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800 mt-1 leading-snug line-clamp-2">
            {entry.primaryTitle}
          </p>

          {/* Symptom chips */}
          {entry.symptomsReported.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.symptomsReported.slice(0, 4).map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200/80"
                >
                  {s}
                </span>
              ))}
              {entry.symptomsReported.length > 4 && (
                <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[11px] font-medium border border-slate-200/80">
                  +{entry.symptomsReported.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(entry.id)}
          aria-label="Delete entry"
          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expandable details */}
      <div className="border-t border-slate-100 px-4">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full py-2.5 flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors cursor-pointer"
        >
          <span>{expanded ? t('hideDetails') : t('showDetails')}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expanded && (
          <div className="pb-4 space-y-3 text-xs text-slate-600">
            {/* Full symptom list */}
            <div>
              <span className="font-bold text-slate-700 block mb-1.5">{t('symptomsReportedLabel')}</span>
              <div className="flex flex-wrap gap-1.5">
                {entry.symptomsReported.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-xl bg-teal-50 border border-teal-100 text-teal-800 font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Triage title */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 leading-relaxed">
              <span className="font-bold text-slate-700 block mb-0.5">{t('assessmentResult')}</span>
              {entry.primaryTitle}
            </div>

            {/* Stats row */}
            <div className="flex gap-3 text-[11px] text-slate-500">
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {entry.result.firedRules.length} {t('rulesFired')}
              </span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {entry.result.passesCount} {t('passes')}
              </span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {entry.result.executionTimeMs}ms
              </span>
            </div>

            {/* View full results button */}
            <button
              onClick={() => onView(entry.result)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold text-xs hover:from-teal-500 hover:to-teal-600 transition-all shadow-sm cursor-pointer"
            >
              {t('viewFullResults')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Main HistoryView ─────────────────────────────────────── */
export const HistoryView: React.FC<HistoryViewProps> = ({
  profile,
  onStartAssessment,
  onOpenLogin,
  onViewResult,
  currentLanguage,
}) => {
  const t = useCallback((key: string) => LanguageService.t(key, currentLanguage), [currentLanguage]);

  const [entries, setEntries] = useState<HistoryEntry[]>(() =>
    HistoryService.getHistory(profile)
  );
  const [filter, setFilter] = useState<SeverityFilter>('all');
  const [showClearModal, setShowClearModal] = useState(false);

  const filtered = useMemo(
    () => (filter === 'all' ? entries : entries.filter((e) => e.severity === filter)),
    [entries, filter]
  );

  const handleDelete = useCallback(
    (id: string) => {
      HistoryService.deleteEntry(profile, id);
      setEntries(HistoryService.getHistory(profile));
    },
    [profile]
  );

  const handleClearAll = () => {
    HistoryService.clearHistory(profile);
    setEntries([]);
    setShowClearModal(false);
  };

  const FILTERS: { value: SeverityFilter; label: string }[] = [
    { value: 'all', label: t('filterAll') },
    { value: 'mild', label: t('filterMild') },
    { value: 'moderate', label: t('filterModerate') },
    { value: 'critical', label: t('filterCritical') },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-60px)] bg-[#F4F7F9]">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200/70 px-4 sm:px-6 py-4 sm:py-5 sticky top-[60px] z-20 shadow-[0_2px_8px_-3px_rgba(15,23,42,0.05)]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                <ClipboardList className="w-4.5 h-4.5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-none">
                  {t('symptomsHistory')}
                </h1>
                {profile && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{profile.fullName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {entries.length > 0 && (
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                  {entries.length} {entries.length !== 1 ? t('historyRecords') : t('historyRecord')}
                </span>
              )}
              {entries.length > 0 && (
                <button
                  onClick={() => setShowClearModal(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer whitespace-nowrap"
                >
                  {t('clearHistory')}
                </button>
              )}
            </div>
          </div>

          {/* Severity filter pills */}
          {entries.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {FILTERS.map((f) => {
                const count =
                  f.value === 'all'
                    ? entries.length
                    : entries.filter((e) => e.severity === f.value).length;
                return (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      filter === f.value
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {f.label}
                    {count > 0 && (
                      <span
                        className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                          filter === f.value
                            ? 'bg-white/25 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {/* Guest prompt */}
        {!profile && (
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-teal-500/30 text-teal-300 border border-teal-500/40">
                {t('guestMode')}
              </span>
              <h2 className="font-bold text-sm sm:text-base mt-1">
                {t('signInForHistory')}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {t('guestHistorySub')}
              </p>
            </div>
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              {t('signIn')}
            </button>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-500 mb-4">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h2 className="text-base font-bold text-slate-800">
              {filter !== 'all' ? `${t('noAssessments')} (${filter})` : t('noHistoryYet')}
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xs leading-relaxed">
              {filter !== 'all'
                ? t('tryDifferentFilter')
                : t('noHistorySub')}
            </p>
            {filter === 'all' && (
              <button
                onClick={onStartAssessment}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                {t('startAssessmentBtn')}
              </button>
            )}
          </div>
        )}

        {/* History cards */}
        {filtered.map((entry) => (
          <HistoryCard
            key={entry.id}
            entry={entry}
            onDelete={handleDelete}
            onView={onViewResult}
            t={t}
          />
        ))}
      </div>

      {/* Custom Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4 border border-rose-100">
              <AlertOctagon className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('clearHistoryTitle')}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {t('clearHistoryConfirm')} {entries.length} {entries.length === 1 ? t('historyRecord') : t('historyRecords')}? {t('clearHistoryRecords').replace(/^[^?]*\??\s*/, '')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm transition-colors cursor-pointer"
              >
                {t('cancelBtn')}
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-bold text-sm transition-colors cursor-pointer"
              >
                {t('deleteAll')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
