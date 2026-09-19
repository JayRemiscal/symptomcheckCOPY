import { useState } from 'react';
import { AdminRulesModal } from './components/AdminRulesModal';
import { ExportReportModal } from './components/ExportReportModal';
import { LandingView } from './components/LandingView';
import { SymptomAssessmentView } from './components/SymptomAssessmentView';
import { TopBar } from './components/TopBar';
import { TriageResultsView } from './components/TriageResultsView';
import { ForwardChainingEngine } from './engine/ForwardChainingEngine';
import { RuleStorageService } from './services/RuleStorageService';
import { InferenceCycleResult } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'assessment' | 'results'>('home');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [inferenceResult, setInferenceResult] = useState<InferenceCycleResult | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);

  // Toggle symptom selection
  const handleToggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId],
    );
  };

  // Reset symptoms
  const handleClearSymptoms = () => {
    setSelectedSymptoms([]);
  };

  // Apply preset
  const handleApplyPreset = (symptomIds: string[]) => {
    setSelectedSymptoms(symptomIds);
  };

  // Evaluate Symptoms via Forward Chaining Engine
  const handleEvaluateSymptoms = () => {
    const activeRules = RuleStorageService.getAllRules().filter((r) => r.enabled);
    const engine = new ForwardChainingEngine(activeRules);
    const result = engine.evaluate(selectedSymptoms);

    setInferenceResult(result);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start new assessment
  const handleStartNewAssessment = () => {
    setSelectedSymptoms([]);
    setInferenceResult(null);
    setCurrentView('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white relative">
      {/* Top Bar Header */}
      <TopBar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setShowAdminModal(true)}
      />

      {/* Main Views */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <LandingView
            onStartAssessment={() => {
              setCurrentView('assessment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmin={() => setShowAdminModal(true)}
          />
        )}

        {currentView === 'assessment' && (
          <SymptomAssessmentView
            selectedSymptoms={selectedSymptoms}
            onToggleSymptom={handleToggleSymptom}
            onClearSymptoms={handleClearSymptoms}
            onApplyPreset={handleApplyPreset}
            onEvaluate={handleEvaluateSymptoms}
          />
        )}

        {currentView === 'results' && inferenceResult && (
          <TriageResultsView
            result={inferenceResult}
            onStartNewAssessment={handleStartNewAssessment}
            onOpenExportModal={() => setShowExportModal(true)}
          />
        )}
      </main>

      {/* Admin Rules Modal */}
      {showAdminModal && (
        <AdminRulesModal onClose={() => setShowAdminModal(false)} />
      )}

      {/* Save / Export Report Modal */}
      {showExportModal && inferenceResult && (
        <ExportReportModal
          result={inferenceResult}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}

