import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Key,
  AlertCircle,
  UserCheck,
} from 'lucide-react';

import { UserProfile } from '../types';
import { AuthService } from '../services/AuthService';
import { SupportedLanguage } from '../data/translations';
import { LanguageService } from '../services/LanguageService';

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  onContinueAsGuest?: () => void;
  onCancel?: () => void;
  currentUser?: UserProfile | null;
  currentLanguage?: SupportedLanguage;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  onCancel,
  currentUser,
  currentLanguage,
}) => {
  const t = (key: string) => LanguageService.t(key, currentLanguage);


  const [fullName, setFullName] = useState<string>(currentUser?.fullName || '');
  const [birthdate, setBirthdate] = useState<string>(currentUser?.birthdate || '');
  const [gender, setGender] = useState<string>(currentUser?.gender || '');
  const [mobileNumber, setMobileNumber] = useState<string>(currentUser?.mobileNumber || '');
  const [address, setAddress] = useState<string>(currentUser?.address || '');
  const [isAdmin, setIsAdmin] = useState<boolean>(currentUser?.isAdmin || AuthService.isAdminLoggedIn());
  const [adminPasscode, setAdminPasscode] = useState<string>('admin');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Demo user preset for single-click auto-fill
  const handleQuickFillDemo = (asAdmin = false) => {
    setFullName(asAdmin ? 'Ivan Carl M. Graciano (Admin)' : 'Ivan Carl M. Graciano');
    setBirthdate(asAdmin ? '1990-08-22' : '1990-08-22');
    setGender(asAdmin ? 'Male' : 'Female');
    setMobileNumber(asAdmin ? '0917-123-4567' : '0917-123-4567');
    setAddress(asAdmin ? 'Pagadian City, Zamboanga del Sur' : 'Pagadian City, Zamboanga del Sur');
    setIsAdmin(asAdmin);
    if (asAdmin) {
      setAdminPasscode('admin');
    } else {
      setAdminPasscode('');
    }
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const candidateProfile = {
      fullName,
      birthdate,
      gender,
      mobileNumber,
      address,
    };

    const validation = AuthService.validateUserProfile(candidateProfile);
    const newErrors: Record<string, string> = { ...validation.errors };

    if (isAdmin) {
      if (!AuthService.verifyAdminPasscode(adminPasscode)) {
        newErrors.adminPasscode = 'Invalid administrator passcode. (Default: admin)';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const birthDateObj = new Date(birthdate);
    let calculatedAge = new Date().getFullYear() - birthDateObj.getFullYear();
    const m = new Date().getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && new Date().getDate() < birthDateObj.getDate())) {
      calculatedAge--;
    }

    const validProfile: UserProfile = {
      fullName: fullName.trim(),
      birthdate,
      gender,
      age: calculatedAge,
      mobileNumber: mobileNumber.trim(),
      address: address.trim(),
      isAdmin,
    };

    AuthService.saveUserProfile(validProfile);
    onLoginSuccess(validProfile);
  };

  return (
    <div className="flex-1 flex items-center justify-center px-3.5 py-6 sm:py-12 max-w-xl mx-auto w-full">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden w-full transition-all duration-300">
        {/* Header Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-5 sm:p-8 text-white relative overflow-hidden">

          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
            <ShieldCheck className="w-48 h-48 text-teal-400" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Identity & Profile</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentUser ? 'Update Profile' : 'Sign In / Register'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Please enter your details below. Administrator view access requires logging in with Admin privileges.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {/* Quick Fill Demo CTAs */}
          <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-teal-900 font-medium">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Testing? Use 1-click demo profiles:</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id="demo-patient-btn"
                onClick={() => handleQuickFillDemo(false)}
                className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Patient Demo
              </button>
              <button
                type="button"
                id="demo-admin-btn"
                onClick={() => handleQuickFillDemo(true)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-teal-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-teal-500/30"
              >
                Admin Demo
              </button>
            </div>
          </div>

          {/* Field 1: Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                placeholder="e.g. Jane Doe"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${errors.fullName
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400/40'
                  : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 focus:bg-white'
                  }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Field 2: Birthdate */}
            <div>
              <label htmlFor="birthdate" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Birthdate <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={birthdate}
                  onChange={(e) => {
                    setBirthdate(e.target.value);
                    if (errors.birthdate) setErrors((prev) => ({ ...prev, birthdate: '' }));
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 transition-all ${errors.birthdate
                    ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400/40'
                    : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 focus:bg-white'
                    }`}
                />
              </div>
              {errors.birthdate && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.birthdate}</span>
                </p>
              )}
            </div>

            {/* Field 2.5: Gender */}
            <div>
              <label htmlFor="gender" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <select
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    if (errors.gender) setErrors((prev) => ({ ...prev, gender: '' }));
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 transition-all appearance-none ${errors.gender
                    ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400/40'
                    : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 focus:bg-white'
                    }`}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.gender && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.gender}</span>
                </p>
              )}
            </div>
          </div>

          {/* Field 3: Registered Mobile Number */}
          <div>
            <label htmlFor="mobileNumber" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Registered Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                  if (errors.mobileNumber) setErrors((prev) => ({ ...prev, mobileNumber: '' }));
                }}
                placeholder="e.g. 0917-123-4567"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${errors.mobileNumber
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400/40'
                  : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 focus:bg-white'
                  }`}
              />
            </div>
            {errors.mobileNumber && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.mobileNumber}</span>
              </p>
            )}
          </div>

          {/* Field 4: Address */}
          <div>
            <label htmlFor="address" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <textarea
                id="address"
                name="address"
                rows={2}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                }}
                placeholder="e.g. 123 Health Ave, Suite 400, San Francisco, CA 94107"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all resize-none ${errors.address
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400/40'
                  : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 focus:bg-white'
                  }`}
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.address}</span>
              </p>
            )}
          </div>

          {/* Administrator Role Option */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                id="isAdminCheckbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 accent-teal-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800">
                Sign in with Administrator Privileges (Unlock Rules Engine Editor)
              </span>
            </label>

            {isAdmin && (
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-900 text-white space-y-2">
                <label htmlFor="adminPasscode" className="block text-[11px] font-bold text-teal-300 uppercase tracking-wider">
                  Admin Passcode (Default: <code className="text-white">admin</code>)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="password"
                    id="adminPasscode"
                    value={adminPasscode}
                    onChange={(e) => {
                      setAdminPasscode(e.target.value);
                      if (errors.adminPasscode) setErrors((prev) => ({ ...prev, adminPasscode: '' }));
                    }}
                    placeholder="Enter admin passcode"
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
                  />
                </div>
                {errors.adminPasscode && (
                  <p className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.adminPasscode}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
            {/* Primary Sign In Button - Full width on mobile (order-1 on mobile, order-3 on desktop) */}
            <button
              type="submit"
              id="login-submit-btn"
              className="w-full sm:w-auto order-1 sm:order-3 inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white text-sm font-bold shadow-md shadow-teal-700/20 transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>{currentUser ? 'Save Changes' : isAdmin ? 'Sign In as Admin' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Buttons Row on Mobile (order-2 on mobile, order-1/2 on desktop) */}
            <div className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-1">
              {onCancel && (
                <button
                  type="button"
                  id="login-cancel-btn"
                  onClick={onCancel}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              )}

              {onContinueAsGuest && (
                <button
                  type="button"
                  id="continue-as-guest-btn"
                  onClick={onContinueAsGuest}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-teal-200 bg-teal-50 hover:bg-teal-100/80 text-teal-800 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Guest</span>
                </button>
              )}
            </div>
          </div>


        </form>
      </div>
    </div>
  );
};
