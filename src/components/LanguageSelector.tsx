import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SupportedLanguage, LANGUAGE_OPTIONS } from '../data/translations';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = LANGUAGE_OPTIONS.find((opt) => opt.code === currentLanguage) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={containerRef}>
      {/* Trigger Button - Responsive Compact Styling */}
      <button
        type="button"
        id="language-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Select System Language"
        className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/90 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
      >
        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 shrink-0" />
        <span>{selectedOption.flag}</span>
        <span className="font-bold text-xs hidden sm:inline">{selectedOption.nativeName}</span>
        <span className="font-bold text-[11px] uppercase sm:hidden">{selectedOption.code}</span>
        <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            System Language
          </div>
          {LANGUAGE_OPTIONS.map((opt) => {
            const isSelected = opt.code === currentLanguage;
            return (
              <button
                key={opt.code}
                onClick={() => {
                  onLanguageChange(opt.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50 text-teal-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{opt.flag}</span>
                  <span>{opt.nativeName}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({opt.name})</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
