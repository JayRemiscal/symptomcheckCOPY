import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Check,
  ChevronDown,
  ClipboardList,
  Globe,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { UserProfile } from '../types';
import { SupportedLanguage, LANGUAGE_OPTIONS } from '../data/translations';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [langExpanded, setLangExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isAdmin = Boolean(user?.isAdmin);

  const selectedLang = LANGUAGE_OPTIONS.find((o) => o.code === currentLanguage) || LANGUAGE_OPTIONS[0];

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setLangExpanded(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setLangExpanded(false);
  }, [currentView]);

  const close = () => {
    setMenuOpen(false);
    setLangExpanded(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">

        {/* Brand */}
        <div
          id="app-brand"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('home')}
        >
          <div className="text-teal-600 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.6]" />
          </div>
          <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900">
            SymptomCheck
          </span>
        </div>

        {/* Hamburger button */}
        <div className="relative" ref={menuRef}>
          <button
            id="hamburger-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="p-2 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer border border-slate-200/70"
          >
            {menuOpen
              ? <X className="w-5 h-5" />
              : <Menu className="w-5 h-5" />}
          </button>

          {/* ── Dropdown drawer ── */}
          {menuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={close}
              />

              {/* Menu panel */}
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-72 bg-white rounded-2xl shadow-[0_8px_30px_-4px_rgba(15,23,42,0.18)] border border-slate-200/80 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">

                {/* ── Profile section ── */}
                <div className="p-4 border-b border-slate-100">
                  {user ? (
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-base uppercase text-white shrink-0 shadow-sm ${isAdmin ? 'bg-amber-600' : 'bg-teal-600'}`}>
                        {user.fullName.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-sm text-slate-900 truncate">{user.fullName}</span>
                          {isAdmin && (
                            <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-amber-100 text-amber-900 rounded border border-amber-200">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{user.mobileNumber}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.address}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-700">Guest User</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Sign in to save your history</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Menu items ── */}
                <div className="py-1.5">

                  {/* Edit Profile / Sign In */}
                  <button
                    id="menu-profile-btn"
                    onClick={() => { onOpenLogin(); close(); }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {user ? 'Edit Profile' : 'Sign In'}
                    </span>
                    {!user && (
                      <LogIn className="w-3.5 h-3.5 text-teal-500 ml-auto" />
                    )}
                  </button>

                  {/* Symptoms History */}
                  <button
                    id="menu-history-btn"
                    onClick={() => { onNavigate('history'); close(); }}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                      currentView === 'history' ? 'bg-teal-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      currentView === 'history'
                        ? 'bg-teal-100 text-teal-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    <span className={`text-sm font-semibold ${
                      currentView === 'history' ? 'text-teal-700' : 'text-slate-700'
                    }`}>
                      Symptoms History
                    </span>
                    {currentView === 'history' && (
                      <Check className="w-3.5 h-3.5 text-teal-500 ml-auto" />
                    )}
                  </button>

                  {/* Language selector */}
                  <div>
                    <button
                      id="menu-language-btn"
                      onClick={() => setLangExpanded((v) => !v)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 flex-1">Language</span>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span className="text-sm">{selectedLang.flag}</span>
                        <span className="text-xs font-bold text-slate-600">{selectedLang.nativeName}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Language options */}
                    {langExpanded && (
                      <div className="bg-slate-50 border-t border-b border-slate-100">
                        {LANGUAGE_OPTIONS.map((opt) => {
                          const isSelected = opt.code === currentLanguage;
                          return (
                            <button
                              key={opt.code}
                              onClick={() => {
                                onLanguageChange(opt.code);
                                setLangExpanded(false);
                              }}
                              className={`w-full px-5 py-2.5 flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                                isSelected ? 'bg-teal-50 text-teal-900' : 'text-slate-700 hover:bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-sm">{opt.flag}</span>
                                <span>{opt.nativeName}</span>
                                <span className="text-[10px] text-slate-400 font-normal">({opt.name})</span>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Admin button */}
                  {isAdmin && (
                    <button
                      id="menu-admin-btn"
                      onClick={() => { onOpenAdmin(); close(); }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-teal-400 shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Administrator Panel</span>
                    </button>
                  )}
                </div>

                {/* ── Logout / Sign In footer ── */}
                <div className="p-3 border-t border-slate-100">
                  {user ? (
                    <button
                      id="menu-logout-btn"
                      onClick={() => { onLogout(); close(); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-sm transition-colors cursor-pointer border border-rose-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  ) : (
                    <button
                      id="menu-signin-btn"
                      onClick={() => { onOpenLogin(); close(); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors cursor-pointer shadow-sm"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                  )}
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
