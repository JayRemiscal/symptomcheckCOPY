import { useState } from 'react';
import { AdminPasscodeModal } from './components/AdminPasscodeModal';
import { AdminRulesModal } from './components/AdminRulesModal';
import { ExportReportModal } from './components/ExportReportModal';
import { HistoryView } from './components/HistoryView';
import { LandingView } from './components/LandingView';
import { LoginView } from './components/LoginView';
import { SymptomAssessmentView } from './components/SymptomAssessmentView';
import { TopBar } from './components/TopBar';
import { TriageResultsView } from './components/TriageResultsView';
import { SupportedLanguage } from './data/translations';
import { ForwardChainingEngine } from './engine/ForwardChainingEngine';
import { AuthService } from './services/AuthService';
import { HistoryService } from './services/HistoryService';
import { LanguageService } from './services/LanguageService';
import { RuleStorageService } from './services/RuleStorageService';
import { InferenceCycleResult, UserProfile } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'assessment' | 'results' | 'login' | 'history'>('home');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => AuthService.getUserProfile());
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => LanguageService.getLanguage());
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [inferenceResult, setInferenceResult] = useState<InferenceCycleResult | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showAdminPasscodeModal, setShowAdminPasscodeModal] = useState<boolean>(false);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    LanguageService.setLanguage(lang);
  };

  // Auth / Login handlers
  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentView('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleLogout = () => {
    AuthService.logout();
    setUserProfile(null);
  };

  const handleAdminAuthSuccess = () => {
    setShowAdminPasscodeModal(false);
    setUserProfile((prev) => {
      const updated: UserProfile = prev
        ? { ...prev, isAdmin: true }
        : {
            fullName: 'Administrator',
            age: 40,
            mobileNumber: '+1 (555) 000-0000',
            address: 'System Administration',
            isAdmin: true,
          };
      AuthService.saveUserProfile(updated);
      return updated;
    });
    setShowAdminModal(true);
  };

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

    // Auto-save to per-account history
    HistoryService.saveAssessment(userProfile, result);

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

  const handleStartAssessmentClick = () => {
    if (!userProfile) {
      setCurrentView('login');
    } else {
      setCurrentView('assessment');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white relative">
      {/* Top Bar Header */}
      <TopBar
        currentView={currentView}
        user={userProfile}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenLogin={() => setCurrentView('login')}
        onLogout={handleLogout}
        onBack={() => {
          // Contextual back navigation per view
          const backMap: Record<typeof currentView, typeof currentView> = {
            results: 'assessment',
            assessment: 'home',
            login: 'home',
            history: 'home',
            home: 'home',
          };
          const dest = backMap[currentView];
          setCurrentView(dest);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Views */}
      <main className="flex-1 flex flex-col">
        {currentView === 'login' && (
          <LoginView
            currentUser={userProfile}
            currentLanguage={currentLanguage}
            onLoginSuccess={handleLoginSuccess}
            onContinueAsGuest={() => {
              setCurrentView('assessment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCancel={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'home' && (
          <LandingView
            currentLanguage={currentLanguage}
            onStartAssessment={handleStartAssessmentClick}
            onOpenAdmin={() => {
              if (userProfile?.isAdmin) {
                setShowAdminModal(true);
              } else {
                setShowAdminPasscodeModal(true);
              }
            }}
          />
        )}

        {currentView === 'assessment' && (
          <SymptomAssessmentView
            selectedSymptoms={selectedSymptoms}
            onToggleSymptom={handleToggleSymptom}
            onClearSymptoms={handleClearSymptoms}
            onApplyPreset={handleApplyPreset}
            onEvaluate={handleEvaluateSymptoms}
            onBack={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}


        {currentView === 'results' && inferenceResult && (
          <TriageResultsView
            result={inferenceResult}
            userProfile={userProfile}
            onStartNewAssessment={handleStartNewAssessment}
            onOpenExportModal={() => setShowExportModal(true)}
            onOpenLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            profile={userProfile}
            onStartAssessment={handleStartAssessmentClick}
            onOpenLogin={() => setCurrentView('login')}
            onViewResult={(result: InferenceCycleResult) => {
              setInferenceResult(result);
              setCurrentView('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Admin Passcode Modal */}
      {showAdminPasscodeModal && (
        <AdminPasscodeModal
          onSuccess={handleAdminAuthSuccess}
          onClose={() => setShowAdminPasscodeModal(false)}
        />
      )}

      {/* Admin Rules Modal */}
      {showAdminModal && (
        <AdminRulesModal onClose={() => setShowAdminModal(false)} />
      )}

      {/* Save / Export Report Modal */}
      {showExportModal && inferenceResult && (
        <ExportReportModal
          result={inferenceResult}
          userProfile={userProfile}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
