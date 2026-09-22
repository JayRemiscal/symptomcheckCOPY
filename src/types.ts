export type SymptomCategory = 'respiratory' | 'systemic' | 'neurological_general';

export interface SymptomDefinition {
  id: string;
  label: string;
  category: SymptomCategory;
  description: string;
  isEmergencyFlag?: boolean;
}

export interface FactCondition {
  fact: string;
  operator: 'EQUALS' | 'NOT_EQUALS';
  value: boolean;
}

export type TriageSeverity = 'mild' | 'moderate' | 'critical';

export interface TriagePayload {
  severity: TriageSeverity;
  title: string;
  recommendations: string[];
  explanation: string;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  priority: number; // 1 - 100 (Salience score)
  antecedents: FactCondition[];
  consequent: string; // The fact asserted into Working Memory
  isSystem: boolean;
  enabled: boolean;
  payload?: TriagePayload;
}

export interface FiredRuleTrace {
  ruleId: string;
  ruleName: string;
  passNumber: number;
  priority: number;
  matchedConditions: {
    fact: string;
    expected: boolean;
    actual: boolean;
  }[];
  assertedFact: string;
  timestamp: number;
  payload?: TriagePayload;
}

export interface DerivedFactTrace {
  fact: string;
  derivedInPass: number;
  byRuleId: string;
  byRuleName: string;
}

export interface SymptomSpecificAdvice {
  symptomId: string;
  symptomLabel: string;
  category: SymptomCategory;
  isEmergencyFlag?: boolean;
  actionTitle: string;
  recommendations: string[];
}

export interface InferenceCycleResult {
  initialSymptoms: string[];
  finalWorkingMemory: Record<string, boolean>;
  derivedFacts: DerivedFactTrace[];
  firedRules: FiredRuleTrace[];
  passesCount: number;
  executionTimeMs: number;
  severity: TriageSeverity;
  primaryTriage: TriagePayload;
  aggregateConfidence: number; // 0.0 - 1.0
  evaluatedAt: string;
  symptomAdvice?: SymptomSpecificAdvice[];
}

export interface UserProfile {
  fullName: string;
  age: number;
  mobileNumber: string;
  address: string;
  isAdmin?: boolean;
}


