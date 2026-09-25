export interface AgeBracket {
  id: string;
  label: string;
  minAge: number;
  maxAge: number | null;
  conditions: {
    male: string[];
    female: string[];
    both: string[];
  };
}

export const AGE_BRACKETS: AgeBracket[] = [
  {
    id: 'infancy',
    label: 'Infancy',
    minAge: 0,
    maxAge: 2,
    conditions: {
      male: [],
      female: [],
      both: [
        'Respiratory syncytial virus (RSV)',
        'Bronchiolitis',
        'Otitis media (ear infection)',
        'Viral/bacterial gastroenteritis',
        'Congenital heart defects',
        'Neonatal jaundice',
        'Eczema / atopic dermatitis',
        'Croup',
      ],
    }
  },
  {
    id: 'childhood',
    label: 'Childhood',
    minAge: 3,
    maxAge: 12,
    conditions: {
      male: ['ADHD'],
      female: ['Turner syndrome (rare)'],
      both: [
        'Common cold',
        'Influenza',
        'Strep throat',
        'Tonsillitis',
        'Chickenpox',
        'Measles',
        'Mumps',
        'Asthma',
        'Hand-foot-mouth disease',
        'Head lice',
        'Ringworm',
        'Type 1 diabetes',
      ],
    }
  },
  {
    id: 'adolescence',
    label: 'Adolescence',
    minAge: 13,
    maxAge: 19,
    conditions: {
      male: ['Testicular torsion'],
      female: ['Polycystic ovary syndrome (PCOS)', 'Endometriosis'],
      both: [
        'Acne',
        'Mononucleosis',
        'Scoliosis',
        'Anorexia nervosa',
        'Bulimia nervosa',
        'Anxiety disorder',
        'Depression',
        'Sports-related injuries',
        'Sexually transmitted infections',
      ],
    }
  },
  {
    id: 'young_adult',
    label: 'Young Adults',
    minAge: 20,
    maxAge: 39,
    conditions: {
      male: ['Testicular cancer'],
      female: ['Polycystic ovary syndrome (PCOS)', 'Cervical cancer', 'Endometriosis', 'Breast cancer'],
      both: [
        'Migraine',
        'Anxiety disorder',
        'Depression',
        'Irritable bowel syndrome (IBS)',
        'Systemic lupus erythematosus',
        'Rheumatoid arthritis',
        'Sexually transmitted infections',
        'Early-onset hypertension',
      ],
    }
  },
  {
    id: 'middle_aged',
    label: 'Middle-aged Adults',
    minAge: 40,
    maxAge: 59,
    conditions: {
      male: ['Prostate cancer', 'Benign prostatic hyperplasia (BPH)', 'Gout'],
      female: ['Menopause-related conditions', 'Breast cancer', 'Ovarian cancer'],
      both: [
        'Type 2 diabetes',
        'Hypertension',
        'Hyperlipidemia',
        'Early osteoarthritis',
        'Thyroid disorders',
        'Cardiovascular disease',
        'Colorectal cancer',
      ],
    }
  },
  {
    id: 'elderly',
    label: 'Older Adults / Elderly',
    minAge: 60,
    maxAge: null,
    conditions: {
      male: ['Prostate cancer', 'Abdominal aortic aneurysm'],
      female: ['Osteoporosis (severe)', 'Breast cancer'],
      both: [
        'Coronary artery disease',
        'Heart failure',
        'Stroke',
        'Osteoarthritis',
        'Type 2 diabetes complications',
        'Chronic obstructive pulmonary disease (COPD)',
        "Alzheimer's disease",
        'Other dementias',
        "Parkinson's disease",
        'Cataracts',
        'Macular degeneration',
        'Hip fractures / fall-related injuries',
      ],
    }
  },
];

export const AGE_BRACKET_DISCLAIMER =
  'These associations reflect general population-level epidemiological patterns and are intended for educational reference only. They are not diagnostic criteria. Any condition can occur outside its typical age range depending on genetics, lifestyle, environment, and healthcare access.';

/** Returns the matching age bracket for a given age, or null. */
export function getAgeBracket(age: number): AgeBracket | null {
  return (
    AGE_BRACKETS.find(
      (b) => age >= b.minAge && (b.maxAge === null || age <= b.maxAge)
    ) ?? null
  );
}

export function getConditionsForProfile(age: number, gender: string): string[] {
  const bracket = getAgeBracket(age);
  if (!bracket) return [];
  const g = gender.toLowerCase();
  if (g === 'male') {
    return [...bracket.conditions.both, ...bracket.conditions.male];
  } else if (g === 'female') {
    return [...bracket.conditions.both, ...bracket.conditions.female];
  }
  return [...bracket.conditions.both, ...bracket.conditions.male, ...bracket.conditions.female];
}
