import React, { useState } from 'react';
import { Shield, X, CheckCircle, AlertTriangle, RefreshCcw, Download, Upload, Plus, Cpu, Sliders } from 'lucide-react';
import { RuleStorageService } from '../services/RuleStorageService';
import { Rule } from '../types';

interface AdminRulesModalProps {
  onClose: () => void;
}

export const AdminRulesModal: React.FC<AdminRulesModalProps> = ({ onClose }) => {
  const [rules, setRules] = useState<Rule[]>(() => RuleStorageService.getAllRules());
  const [filterText, setFilterText] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const refreshRules = () => {
    setRules(RuleStorageService.getAllRules());
  };

  const handleToggleRule = (ruleId: string, isSystem: boolean, currentEnabled: boolean) => {
    if (isSystem) {
      RuleStorageService.toggleSystemRule(ruleId, !currentEnabled);
    } else {
      RuleStorageService.toggleCustomRule(ruleId, !currentEnabled);
    }
    refreshRules();
    showNotification(`Rule ${ruleId} ${!currentEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all rule engine rules to factory defaults? Custom rules will be cleared.')) {
      RuleStorageService.resetToFactoryDefaults();
      refreshRules();
      showNotification('Reset all rules to factory defaults.');
    }
  };

  const handleExport = () => {
    const jsonStr = RuleStorageService.exportRulesJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symptomcheck_rules_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Exported rules JSON.');
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredRules = rules.filter(
    (r) =>
      r.id.toLowerCase().includes(filterText.toLowerCase()) ||
      r.name.toLowerCase().includes(filterText.toLowerCase()) ||
      r.consequent.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Medical Rule Engine Administration
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {rules.filter((r) => r.enabled).length} / {rules.length} Active
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Inspect, enable, or configure active medical inference rules and priorities.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar & Search */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Filter rules by ID, title, or assertion..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="px-3.5 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:bg-white w-full sm:w-72 transition-colors"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
            <button
              onClick={handleResetDefaults}
              className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>
        </div>

        {notification && (
          <div className="bg-teal-50 text-teal-800 text-xs px-6 py-2 border-b border-teal-100 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Rules Table / List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredRules.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No rules matching "{filterText}"
            </div>
          ) : (
            filteredRules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border transition-all ${
                  rule.enabled
                    ? 'bg-white border-slate-200 hover:border-teal-300 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {rule.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {rule.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                        Priority: {rule.priority}
                      </span>
                      {rule.isSystem && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          System Rule
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mb-2">
                      {rule.description}
                    </p>

                    {/* Rule Antecedents & Consequent */}
                    <div className="bg-slate-50 rounded-lg p-2.5 text-xs border border-slate-200/60 font-mono space-y-1">
                      <div>
                        <span className="font-bold text-teal-700">IF: </span>
                        {rule.antecedents.map((ant, i) => (
                          <span key={i} className="text-slate-800">
                            {i > 0 && <span className="text-amber-600 font-bold"> AND </span>}
                            <span className="bg-amber-100/70 text-amber-900 px-1.5 py-0.5 rounded">
                              {ant.fact} {ant.operator} {String(ant.value)}
                            </span>
                          </span>
                        ))}
                      </div>
                      <div>
                        <span className="font-bold text-sky-700">THEN ASSERT: </span>
                        <span className="bg-sky-100/80 text-sky-900 font-bold px-1.5 py-0.5 rounded">
                          {rule.consequent}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center shrink-0">
                    <button
                      onClick={() => handleToggleRule(rule.id, !!rule.isSystem, rule.enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        rule.enabled ? 'bg-teal-600' : 'bg-slate-300'
                      }`}
                      title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          rule.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200/80 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
