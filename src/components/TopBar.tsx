import React from 'react';
import { Activity } from 'lucide-react';

interface TopBarProps {
  currentView: 'home' | 'assessment' | 'results';
  onNavigate: (view: 'home' | 'assessment' | 'results') => void;
  onOpenAdmin: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  onNavigate,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-[0_1px_3px_rgba(15,23,42,0.03)] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div
          id="app-brand"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('home')}
        >
          <div className="text-[#0d9488] group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.6]" />
          </div>
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#0f172a]">
            SymptomCheck
          </span>
        </div>

        {/* Right Action: Administrator */}
        <div className="flex items-center gap-4">
          <button
            id="admin-btn"
            onClick={onOpenAdmin}
            className="text-[#0d9488] hover:text-[#0f766e] font-semibold text-sm sm:text-base transition-colors cursor-pointer"
          >
            Administrator
          </button>
        </div>
      </div>
    </header>
  );
};

