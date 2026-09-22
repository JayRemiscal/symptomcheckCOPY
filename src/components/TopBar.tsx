import React from 'react';
import { Activity, ClipboardList, LogOut, LogIn, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { SupportedLanguage } from '../data/translations';
import { LanguageSelector } from './LanguageSelector';

interface TopBarProps {
  currentView: 'home' | 'assessment' | 'results' | 'login' | 'history';
  user: UserProfile | null;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onNavigate: (view: 'home' | 'assessment' | 'results' | 'login' | 'history') => void;
  onOpenAdmin: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  user,
  currentLanguage,
  onLanguageChange,
  onNavigate,
  onOpenAdmin,
  onOpenLogin,
  onLogout,
}) => {
  const isAdmin = Boolean(user?.isAdmin);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-[0_1px_3px_rgba(15,23,42,0.03)] transition-all">
      <div className="max-w-6xl mx-auto px-2.5 xs:px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-4 min-w-0">
        {/* Brand & Logo */}
        <div
          id="app-brand"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1 sm:gap-2.5 cursor-pointer select-none group shrink min-w-0"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('home')}
        >
          <div className="text-[#0d9488] group-hover:scale-105 transition-transform shrink-0">
            <Activity className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.6]" />
          </div>
          <span className="font-extrabold text-sm xs:text-base sm:text-2xl tracking-tight text-[#0f172a] truncate">
            SymptomCheck
          </span>
        </div>

        {/* Right Actions: Language Selector & Auth/Profile */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* Language Selector */}
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />

          {/* History Button — visible to all users */}
          <button
            id="history-btn"
            onClick={() => onNavigate('history')}
            title="Symptoms History"
            aria-label="Symptoms History"
            className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
              currentView === 'history'
                ? 'bg-teal-100 text-teal-700 border border-teal-200'
                : 'text-slate-500 hover:text-teal-600 hover:bg-teal-50'
            }`}
          >
            <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* User Profile / Login status */}
          {user ? (
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                id="user-profile-badge"
                onClick={onOpenLogin}
                title="Edit Profile"
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors border border-slate-200/80 text-xs sm:text-sm font-semibold cursor-pointer shrink-0"
              >
                <div className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs uppercase shrink-0 text-white ${isAdmin ? 'bg-amber-600' : 'bg-teal-600'}`}>
                  {user.fullName.charAt(0) || 'U'}
                </div>
                <span className="max-w-[60px] xs:max-w-[90px] sm:max-w-[150px] truncate">{user.fullName}</span>
                {isAdmin && (
                  <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-amber-100 text-amber-900 rounded border border-amber-200/80 hidden xs:inline">
                    Admin
                  </span>
                )}
              </button>

              <button
                id="logout-btn"
                onClick={onLogout}
                title="Sign Out"
                aria-label="Sign Out"
                className="p-1 sm:p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              id="signin-topbar-btn"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-teal-50 text-teal-700 hover:bg-teal-100/80 border border-teal-200/80 font-bold text-xs sm:text-sm transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 shrink-0" />
              <span className="text-xs sm:text-sm">Sign In</span>
            </button>
          )}

          {/* Filtered Administrator View Button - Only shown when logged in as Admin */}
          {isAdmin && (
            <button
              id="admin-btn"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 text-teal-300 hover:text-white font-bold text-xs transition-all shadow-xs border border-slate-700 cursor-pointer animate-in fade-in shrink-0 whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="hidden sm:inline">Administrator</span>
              <span className="sm:hidden text-[10px]">Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
