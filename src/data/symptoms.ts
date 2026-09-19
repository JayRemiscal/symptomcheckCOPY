import { SymptomCategory, SymptomDefinition } from '../types';

export const SYMPTOM_DEFINITIONS: SymptomDefinition[] = [
  // Respiratory
  {
    id: 'dry_cough',
    label: 'Dry Cough',
    category: 'respiratory',
    description: 'Persistent dry, hacking cough without mucus production.',
  },
  {
    id: 'shortness_of_breath',
    label: 'Shortness of Breath (Dyspnea)',
    category: 'respiratory',
    description: 'Difficulty catching breath, rapid breathing, or panting at rest or minimal exertion.',
    isEmergencyFlag: true,
  },
  {
    id: 'sore_throat',
    label: 'Sore Throat (Pharyngitis)',
    category: 'respiratory',
    description: 'Scratchy, painful sensation in throat made worse when swallowing.',
  },
  {
    id: 'wheezing',
    label: 'Wheezing or Stridor',
    category: 'respiratory',
    description: 'Audible coarse or whistling sound when exhaling or inhaling.',
    isEmergencyFlag: true,
  },
  {
    id: 'chest_tightness',
    label: 'Chest Tightness or Pain',
    category: 'respiratory',
    description: 'Pressure, heaviness, squeezing, or pain localized across the thoracic cage.',
    isEmergencyFlag: true,
  },
  {
    id: 'productive_cough',
    label: 'Productive Cough with Sputum',
    category: 'respiratory',
    description: 'Cough that brings up yellow, green, or discolored mucus/phlegm.',
  },

  // Systemic
  {
    id: 'fever',
    label: 'Fever (37.8°C – 38.9°C / 100°F – 102°F)',
    category: 'systemic',
    description: 'Elevated body temperature accompanied by warm skin.',
  },
  {
    id: 'high_fever',
    label: 'High Fever (> 39.0°C / 102.2°F)',
    category: 'systemic',
    description: 'Severe high temperature that remains elevated despite standard antipyretics.',
    isEmergencyFlag: true,
  },
  {
    id: 'fatigue',
    label: 'Severe Fatigue & Malaise',
    category: 'systemic',
    description: 'Unusual profound exhaustion and generalized weakness.',
  },
  {
    id: 'chills',
    label: 'Chills & Rigors',
    category: 'systemic',
    description: 'Uncontrollable shivering, feeling freezing cold, or teeth chattering.',
  },
  {
    id: 'body_aches',
    label: 'Generalized Body Aches (Myalgia)',
    category: 'systemic',
    description: 'Deep muscular soreness and stiffness across joints and back.',
  },
  {
    id: 'sweating',
    label: 'Drenching Sweats',
    category: 'systemic',
    description: 'Profuse perspiration or night sweats soaking through clothing.',
  },

  // Neurological / General
  {
    id: 'severe_headache',
    label: 'Severe Sudden Headache',
    category: 'neurological_general',
    description: 'Sudden, incapacitating throbbing or sharp cranial pain.',
    isEmergencyFlag: true,
  },
  {
    id: 'loss_of_taste_smell',
    label: 'Loss of Taste or Smell',
    category: 'neurological_general',
    description: 'Sudden partial or complete loss of olfactory sense (anosmia) or gustatory sense (ageusia).',
  },
  {
    id: 'confusion_dizziness',
    label: 'Confusion, Disorientation, or Syncope',
    category: 'neurological_general',
    description: 'Altered mental state, lethargy, difficulty forming sentences, or fainting.',
    isEmergencyFlag: true,
  },
  {
    id: 'stiff_neck',
    label: 'Stiff Neck (Nuchal Rigidity)',
    category: 'neurological_general',
    description: 'Severe pain and physical inability to flex the neck chin-to-chest.',
    isEmergencyFlag: true,
  },
  {
    id: 'cyanosis',
    label: 'Bluish Lips or Face (Cyanosis)',
    category: 'neurological_general',
    description: 'Blue, ashen, or pale discoloration of lips, tongue, skin, or nail beds indicating low oxygen.',
    isEmergencyFlag: true,
  },
  {
    id: 'nausea_vomiting',
    label: 'Persistent Nausea / Vomiting',
    category: 'neurological_general',
    description: 'Ongoing inability to retain fluids or oral intake.',
  },
];

export const CATEGORY_METADATA: Record<SymptomCategory, { title: string; subtitle: string; icon: string }> = {
  respiratory: {
    title: 'Respiratory Symptoms',
    subtitle: 'Airway, lung function, cough, and throat signs',
    icon: 'Wind',
  },
  systemic: {
    title: 'Systemic & Febrile Symptoms',
    subtitle: 'Whole-body reactions, temperature, and energy',
    icon: 'Thermometer',
  },
  neurological_general: {
    title: 'Neurological & General Red Flags',
    subtitle: 'Sensory changes, cranial signs, and acute indicators',
    icon: 'Brain',
  },
};
