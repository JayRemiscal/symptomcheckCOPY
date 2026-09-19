import { SymptomSpecificAdvice } from '../types';
import { SYMPTOM_DEFINITIONS } from './symptoms';

export const SYMPTOM_ADVICE_CATALOG: Record<
  string,
  { actionTitle: string; recommendations: string[] }
> = {
  dry_cough: {
    actionTitle: 'Dry Cough Relief & Airway Soothing',
    recommendations: [
      'Sip warm liquids such as herbal teas with honey or warm broths to coat and soothe throat tissues.',
      'Use a cool-mist room humidifier or take a warm, steamy shower to alleviate bronchial dryness.',
      'Elevate your head and torso with an extra pillow while sleeping to reduce the nocturnal cough reflex.',
      'Avoid air irritants including tobacco smoke, harsh chemical cleaning vapors, and cold dry drafts.',
    ],
  },
  shortness_of_breath: {
    actionTitle: 'Respiratory Positioning & Dyspnea Management',
    recommendations: [
      'Assume a seated "tripod position" (sitting upright, leaning slightly forward with arms supported on knees or a table) to assist diaphragm expansion.',
      'Practice slow pursed-lip breathing: inhale gently through your nose for 2 seconds, exhale slowly through pursed lips for 4 seconds.',
      'Check blood oxygen saturation using a home pulse oximeter if available; seek immediate emergency care if reading drops below 95%.',
      'Cease all physical exertion and remain at rest in a well-ventilated, cool room.',
    ],
  },
  sore_throat: {
    actionTitle: 'Pharyngeal Soothing & Throat Care',
    recommendations: [
      'Gargle warm salt water (1/2 teaspoon of salt in 8 ounces of warm water) 3 to 4 times daily to reduce tissue swelling and bacterial buildup.',
      'Rest your vocal cords and avoid shouting or whispering, which strains inflamed laryngeal cords.',
      'Suck on throat lozenges containing pectin, honey, or mild anesthetic agents for local numbing.',
      'Stay well-hydrated with cool or lukewarm non-acidic liquids; avoid citrus juices or spicy foods.',
    ],
  },
  wheezing: {
    actionTitle: 'Bronchial Relaxation & Airway Protocol',
    recommendations: [
      'If you have a prescribed quick-relief rescue inhaler (such as albuterol), use it immediately as directed by your asthma/COPD action plan.',
      'Sit fully upright in a chair to keep airways open; avoid lying flat on your back.',
      'Stay away from sudden temperature drops, pet dander, smoke, and strong scented fragrances.',
      'Seek immediate urgent care if wheezing worsens into silent struggle, chest retractions, or speech difficulty.',
    ],
  },
  chest_tightness: {
    actionTitle: 'Cardiopulmonary Rest & Observation Protocol',
    recommendations: [
      'Stop all physical activity immediately and rest in a comfortable semi-reclined position.',
      'Loosen any tight or restrictive clothing around your neck, chest, and waist.',
      'Do not attempt to drive yourself to the clinic; call emergency services (911) if pain radiates to your arm, neck, back, or jaw.',
      'Focus on slow, steady rhythmic breathing while monitoring symptom changes.',
    ],
  },
  productive_cough: {
    actionTitle: 'Mucus Clearance & Hydration Protocol',
    recommendations: [
      'Drink plenty of warm water and clear broths (at least 2.5 to 3 liters daily) to thin thick bronchial mucus secretions.',
      'Avoid cough suppressants that trap phlegm in airways; consult a doctor or pharmacist about an OTC expectorant (guaifenesin) to facilitate clearing.',
      'Observe sputum color, thickness, and volume; seek prompt clinical evaluation if mucus is rust-colored, blood-streaked, or foul-smelling.',
      'Use chest percussion or positional drainage techniques after inhaling warm steam vapor.',
    ],
  },
  fever: {
    actionTitle: 'Temperature Control & Fever Management',
    recommendations: [
      'Measure and log body temperature every 4 to 6 hours using a digital thermometer.',
      'Dress in light, breathable cotton clothing and sleep under a light sheet; avoid heavy blankets that trap body heat.',
      'Stay consistently hydrated with water, diluted juices, or electrolyte solutions to replace fluid lost through perspiration.',
      'Consider over-the-counter antipyretics (acetaminophen or ibuprofen) according to packaging instructions if feeling uncomfortable or body temperature exceeds 38.5°C (101.3°F).',
    ],
  },
  high_fever: {
    actionTitle: 'High Temperature Safety & Active Cooling',
    recommendations: [
      'Apply lukewarm (never cold or ice) damp washcloths to forehead, back of neck, and underarms to encourage gentle evaporative cooling.',
      'Prioritize oral rehydration therapy with balanced electrolyte drinks to prevent rapid dehydration and electrolyte imbalance.',
      'Monitor responsiveness closely; do not give aspirin to children or teenagers under 19 due to the risk of Reye\'s syndrome.',
      'Seek urgent medical care if high fever (>39.0°C / 102.2°F) fails to decrease after medication or persists longer than 48 hours.',
    ],
  },
  fatigue: {
    actionTitle: 'Energy Conservation & Rest Protocol',
    recommendations: [
      'Prioritize 8 to 10 hours of uninterrupted sleep and take short, quiet 20-minute resting breaks throughout the day.',
      'Postpone non-essential chores and avoid strenuous workouts until your immune system recovers.',
      'Eat small, nutrient-dense meals with adequate protein and complex carbohydrates to sustain cellular energy.',
      'Stay properly hydrated, as mild dehydration significantly amplifies physical fatigue and weakness.',
    ],
  },
  chills: {
    actionTitle: 'Chills & Rigors Temperature Regulation',
    recommendations: [
      'Dress in adaptable, easily removable layers so you can adjust as chills cycle into fever spikes or sweats.',
      'Sip warm caffeine-free herbal tea or clear chicken broth to warm your core from within.',
      'Avoid excessively hot baths or heavy electric blankets, which can cause sudden spikes in core body temperature.',
      'Track chills along with temperature readings, as severe shaking rigors often herald a rapid fever spike.',
    ],
  },
  body_aches: {
    actionTitle: 'Myalgia Relief & Muscle Care',
    recommendations: [
      'Take a warm bath with Epsom salts or apply a heating pad wrapped in a towel to aching muscle groups for 15–20 minutes.',
      'Practice gentle, slow range-of-motion stretches without overexerting tender joints or muscles.',
      'Ensure adequate magnesium and potassium intake through hydrating electrolyte broths or bananas.',
      'Consider OTC analgesics (ibuprofen or acetaminophen) under clinical or pharmacist guidance for muscular relief.',
    ],
  },
  sweating: {
    actionTitle: 'Diaphoresis Fluid & Electrolyte Replacement',
    recommendations: [
      'Regularly replace fluid and mineral losses by drinking oral rehydration solutions (ORS), coconut water, or diluted broths.',
      'Change damp clothing and bed linens promptly to maintain skin cleanliness and prevent secondary chilling.',
      'Keep the room at a comfortable, cool ambient temperature with gentle air circulation.',
      'Monitor for signs of dehydration such as dark-colored urine, dry mouth, or lightheadedness upon standing.',
    ],
  },
  severe_headache: {
    actionTitle: 'Headache Alleviation & Neuro Sensory Care',
    recommendations: [
      'Rest in a dark, quiet, well-ventilated room away from bright screens, artificial lighting, and loud noises.',
      'Apply an ice pack or cold gel wrap over your forehead, temples, or base of the neck for 15 minutes at a time.',
      'Drink 500 mL of cool water, as dehydration is a very common trigger and amplifier of acute headaches.',
      'Monitor for warning signs: seek immediate emergency evaluation if headache is accompanied by neck stiffness, visual disturbance, or sudden "thunderclap" onset.',
    ],
  },
  loss_of_taste_smell: {
    actionTitle: 'Sensory Recovery & Viral Isolation Protocol',
    recommendations: [
      'Perform an at-home rapid antigen swab test (e.g., COVID-19 or Influenza test kit) to identify viral etiology.',
      'Isolate at home from vulnerable or elderly household members while viral symptoms are active.',
      'Ensure smoke and carbon monoxide detectors in the home are functioning properly, as sensory loss impairs detection of hazard odors.',
      'Eat nutrient-dense, aromatic foods with varied textures, temperatures, and gentle spices to maintain adequate caloric intake.',
    ],
  },
  confusion_dizziness: {
    actionTitle: 'Fall Prevention & Neurological Safety',
    recommendations: [
      'Sit down or lie down immediately to prevent falls and head trauma; elevate your feet slightly if feeling faint.',
      'Have an adult family member or caregiver stay in the room to observe your mental alertness and balance.',
      'Avoid driving, operating machinery, or walking down staircases unassisted.',
      'Seek immediate emergency evaluation if dizziness is accompanied by slurred speech, facial weakness, or numbness.',
    ],
  },
  stiff_neck: {
    actionTitle: 'Nuchal Rigidity Urgent Assessment',
    recommendations: [
      'Avoid forceful neck cracking, vigorous stretching, or aggressive massage until medical assessment is complete.',
      'Check if you can touch your chin to your chest; inability to do so alongside fever is a medical red flag requiring emergency evaluation.',
      'Rest with a supportive, low cervical pillow that maintains neutral spinal alignment.',
      'Do not delay seeking clinical evaluation if neck stiffness began abruptly or accompanies fever or headache.',
    ],
  },
  cyanosis: {
    actionTitle: 'Oxygenation Emergency Protocol',
    recommendations: [
      'Call emergency dispatch (911) immediately — bluish discoloration of lips, face, or nail beds indicates critically low blood oxygenation.',
      'Sit completely upright to maximize available lung capacity while waiting for emergency responders.',
      'Administer supplemental home oxygen if prescribed and available.',
      'Loosen any tight clothing around your collar and chest; keep airways completely clear.',
    ],
  },
  nausea_vomiting: {
    actionTitle: 'Gastrointestinal Calming & Oral Rehydration',
    recommendations: [
      'Temporarily pause solid foods; take very small sips (1 to 2 teaspoons every 5 to 10 minutes) of oral rehydration solution, cool water, or diluted apple juice.',
      'Sip warm peppermint or ginger tea to help naturally settle gastric contractions.',
      'Once vomiting has stopped for 4 to 6 hours, gradually reintroduce bland foods following the BRAT diet (Bananas, Rice, Applesauce, Toast).',
      'Avoid dairy products, fried or greasy foods, caffeine, and highly acidic drinks until digestion stabilizes.',
    ],
  },
};

/**
 * Returns tailored recommendations for each of the selected symptoms.
 */
export function getAdviceForSymptoms(symptomIds: string[]): SymptomSpecificAdvice[] {
  const result: SymptomSpecificAdvice[] = [];
  const defMap = new Map(SYMPTOM_DEFINITIONS.map((s) => [s.id, s]));

  for (const id of symptomIds) {
    const def = defMap.get(id);
    const advice = SYMPTOM_ADVICE_CATALOG[id];

    if (def && advice) {
      result.push({
        symptomId: id,
        symptomLabel: def.label,
        category: def.category,
        isEmergencyFlag: def.isEmergencyFlag,
        actionTitle: advice.actionTitle,
        recommendations: advice.recommendations,
      });
    }
  }

  // Sort: Emergency flags first, then respiratory, systemic, neurological
  const categoryOrder: Record<string, number> = {
    respiratory: 1,
    systemic: 2,
    neurological_general: 3,
  };

  result.sort((a, b) => {
    if (a.isEmergencyFlag && !b.isEmergencyFlag) return -1;
    if (!a.isEmergencyFlag && b.isEmergencyFlag) return 1;
    return (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99);
  });

  return result;
}
