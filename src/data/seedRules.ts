import { Rule } from '../types';

export const SYSTEM_SEED_RULES: Rule[] = [
  // ==========================================
  // LEVEL 1: INTERMEDIATE FACT DERIVATION RULES
  // ==========================================
  {
    id: 'rule_derive_viral_respiratory',
    name: 'Derive: Suspected Viral Respiratory Syndrome',
    description: 'Combines dry cough and fever to infer an active viral respiratory pathway in working memory.',
    priority: 30,
    antecedents: [
      { fact: 'dry_cough', operator: 'EQUALS', value: true },
      { fact: 'fever', operator: 'EQUALS', value: true },
    ],
    consequent: 'suspect_viral_respiratory_infection',
    isSystem: true,
    enabled: true,
  },
  {
    id: 'rule_derive_systemic_influenza',
    name: 'Derive: Suspected Influenza / Febrile Viremia',
    description: 'Combines fever, chills, and diffuse body aches to derive systemic febrile viremia.',
    priority: 35,
    antecedents: [
      { fact: 'fever', operator: 'EQUALS', value: true },
      { fact: 'chills', operator: 'EQUALS', value: true },
      { fact: 'body_aches', operator: 'EQUALS', value: true },
    ],
    consequent: 'suspect_systemic_influenza',
    isSystem: true,
    enabled: true,
  },
  {
    id: 'rule_derive_severe_airway_compromise',
    name: 'Derive: Acute Airway / Thoracic Strain',
    description: 'Infers thoracic compromise when chest tightness presents alongside wheezing.',
    priority: 45,
    antecedents: [
      { fact: 'chest_tightness', operator: 'EQUALS', value: true },
      { fact: 'wheezing', operator: 'EQUALS', value: true },
    ],
    consequent: 'acute_airway_strain',
    isSystem: true,
    enabled: true,
  },

  // ==========================================
  // LEVEL 2: CRITICAL EMERGENCY TRIAGE RULES (Priority 90 - 100)
  // ==========================================
  {
    id: 'rule_emergency_respiratory_failure',
    name: 'Critical: Hypoxia & Respiratory Failure Risk',
    description: 'Co-occurrence of shortness of breath and peripheral/central cyanosis indicates life-threatening hypoxia.',
    priority: 100,
    antecedents: [
      { fact: 'shortness_of_breath', operator: 'EQUALS', value: true },
      { fact: 'cyanosis', operator: 'EQUALS', value: true },
    ],
    consequent: 'emergency_respiratory_failure',
    isSystem: true,
    enabled: true,
    payload: {
      severity: 'critical',
      title: 'Seek Immediate Emergency Medical Care — Hypoxia / Respiratory Distress',
      recommendations: [
        'Call emergency services (911 or local emergency dispatcher) immediately.',
        'Do not attempt to operate a motor vehicle or walk to emergency facilities unattended.',
        'Position the patient seated completely upright with support to assist diaphragmatic expansion.',
        'Administer supplemental oxygen if available and trained to do so.',
        'Loosen restrictive neck or chest clothing while awaiting paramedics.',
      ],
      explanation: 'Shortness of breath accompanied by blue or ashen discoloration (cyanosis) indicates critically low arterial oxygen saturation requiring rapid emergency resuscitation.',
    },
  },
  {
    id: 'rule_emergency_meningism_sepsis',
    name: 'Critical: Suspected Meningitis or Severe Neuro-Infection',
    description: 'High fever coupled with neck stiffness and severe headache forms the classic meningism triad.',
    priority: 98,
    antecedents: [
      { fact: 'high_fever', operator: 'EQUALS', value: true },
      { fact: 'stiff_neck', operator: 'EQUALS', value: true },
      { fact: 'severe_headache', operator: 'EQUALS', value: true },
    ],
    consequent: 'emergency_suspected_meningitis',
    isSystem: true,
    enabled: true,
    payload: {
      severity: 'critical',
      title: 'Seek Immediate Emergency Medical Care — Suspected Meningitis / Neuro-Infection',
      recommendations: [
        'Go immediately to the nearest Hospital Emergency Department.',
        'Alert medical triage personnel immediately about fever and neck rigidity (nuchal stiffness).',
        'Keep environment quiet, dimly lit, and minimize abrupt head motion.',
        'Do not delay medical evaluation with home remedies or oral analgesics.',
      ],
      explanation: 'The clinical triad of high sustained fever, severe headache, and inability to flex the neck (nuchal rigidity) indicates potential acute bacterial or viral meningitis or severe central nervous system infection.',
    },
  },
  {
    id: 'rule_emergency_cardiopulmonary_crisis',
    name: 'Critical: Cardiopulmonary Crisis / Acute Coronary Syndrome',
    description: 'Severe chest tightness presenting with shortness of breath warrants immediate emergency cardiology evaluation.',
    priority: 95,
    antecedents: [
      { fact: 'chest_tightness', operator: 'EQUALS', value: true },
      { fact: 'shortness_of_breath', operator: 'EQUALS', value: true },
    ],
    consequent: 'emergency_cardiopulmonary_crisis',
    isSystem: true,
    enabled: true,
    payload: {
      severity: 'critical',
      title: 'Seek Immediate Emergency Medical Care — Cardiopulmonary Crisis',
      recommendations: [
        'Call emergency dispatch (911) without delay.',
        'Chew an uncoated adult aspirin (325 mg) if advised by dispatcher and not allergic or contraindicated.',
        'Cease all physical exertion and remain resting in a comfortable semi-reclined position.',
        'Unlock front door to allow emergency responders easy entry.',
      ],
      explanation: 'Thoracic tightness or pressure occurring alongside dyspnea can be indicative of acute myocardial infarction, pulmonary embolism, or acute decompensated cardiopulmonary event.',
    },
  },
  {
    id: 'rule_emergency_neurological_compromise',
    name: 'Critical: Altered Mental Status with High Fever',
    description: 'High fever combined with acute confusion, disorientation, or syncope indicates severe sepsis or encephalopathy.',
    priority: 92,
    antecedents: [
      { fact: 'high_fever', operator: 'EQUALS', value: true },
      { fact: 'confusion_dizziness', operator: 'EQUALS', value: true },
    ],
    consequent: 'emergency_febrile_encephalopathy',
    isSystem: true,
    enabled: true,
    payload: {
      severity: 'critical',
      title: 'Seek Immediate Emergency Medical Care — Altered Mental Status & Sepsis Risk',
      recommendations: [
        'Seek emergency department assessment immediately via ambulance.',
        'Keep patient safely seated or lying on their side (recovery position) to prevent falls or aspiration.',
        'Do not offer solid food or heavy oral liquids if alertness is fluctuating.',
        'Document the exact timeline of fever onset and confusion for the triage nurse.',
      ],
      explanation: 'Disorientation or delirium in the presence of severe fever suggests systemic septic shock, severe intracranial infection, or toxic metabolic crisis.',
    },
  },

  // ==========================================
  // LEVEL 3: MODERATE URGENT TRIAGE RULES (Priority 60 - 85)
  // ==========================================
  {
    id: 'rule_moderate_pneumonia_risk',
    name: 'Moderate: Lower Respiratory Involvement / Pneumonia Risk',
    description: 'Fired when the derived viral respiratory syndrome advances with dyspnea.',
    priority: 80,
    antecedents: [
      { fact: 'suspect_viral_respiratory_infection', operator: 'EQUALS', value: true },
      { fact: 'shortness_of_breath', operator: 'EQUALS', value: true },
    ],
    consequent: 'moderate_viral_pneumonia_risk',
    isSystem: true,
    enabled: true,
    payload: {
      severity: 'moderate',
      title: 'Consult Primary Care Physician / Urgent Care — Lower Respiratory Involvement',
      recommendations: [
        'Schedule an in-person medical evaluation at an Urgent Care clinic or Primary Care Physician within 12–24 hours.',
        'Check blood oxygen saturation using a pulse oximeter if accessible (target 95%–100%).',
        'Avoid strenuous physical exertion; remain in a well-ventilated resting room.',
        'Escalate immediately to Emergency Care if lips become dusky or breathing becomes gasping.',
      ],
      explanation: 'The progression of fever and cough to noticeable shortness of breath indicates potential lower airway inflammation, secondary bacterial pneumonia, or bronchitis requiring clinical auscultation and chest imaging.',
    },
  },
  {
    id: 'rule_moderate_bronchospasm',
    name: 'Moderate: Reactive Airway & Bronchospasm',
    description: 'Wheezing in combination with productive cough or dry cough indicates acute reactive bronchospasm.',
    priority: 75,
    antecedents: [
      { fact: 'wheezing', operator: 'EQUALS', value: true },
      { fact: 'dry_cough', operator: 'EQUALS', value: true },
    ],
    consequent: 'moderate_reactive_bronchospasm',
    isSystem: true,
    enabled: true,
    payload: {
      severity: 'moderate',
      title: 'Consult Primary Care Physician / Urgent Care — Bronchial Irritation',
      recommendations: [
        'Visit an Urgent Care or primary care provider for lung auscultation and possible bronchodilator prescription.',
        'Stay indoors away from environmental triggers (smoke, cold air, strong fragrances, dust).',
        'Use steam inhalation or warm shower vapor to help soothe bronchial spasm.',
        'Seek emergency assistance if wheezing transforms into silent struggle or chest retraction.',
      ],
      explanation: 'Wheezing combined with persistent cough denotes narrowed bronchial passages (bronchospasm, asthma flare, or acute asthmatic bronchitis) needing targeted pharmacological intervention.',
    },
  },
  {
    id: 'rule_moderate_systemic_viremia',
    name: 'Moderate: High-Grade Febrile Viremia / Influenza Syndrome',
    description: 'Systemic influenza derived facts paired with persistent vomiting or intense fatigue.',
    priority: 70,
    antecedents: [
      { fact: 'suspect_systemic_influenza', operator: 'EQUALS', value: true },
      { fact: 'fatigue', operator: 'EQUALS', value: true },
    ],
    consequent: 'moderate_severe_influenza_syndrome',
    isSystem: true,
    enabled: true,
    payload: {
      severity: 'moderate',
      title: 'Consult Primary Care Physician — Acute Febrile Influenza Syndrome',
      recommendations: [
        'Contact your doctor or urgent care center within 24–48 hours for clinical evaluation and antiviral consideration (e.g. oseltamivir if within window).',
        'Prioritize oral rehydration therapy with balanced electrolyte solutions or broth.',
        'Alternate antipyretics (such as acetaminophen and ibuprofen) under clinical guidance to manage fevers.',
        'Remain strictly isolated at home until fever-free for at least 24 hours without medication.',
      ],
      explanation: 'Widespread systemic symptoms with documented fever, chills, and profound fatigue correspond to significant influenza viremia, which can place vulnerable individuals at risk of dehydration or secondary bacterial infection.',
    },
  },
  {
    id: 'rule_moderate_persistent_febrile_cough',
    name: 'Moderate: Febrile Productive Cough',
    description: 'Fever accompanied by productive sputum-producing cough.',
    priority: 65,
    antecedents: [
      { fact: 'fever', operator: 'EQUALS', value: true },
      { fact: 'productive_cough', operator: 'EQUALS', value: true },
    ],
    consequent: 'moderate_bacterial_superinfection',
    isSystem: true,
    enabled: true,
    payload: {
      severity: 'moderate',
      title: 'Consult Primary Care Physician / Urgent Care — Productive Febrile Infection',
      recommendations: [
        'Consult a physician for a sputum evaluation and chest examination.',
        'Drink plenty of warm fluids (at least 2.5–3 liters daily) to thin bronchial secretions.',
        'Use an over-the-counter expectorant (guaifenesin) if approved by a pharmacist.',
        'Keep track of sputum color and note if blood-streaked phlegm appears.',
      ],
      explanation: 'The combination of fever with productive sputum indicates probable lower respiratory tract infection (such as bacterial bronchitis or early focal pneumonia) that may benefit from antibiotic or medical oversight.',
    },
  },

  // ==========================================
  // LEVEL 4: MILD SELF-CARE TRIAGE RULES (Priority 15 - 35)
  // ==========================================
  {
    id: 'rule_mild_upper_respiratory_cold',
    name: 'Mild: Common Upper Respiratory Tract Infection (Common Cold)',
    description: 'Sore throat and dry cough without fever or shortness of breath suggests a benign viral cold.',
    priority: 25,
    antecedents: [
      { fact: 'sore_throat', operator: 'EQUALS', value: true },
      { fact: 'dry_cough', operator: 'EQUALS', value: true },
      { fact: 'fever', operator: 'EQUALS', value: false },
      { fact: 'shortness_of_breath', operator: 'EQUALS', value: false },
    ],
    consequent: 'mild_rhinovirus_cold',
    isSystem: true,
    enabled: true,
    payload: {
      severity: 'mild',
      title: 'Self-Care / Home Isolation Recommended — Mild Common Cold',
      recommendations: [
        'Ensure plenty of restful sleep and physical downtime.',
        'Gargle warm salt water (1/2 tsp salt in 8 oz warm water) 3–4 times daily to soothe throat tissues.',
        'Sip warm herbal teas with honey or lemon, and maintain steady hydration.',
        'Use over-the-counter lozenges or saline nasal sprays as needed for localized symptomatic relief.',
        'Wear a mask if needing to interact with others and wash hands frequently.',
      ],
      explanation: 'Typical presentation of an uncomplicated viral upper respiratory infection (rhinovirus, mild coronavirus, or enterovirus) without alarming systemic or pulmonary red flags.',
    },
  },
  {
    id: 'rule_mild_isolated_pharyngitis',
    name: 'Mild: Isolated Sore Throat',
    description: 'Isolated pharyngeal discomfort without shortness of breath or cyanosis.',
    priority: 20,
    antecedents: [
      { fact: 'sore_throat', operator: 'EQUALS', value: true },
      { fact: 'shortness_of_breath', operator: 'EQUALS', value: false },
    ],
    consequent: 'mild_isolated_pharyngitis',
    isSystem: true,
    enabled: true,
    payload: {
      severity: 'mild',
      title: 'Self-Care / Home Isolation Recommended — Localized Pharyngitis',
      recommendations: [
        'Rest vocal cords and keep hydrated with room-temperature water.',
        'Use anesthetic throat sprays or pectin/menthol lozenges for temporary relief.',
        'Monitor for the appearance of high fever or white exudate on tonsils; seek clinic visit if difficulty swallowing liquids emerges.',
      ],
      explanation: 'Localized pharyngeal irritation without respiratory compromise is generally self-limiting within 3 to 7 days.',
    },
  },
  {
    id: 'rule_mild_sensory_viral_syndrome',
    name: 'Mild: Isolated Anosmia / Sensory Viral Prodrome',
    description: 'Sudden loss of taste or smell with fatigue but no acute shortness of breath.',
    priority: 22,
    antecedents: [
      { fact: 'loss_of_taste_smell', operator: 'EQUALS', value: true },
      { fact: 'shortness_of_breath', operator: 'EQUALS', value: false },
    ],
    consequent: 'mild_sensory_viral_syndrome',
    isSystem: true,
    enabled: true,
    payload: {
      severity: 'mild',
      title: 'Self-Care / Home Isolation Recommended — Viral Sensory Syndrome',
      recommendations: [
        'Isolate at home to prevent transmitting airborne viral particles to household members.',
        'Perform a rapid at-home antigen swab test (e.g. COVID-19 / Influenza test kit).',
        'Consume nutrient-rich foods and maintain hydration despite altered taste perception.',
        'Olfactory recovery typically proceeds over several weeks; contact physician if symptoms persist beyond 14 days.',
      ],
      explanation: 'Loss of smell or taste is a recognized marker of respiratory viral neurotropism, most commonly resolving with conservative home rest in the absence of dyspnea.',
    },
  },
  {
    id: 'rule_mild_isolated_fatigue_headache',
    name: 'Mild: Tension Headache & Fatigue',
    description: 'Headache and fatigue without high fever or neck rigidity.',
    priority: 15,
    antecedents: [
      { fact: 'fatigue', operator: 'EQUALS', value: true },
      { fact: 'severe_headache', operator: 'EQUALS', value: false },
      { fact: 'high_fever', operator: 'EQUALS', value: false },
    ],
    consequent: 'mild_fatigue_tension_syndrome',
    isSystem: true,
    enabled: true,
    payload: {
      severity: 'mild',
      title: 'Self-Care / Home Isolation Recommended — Rest & Hydration Indicated',
      recommendations: [
        'Step away from digital screens and rest in a dark, quiet room.',
        'Rehydrate with at least 500–1000 mL of cool water.',
        'Apply a cool compress over forehead or neck temples.',
        'Ensure 8 hours of uninterrupted sleep.',
      ],
      explanation: 'Mild to moderate fatigue and non-meningitic headache frequently stem from mild dehydration, viral prodrome, or tension/lack of sleep.',
    },
  },
];
