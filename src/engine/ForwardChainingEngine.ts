import {
  DerivedFactTrace,
  FiredRuleTrace,
  InferenceCycleResult,
  Rule,
  TriagePayload,
  TriageSeverity,
} from '../types';
import { getAdviceForSymptoms } from '../data/symptomAdvice';

export class ForwardChainingEngine {
  private rules: Rule[];

  constructor(rules: Rule[]) {
    // Only active rules
    this.rules = rules.filter((r) => r.enabled);
  }

  public evaluate(selectedSymptomIds: string[]): InferenceCycleResult {
    const startTime = performance.now();

    // 1. Initialization Phase: Seed Working Memory
    const workingMemory: Record<string, boolean> = {};

    // Populate all known symptom facts from user input
    for (const symptomId of selectedSymptomIds) {
      workingMemory[symptomId] = true;
    }

    const firedRules: FiredRuleTrace[] = [];
    const derivedFacts: DerivedFactTrace[] = [];

    // Retrieve symptom-tailored advice for all selected symptoms
    const symptomAdvice = getAdviceForSymptoms(selectedSymptomIds);
    const firedRuleIds = new Set<string>();

    let passNumber = 0;
    const maxPasses = 50; // Safety guard against circular rules
    let quiescenceReached = false;

    // 2. Multi-Pass Match-Resolve-Act Forward Chaining Loop
    while (!quiescenceReached && passNumber < maxPasses) {
      passNumber++;
      let factDerivedInThisPass = false;

      // 2.1 Match Phase: Identify all eligible untriggered rules
      const matchingRules: { rule: Rule; matchedConditions: { fact: string; expected: boolean; actual: boolean }[] }[] = [];

      for (const rule of this.rules) {
        if (firedRuleIds.has(rule.id)) {
          continue; // Conflict resolution: prevent duplicate firings
        }

        let isMatch = true;
        const matchedConditions: { fact: string; expected: boolean; actual: boolean }[] = [];

        for (const antecedent of rule.antecedents) {
          const actualValue = workingMemory[antecedent.fact] === true;
          const expectedValue = antecedent.value;

          matchedConditions.push({
            fact: antecedent.fact,
            expected: expectedValue,
            actual: actualValue,
          });

          if (antecedent.operator === 'EQUALS') {
            if (actualValue !== expectedValue) {
              isMatch = false;
              break; // Short-circuit evaluation
            }
          } else if (antecedent.operator === 'NOT_EQUALS') {
            if (actualValue === expectedValue) {
              isMatch = false;
              break; // Short-circuit evaluation
            }
          }
        }

        if (isMatch) {
          matchingRules.push({ rule, matchedConditions });
        }
      }

      // If no matching rules qualify, system has reached quiescence
      if (matchingRules.length === 0) {
        quiescenceReached = true;
        break;
      }

      // 2.2 Conflict Resolution Phase:
      // Sort by Priority (Salience score, descending).
      // If priority is tied, maintain stable deterministic ordering.
      matchingRules.sort((a, b) => b.rule.priority - a.rule.priority);

      // Fire highest priority eligible rules in this pass
      // In classical forward chaining production systems, the conflict set resolves
      // to execute the top rule, or all disjoint rules. Firing the top-priority rule:
      const candidate = matchingRules[0];
      const selectedRule = candidate.rule;

      // 2.3 Act Phase (Rule Execution):
      firedRuleIds.add(selectedRule.id);

      const isNewFact = workingMemory[selectedRule.consequent] !== true;
      workingMemory[selectedRule.consequent] = true;

      firedRules.push({
        ruleId: selectedRule.id,
        ruleName: selectedRule.name,
        passNumber,
        priority: selectedRule.priority,
        matchedConditions: candidate.matchedConditions,
        assertedFact: selectedRule.consequent,
        timestamp: Date.now(),
        payload: selectedRule.payload,
      });

      if (isNewFact) {
        factDerivedInThisPass = true;
        derivedFacts.push({
          fact: selectedRule.consequent,
          derivedInPass: passNumber,
          byRuleId: selectedRule.id,
          byRuleName: selectedRule.name,
        });
      }

      // If no new fact was derived and no payload was registered, quiescence check
      if (!factDerivedInThisPass && matchingRules.length === 1) {
        quiescenceReached = true;
      }
    }

    const endTime = performance.now();
    const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;

    // 3. Triage Assessment Synthesis & Severity Selection
    // Filter fired rules with triage payloads, prioritizing critical > moderate > mild
    const rulesWithPayloads = firedRules
      .filter((r) => r.payload !== undefined)
      .map((r) => ({ trace: r, payload: r.payload! }));

    const emergencySymptomIds = new Set([
      'shortness_of_breath',
      'cyanosis',
      'stiff_neck',
      'severe_headache',
      'confusion_dizziness',
      'chest_tightness',
      'high_fever',
      'wheezing',
    ]);

    const hasEmergencySymptom = selectedSymptomIds.some((id) => emergencySymptomIds.has(id));

    let primaryTriage: TriagePayload;
    let severity: TriageSeverity = 'mild';

    if (rulesWithPayloads.length > 0) {
      // Find highest severity rule
      const critical = rulesWithPayloads.find((p) => p.payload.severity === 'critical');
      const moderate = rulesWithPayloads.find((p) => p.payload.severity === 'moderate');
      const mild = rulesWithPayloads.find((p) => p.payload.severity === 'mild');

      const chosen = critical || moderate || mild || rulesWithPayloads[0];
      primaryTriage = {
        ...chosen.payload,
        recommendations: [...chosen.payload.recommendations],
      };
      severity = chosen.payload.severity;
    } else {
      // Dynamic synthesis tailored to the exact symptoms reported
      if (selectedSymptomIds.length === 0) {
        severity = 'mild';
        primaryTriage = {
          severity: 'mild',
          title: 'No Active Symptoms Reported — General Health Wellness',
          recommendations: [
            'Continue daily preventative hygiene and hydration.',
            'Monitor body temperature if feeling unwell later.',
            'Maintain a balanced sleep schedule and nutrition.',
          ],
          explanation: 'No positive clinical indicators were submitted to working memory. The system concluded baseline home wellness.',
        };
      } else if (hasEmergencySymptom) {
        const isSevereCritical = selectedSymptomIds.some((id) =>
          ['cyanosis', 'chest_tightness'].includes(id)
        );
        severity = isSevereCritical ? 'critical' : 'moderate';

        const redFlagNames = symptomAdvice
          .filter((s) => s.isEmergencyFlag)
          .map((s) => s.symptomLabel)
          .join(', ');

        const dynamicRecs: string[] = [
          isSevereCritical
            ? 'Seek immediate emergency medical evaluation (call 911 or go to the nearest emergency department).'
            : 'Schedule an urgent in-person medical evaluation within 12–24 hours at an Urgent Care clinic or Primary Care Provider.',
        ];

        // Add targeted guidance from the red-flag symptom
        for (const item of symptomAdvice) {
          if (item.recommendations.length > 0) {
            dynamicRecs.push(`For ${item.symptomLabel}: ${item.recommendations[0]}`);
          }
        }

        dynamicRecs.push('Do not delay clinical assessment if symptoms escalate or breathing becomes labored.');

        primaryTriage = {
          severity,
          title: isSevereCritical
            ? `Emergency Evaluation Advised: ${redFlagNames}`
            : `Prompt Clinical Consultation Recommended: ${redFlagNames}`,
          recommendations: dynamicRecs,
          explanation: `Identified acute clinical indicator(s) (${redFlagNames}). Prompt professional medical examination is warranted to rule out acute complications.`,
        };
      } else {
        // Mild / Self-Care Presentation with specific symptoms selected
        severity = 'mild';
        const symptomNames = symptomAdvice.map((s) => s.symptomLabel);

        let dynamicTitle = 'Self-Care & Home Observation';
        if (symptomNames.length === 1) {
          dynamicTitle = `Targeted Self-Care: ${symptomNames[0]}`;
        } else if (symptomNames.length === 2) {
          dynamicTitle = `Targeted Self-Care: ${symptomNames[0]} & ${symptomNames[1]}`;
        } else {
          dynamicTitle = `Targeted Symptom Relief & Home Observation (${symptomNames.length} Symptoms)`;
        }

        // Generate tailored recommendations directly from the selected symptoms
        const dynamicRecs: string[] = [];

        for (const item of symptomAdvice) {
          if (item.recommendations.length > 0) {
            dynamicRecs.push(`For ${item.symptomLabel}: ${item.recommendations[0]}`);
          }
        }

        dynamicRecs.push('Rest adequately, maintain high fluid intake, and consult a physician if symptoms persist beyond 48–72 hours.');

        primaryTriage = {
          severity: 'mild',
          title: dynamicTitle,
          recommendations: dynamicRecs,
          explanation: `Evaluated ${selectedSymptomIds.length} reported symptom(s) (${symptomNames.join(', ')}). No emergency respiratory or systemic red flags were detected. Targeted home measures and rest are recommended.`,
        };
      }
    }

    // 4. Weighted Severity & Aggregate Confidence Index (PDF Section 7.3)
    // Emergency flags weight 0.35 each, moderate symptoms 0.15, mild 0.08
    let aggregateScore = 0;

    for (const id of selectedSymptomIds) {
      if (emergencySymptomIds.has(id)) {
        aggregateScore += 0.35;
      } else {
        aggregateScore += 0.12;
      }
    }

    if (severity === 'critical') {
      aggregateScore = Math.max(aggregateScore, 0.88);
    } else if (severity === 'moderate') {
      aggregateScore = Math.max(aggregateScore, 0.55);
    }

    const aggregateConfidence = Math.min(1.0, Math.round(aggregateScore * 100) / 100);

    return {
      initialSymptoms: selectedSymptomIds,
      finalWorkingMemory: workingMemory,
      derivedFacts,
      firedRules,
      passesCount: passNumber,
      executionTimeMs,
      severity,
      primaryTriage,
      aggregateConfidence,
      evaluatedAt: new Date().toISOString(),
      symptomAdvice,
    };
  }
}
