import { useState, useEffect } from 'react';
import { AdminPasscodeModal } from './components/AdminPasscodeModal';
import { AdminRulesModal } from './components/AdminRulesModal';
import { AmbulanceLoader } from './components/AmbulanceLoader';
import { ExportReportModal } from './components/ExportReportModal';
import { HistoryView } from './components/HistoryView';
import { HospitalMapView } from './components/HospitalMapView';
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
  type ViewType = 'home' | 'assessment' | 'results' | 'login' | 'history' | 'hospitals';
  const [viewHistory, setViewHistory] = useState<Array<ViewType>>(() => {
    try {
      const saved = sessionStorage.getItem('app_viewHistory');
      return saved ? JSON.parse(saved) : ['home'];
    } catch {
      return ['home'];
    }
  });
  const currentView = viewHistory[viewHistory.length - 1];

  // Push a new view onto the history stack
  const navigate = (view: typeof currentView) => {
    setViewHistory(prev => {
      // Don't push the same view twice in a row
      if (prev[prev.length - 1] === view) return prev;
      return [...prev, view];
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pop back to the previous view
  const handleBack = () => {
    setViewHistory(prev => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => AuthService.getUserProfile());
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => LanguageService.getLanguage());
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem('app_selectedSymptoms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [inferenceResult, setInferenceResult] = useState<InferenceCycleResult | null>(() => {
    try {
      const saved = sessionStorage.getItem('app_inferenceResult');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    sessionStorage.setItem('app_viewHistory', JSON.stringify(viewHistory));
  }, [viewHistory]);

  useEffect(() => {
    sessionStorage.setItem('app_selectedSymptoms', JSON.stringify(selectedSymptoms));
  }, [selectedSymptoms]);

  useEffect(() => {
    sessionStorage.setItem('app_inferenceResult', JSON.stringify(inferenceResult));
  }, [inferenceResult]);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
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
    navigate('assessment');
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
            birthdate: '1986-01-01',
            gender: 'Other',
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
    if (selectedSymptoms.length === 0) return;

    // Show ambulance loader
    setIsEvaluating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Small async delay so animation renders before heavy computation
    setTimeout(() => {
      const activeRules = RuleStorageService.getAllRules().filter((r) => r.enabled);
      const engine = new ForwardChainingEngine(activeRules);
      const result = engine.evaluate(selectedSymptoms);

      // Auto-save to per-account history
      HistoryService.saveAssessment(userProfile, result);

      setInferenceResult(result);
      setIsEvaluating(false);
      navigate('results');
    }, 1800);
  };

  // Start new assessment
  const handleStartNewAssessment = () => {
    setSelectedSymptoms([]);
    setInferenceResult(null);
    navigate('assessment');
  };

  const handleStartAssessmentClick = () => {
    if (!userProfile) {
      navigate('login');
    } else {
      navigate('assessment');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white relative">
      {/* Ambulance Loader Overlay */}
      {isEvaluating && <AmbulanceLoader message="Analyzing your symptoms…" />}

      {/* Top Bar Header */}
      <TopBar
        currentView={currentView}
        user={userProfile}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onNavigate={(view) => navigate(view)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenLogin={() => navigate('login')}
        onLogout={handleLogout}
        onBack={handleBack}
      />

      {/* Main Views */}
      <main className="flex-1 flex flex-col">
        {currentView === 'login' && (
          <LoginView
            currentUser={userProfile}
            currentLanguage={currentLanguage}
            onLoginSuccess={handleLoginSuccess}
          onContinueAsGuest={() => navigate('assessment')}
            onCancel={() => navigate('home')}
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
          />
        )}


        {currentView === 'results' && inferenceResult && (
          <TriageResultsView
            result={inferenceResult}
            userProfile={userProfile}
            onStartNewAssessment={handleStartNewAssessment}
            onOpenExportModal={() => setShowExportModal(true)}
          onOpenLogin={() => navigate('login')}
            onFindHospitals={() => navigate('hospitals')}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            profile={userProfile}
            onStartAssessment={handleStartAssessmentClick}
            onOpenLogin={() => navigate('login')}
            onViewResult={(result: InferenceCycleResult) => {
              setInferenceResult(result);
              navigate('results');
            }}
          />
        )}

        {currentView === 'hospitals' && (
          <HospitalMapView
            profile={userProfile}
            onOpenLogin={() => navigate('login')}
            onStartAssessment={handleStartAssessmentClick}
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
