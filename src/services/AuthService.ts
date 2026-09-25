import { UserProfile } from '../types';

const STORAGE_KEY_USER_PROFILE = 'symptomcheck_user_profile_v1';
const STORAGE_KEY_IS_ADMIN = 'symptomcheck_is_admin_v1';

export class AuthService {
  public static getUserProfile(): UserProfile | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USER_PROFILE);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed.fullName === 'string' &&
        typeof parsed.birthdate === 'string' &&
        typeof parsed.gender === 'string' &&
        typeof parsed.age === 'number' &&
        typeof parsed.mobileNumber === 'string' &&
        typeof parsed.address === 'string'
      ) {
        return {
          ...parsed,
          isAdmin: this.isAdminLoggedIn(),
        } as UserProfile;
      }
      return null;
    } catch {
      return null;
    }
  }

  public static saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(profile));
      if (profile.isAdmin !== undefined) {
        this.setAdminLoggedIn(profile.isAdmin);
      }
    } catch (e) {
      console.error('Failed to save user profile', e);
    }
  }

  public static isAdminLoggedIn(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY_IS_ADMIN) === 'true';
    } catch {
      return false;
    }
  }

  public static setAdminLoggedIn(isAdmin: boolean): void {
    try {
      if (isAdmin) {
        localStorage.setItem(STORAGE_KEY_IS_ADMIN, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEY_IS_ADMIN);
      }
    } catch (e) {
      console.error('Failed to update admin state', e);
    }
  }

  public static verifyAdminPasscode(passcode: string): boolean {
    const clean = (passcode || '').trim().toLowerCase();
    return clean === 'admin' || clean === 'admin123' || clean === '1234' || clean === 'root';
  }

  public static logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_USER_PROFILE);
      localStorage.removeItem(STORAGE_KEY_IS_ADMIN);
    } catch (e) {
      console.error('Failed to clear user profile', e);
    }
  }

  public static validateUserProfile(profile: {
    fullName?: string;
    birthdate?: string;
    gender?: string;
    mobileNumber?: string;
    address?: string;
  }): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Validate Full Name
    if (!profile.fullName || profile.fullName.trim().length === 0) {
      errors.fullName = 'Full name is required.';
    } else if (profile.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters.';
    }

    // Validate Birthdate
    if (!profile.birthdate) {
      errors.birthdate = 'Birthdate is required.';
    } else {
      const date = new Date(profile.birthdate);
      if (isNaN(date.getTime())) {
        errors.birthdate = 'Please enter a valid birthdate.';
      } else {
        const age = new Date().getFullYear() - date.getFullYear();
        if (age < 0 || age > 120) {
          errors.birthdate = 'Please enter a valid birthdate (Age must be between 0 and 120).';
        }
      }
    }

    // Validate Gender
    if (!profile.gender || profile.gender.trim().length === 0) {
      errors.gender = 'Gender is required.';
    }

    // Validate Registered Mobile Number
    const cleanedMobile = (profile.mobileNumber || '').replace(/[\s\-\(\)\+]/g, '');
    if (!profile.mobileNumber || profile.mobileNumber.trim().length === 0) {
      errors.mobileNumber = 'Registered mobile number is required.';
    } else if (cleanedMobile.length < 7 || cleanedMobile.length > 15 || !/^\d+$/.test(cleanedMobile)) {
      errors.mobileNumber = 'Please enter a valid mobile phone number (7-15 digits).';
    }

    // Validate Address
    if (!profile.address || profile.address.trim().length === 0) {
      errors.address = 'Address is required.';
    } else if (profile.address.trim().length < 5) {
      errors.address = 'Address should be at least 5 characters long.';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
