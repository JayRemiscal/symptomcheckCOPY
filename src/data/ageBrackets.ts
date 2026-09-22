export interface AgeBracket {
  id: string;
  label: string;
  minAge: number;
  maxAge: number | null;
  commonConditions: string[];
}

export const AGE_BRACKETS: AgeBracket[] = [
  {
    id: 'infancy',
    label: 'Infancy',
    minAge: 0,
    maxAge: 2,
    commonConditions: [
      'Respiratory syncytial virus (RSV)',
      'Bronchiolitis',
      'Otitis media (ear infection)',
      'Viral/bacterial gastroenteritis',
      'Congenital heart defects',
      'Neonatal jaundice',
      'Eczema / atopic dermatitis',
      'Croup',
    ],
  },
  {
    id: 'childhood',
    label: 'Childhood',
    minAge: 3,
    maxAge: 12,
    commonConditions: [
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
      'ADHD',
      'Type 1 diabetes',
    ],
  },
  {
    id: 'adolescence',
    label: 'Adolescence',
    minAge: 13,
    maxAge: 19,
    commonConditions: [
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
  },
  {
    id: 'young_adult',
    label: 'Young Adults',
    minAge: 20,
    maxAge: 39,
    commonConditions: [
      'Migraine',
      'Anxiety disorder',
      'Depression',
      'Irritable bowel syndrome (IBS)',
      'Systemic lupus erythematosus',
      'Rheumatoid arthritis',
      'Polycystic ovary syndrome (PCOS)',
      'Sexually transmitted infections',
      'Early-onset hypertension',
    ],
  },
  {
    id: 'middle_aged',
    label: 'Middle-aged Adults',
    minAge: 40,
    maxAge: 59,
    commonConditions: [
      'Type 2 diabetes',
      'Hypertension',
      'Hyperlipidemia',
      'Early osteoarthritis',
      'Thyroid disorders',
      'Cardiovascular disease',
      'Breast cancer',
      'Colorectal cancer',
      'Prostate cancer',
      'Menopause-related conditions',
    ],
  },
  {
    id: 'elderly',
    label: 'Older Adults / Elderly',
    minAge: 60,
    maxAge: null,
    commonConditions: [
      'Coronary artery disease',
      'Heart failure',
      'Stroke',
      'Osteoporosis',
      'Advanced osteoarthritis',
      'Type 2 diabetes complications',
      'Chronic obstructive pulmonary disease (COPD)',
      "Alzheimer's disease",
      'Other dementias',
      "Parkinson's disease",
      'Cataracts',
      'Macular degeneration',
      'Benign prostatic hyperplasia (BPH)',
      'Hip fractures / fall-related injuries',
    ],
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
