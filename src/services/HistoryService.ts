import { SYMPTOM_DEFINITIONS } from '../data/symptoms';
import { HistoryEntry, InferenceCycleResult, UserProfile } from '../types';

const MAX_HISTORY_ENTRIES = 100;
const STORAGE_PREFIX = 'symptomcheck_history_v1_';

/**
 * Returns the localStorage key for the given user.
 * Keyed by mobile number (unique per account).
 * Falls back to 'guest' for unauthenticated users.
 */
function storageKey(profile: UserProfile | null): string {
  if (profile?.mobileNumber) {
    // Sanitise to only alphanumeric chars for safe key usage
    const safeId = profile.mobileNumber.replace(/\D/g, '');
    return `${STORAGE_PREFIX}${safeId}`;
  }
  return `${STORAGE_PREFIX}guest`;
}

function buildSymptomLabels(symptomIds: string[]): string[] {
  const map = new Map<string, string>();
  for (const s of SYMPTOM_DEFINITIONS) map.set(s.id, s.label);
  return symptomIds.map((id) => map.get(id) ?? id);
}

export class HistoryService {
  /** Persist a completed assessment result for the given user. */
  public static saveAssessment(
    profile: UserProfile | null,
    result: InferenceCycleResult
  ): void {
    try {
      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        savedAt: new Date().toISOString(),
        userSnapshot: {
          fullName: profile?.fullName ?? 'Guest',
          age: profile?.age ?? 0,
        },
        severity: result.severity,
        primaryTitle: result.primaryTriage.title,
        symptomsReported: buildSymptomLabels(result.initialSymptoms),
        result,
      };

      const existing = this.getHistory(profile);
      const updated = [entry, ...existing].slice(0, MAX_HISTORY_ENTRIES);
      localStorage.setItem(storageKey(profile), JSON.stringify(updated));
    } catch (e) {
      console.warn('HistoryService: failed to save assessment', e);
    }
  }

  /** Returns all history entries for the user, newest first. */
  public static getHistory(profile: UserProfile | null): HistoryEntry[] {
    try {
      const raw = localStorage.getItem(storageKey(profile));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /** Delete a single entry by id. */
  public static deleteEntry(profile: UserProfile | null, id: string): void {
    try {
      const filtered = this.getHistory(profile).filter((e) => e.id !== id);
      localStorage.setItem(storageKey(profile), JSON.stringify(filtered));
    } catch (e) {
      console.warn('HistoryService: failed to delete entry', e);
    }
  }

  /** Wipe all history for the user. */
  public static clearHistory(profile: UserProfile | null): void {
    try {
      localStorage.removeItem(storageKey(profile));
    } catch (e) {
      console.warn('HistoryService: failed to clear history', e);
    }
  }
}
