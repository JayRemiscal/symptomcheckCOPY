import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, X, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { AuthService } from '../services/AuthService';

interface AdminPasscodeModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminPasscodeModal: React.FC<AdminPasscodeModalProps> = ({
  onSuccess,
  onClose,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (AuthService.verifyAdminPasscode(passcode)) {
      AuthService.setAdminLoggedIn(true);
      onSuccess();
    } else {
      setError('Invalid administrator passcode. (Default: admin)');
    }
  };

  const handleQuickFill = () => {
    setPasscode('admin');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Administrator Access</h3>
              <p className="text-xs text-slate-300">Authentication Required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
            Rule engine management and salience configuration are restricted to authorized administrators.
          </div>

          <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between gap-2">
            <span className="text-xs text-teal-900 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Default admin passcode is <code className="bg-teal-100 px-1 py-0.5 rounded font-bold text-teal-900">admin</code></span>
            </span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
            >
              Auto Fill
            </button>
          </div>

          <div>
            <label htmlFor="adminPasscode" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Passcode
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="password"
                id="adminPasscode"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter passcode (admin)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:bg-white rounded-2xl text-sm font-medium text-slate-900 outline-none transition-all"
                autoFocus
              />
            </div>
            {error && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-teal-700/20 transition-all cursor-pointer"
            >
              <span>Authenticate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
