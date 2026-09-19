import { SYSTEM_SEED_RULES } from '../data/seedRules';
import { Rule } from '../types';

const STORAGE_KEY_CUSTOM_RULES = 'symptomcheck_custom_rules_v1';
const STORAGE_KEY_DISABLED_SYSTEM_RULES = 'symptomcheck_disabled_system_rules_v1';

export class RuleStorageService {
  /**
   * Retrieves unified rules (System Seed Rules + Custom Admin Rules)
   */
  public static getAllRules(): Rule[] {
    const disabledSystemIds = this.getDisabledSystemRuleIds();
    const customRules = this.getCustomRules();

    const unifiedSystemRules = SYSTEM_SEED_RULES.map((rule) => ({
      ...rule,
      enabled: !disabledSystemIds.has(rule.id),
    }));

    return [...unifiedSystemRules, ...customRules];
  }

  public static getCustomRules(): Rule[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_RULES);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public static saveCustomRule(rule: Rule): { success: boolean; error?: string } {
    const validation = this.validateRule(rule);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const current = this.getCustomRules();
    const index = current.findIndex((r) => r.id === rule.id);

    if (index >= 0) {
      current[index] = rule;
    } else {
      current.push(rule);
    }

    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_RULES, JSON.stringify(current));
      return { success: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Storage write error';
      return { success: false, error: msg };
    }
  }

  public static deleteCustomRule(ruleId: string): boolean {
    const current = this.getCustomRules();
    const filtered = current.filter((r) => r.id !== ruleId);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_RULES, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  }

  public static toggleSystemRule(ruleId: string, enabled: boolean): void {
    const disabledIds = this.getDisabledSystemRuleIds();
    if (enabled) {
      disabledIds.delete(ruleId);
    } else {
      disabledIds.add(ruleId);
    }
    localStorage.setItem(
      STORAGE_KEY_DISABLED_SYSTEM_RULES,
      JSON.stringify(Array.from(disabledIds)),
    );
  }

  public static toggleCustomRule(ruleId: string, enabled: boolean): void {
    const current = this.getCustomRules();
    const target = current.find((r) => r.id === ruleId);
    if (target) {
      target.enabled = enabled;
      localStorage.setItem(STORAGE_KEY_CUSTOM_RULES, JSON.stringify(current));
    }
  }

  public static resetToFactoryDefaults(): void {
    localStorage.removeItem(STORAGE_KEY_CUSTOM_RULES);
    localStorage.removeItem(STORAGE_KEY_DISABLED_SYSTEM_RULES);
  }

  public static exportRulesJSON(): string {
    const allRules = this.getAllRules();
    return JSON.stringify(allRules, null, 2);
  }

  public static importRulesJSON(jsonString: string): { success: boolean; count?: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, error: 'Expected an array of Rule objects in JSON.' };
      }

      const validRules: Rule[] = [];
      for (const item of parsed) {
        if (!item.id || !item.name || !Array.isArray(item.antecedents) || !item.consequent) {
          return { success: false, error: `Invalid rule structure for rule ID: ${item?.id || 'unknown'}` };
        }
        validRules.push({
          ...item,
          isSystem: false, // Imported rules become customizable
          enabled: item.enabled !== false,
        });
      }

      localStorage.setItem(STORAGE_KEY_CUSTOM_RULES, JSON.stringify(validRules));
      return { success: true, count: validRules.length };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON file';
      return { success: false, error: msg };
    }
  }

  /**
   * Dry-Run Rule Pre-Check Validation (PDF Section 5.2)
   */
  public static validateRule(rule: Partial<Rule>): { valid: boolean; error?: string } {
    if (!rule.id || rule.id.trim() === '') {
      return { valid: false, error: 'Rule identifier is required.' };
    }
    if (!rule.name || rule.name.trim() === '') {
      return { valid: false, error: 'Rule title / name is required.' };
    }
    if (!rule.antecedents || rule.antecedents.length === 0) {
      return { valid: false, error: 'Rule must define at least one IF antecedent condition.' };
    }
    if (!rule.consequent || rule.consequent.trim() === '') {
      return { valid: false, error: 'Rule must define a THEN consequent fact to assert.' };
    }

    // Check for self-circular logic: IF fact X THEN fact X
    for (const ant of rule.antecedents) {
      if (ant.fact === rule.consequent) {
        return {
          valid: false,
          error: `Self-circular loop detected: Antecedent condition fact '${ant.fact}' cannot match consequent assertion '${rule.consequent}'.`,
        };
      }
    }

    // Check priority bounds
    if (typeof rule.priority !== 'number' || rule.priority < 1 || rule.priority > 100) {
      return { valid: false, error: 'Priority must be an integer between 1 (lowest) and 100 (highest).' };
    }

    return { valid: true };
  }

  private static getDisabledSystemRuleIds(): Set<string> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DISABLED_SYSTEM_RULES);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  }
}
