export type SupportedLanguage = 'en' | 'ceb' | 'tl' | 'es';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ceb', name: 'Cebuano', nativeName: 'Bisaya', flag: '🇵🇭' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Filipino', flag: '🇵🇭' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Brand & Header
    brandName: 'SymptomCheck',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    administrator: 'Administrator',
    guest: 'Guest',
    language: 'Language',
    selectLanguage: 'Select Language',

    // Hero / Landing
    heroTitle: 'Understand your symptoms with clarity, not guesswork.',
    heroSub: 'A transparent symptom assessment experience that demonstrates how a separate medical rule engine can explain its simulated guidance.',
    startAssessment: 'Start Symptom Assessment',
    step1Title: '1. Select symptoms',
    step1Desc: 'Choose from clear, categorized options in a touch-friendly assessment.',
    step2Title: '2. Review selections',
    step2Desc: 'Confirm selected symptoms before viewing a simulated triage outcome.',
    step3Title: '3. See the reasoning',
    step3Desc: 'Explore simulated facts, triggered rules, and an auditable explanation trail.',

    // Login / Sign In
    loginTitle: 'Sign In / Register',
    updateProfileTitle: 'Update Profile',
    loginSub: 'Please enter your patient information to personalize your symptom assessment records.',
    fullNameLabel: 'Full Name',
    ageLabel: 'Age',
    mobileLabel: 'Registered Mobile Number',
    addressLabel: 'Address',
    adminToggle: 'Sign in with Administrator Privileges',
    adminPasscode: 'Admin Passcode',
    cancel: 'Cancel',
    signInContinue: 'Sign In & Continue',
    signInAdmin: 'Sign In as Admin',
    continueAsGuest: 'Guest',

    // Assessment
    assessmentTitle: 'Symptom Assessment',
    assessmentSub: 'Select all active symptoms you are currently experiencing.',
    evaluateSymptoms: 'Evaluate Symptoms',
    clearAll: 'Clear All',
    presets: 'Quick Presets',
    emergencyNotice: 'If you are experiencing severe emergency symptoms (such as chest pain or severe difficulty breathing), call emergency services (911) immediately.',

    // Triage & Results
    triageDirectives: 'Clinical Care Directives',
    rationale: 'Clinical Assessment Rationale:',
    whyOutcome: 'Clinical Logic Explanation',
    newAssessment: 'New Assessment',
    exportReport: 'Export Report',
    emergencyCall: 'Call Emergency (911)',
  },

  ceb: {
    // Brand & Header
    brandName: 'SymptomCheck',
    signIn: 'Mo-log in',
    signOut: 'Mo-log out',
    administrator: 'Administrador',
    guest: 'Bisita',
    language: 'Pinulongan',
    selectLanguage: 'Pili og Pinulongan',

    // Hero / Landing
    heroTitle: 'Sabta ang imong mga simtoma uban sa katin-aw, dili pagtantiya.',
    heroSub: 'Usa ka klaro nga kasinatian sa pag-asess sa simtoma nga nagpakita kon unsaon pagpasabut sa separado nga medical rule engine ang simulated nga giya.',
    startAssessment: 'Sugdi ang Pag-asess sa Simtoma',
    step1Title: '1. Pili og simtoma',
    step1Desc: 'Pili gikan sa klaro ug organisado nga mga kapilian.',
    step2Title: '2. Rebyuha ang gipili',
    step2Desc: 'Kumpirmaha ang napili nga mga simtoma sa wala pa tan-awon ang resulta.',
    step3Title: '3. Tan-awa ang rason',
    step3Desc: 'Susihan ang nakolekta nga facts ug mga lagda nga nagpaandar sa giya.',

    // Login / Sign In
    loginTitle: 'Mo-log in / Magrehistro',
    updateProfileTitle: 'Bag-oha ang Profile',
    loginSub: 'Palihug isulod ang imong impormasyon aron mapribado ang imong rekord.',
    fullNameLabel: 'Kompormeng Pangalan',
    ageLabel: 'Pangidaron (Edad)',
    mobileLabel: 'Rehistradong Numero sa Telepono',
    addressLabel: 'Kompormeng Adres',
    adminToggle: 'Mo-log in isip Administrador',
    adminPasscode: 'Passcode sa Admin',
    cancel: 'Kanselahon',
    signInContinue: 'Mo-log in ug Magpadayon',
    signInAdmin: 'Mo-log in isip Admin',
    continueAsGuest: 'Bisita',

    // Assessment
    assessmentTitle: 'Pag-asess sa Simtoma',
    assessmentSub: 'Pilia ang tanang simtoma nga imong nabati karon.',
    evaluateSymptoms: 'Pagsusi sa Simtoma',
    clearAll: 'Hawanon Tanan',
    presets: 'Dali nga Presets',
    emergencyNotice: 'Kon nakasinati ka og grabeng emerhensya (sama sa sakit sa dughan o maglisod sa pagginhawa), tawag dayon sa 911.',

    // Triage & Results
    triageDirectives: 'Giya sa Pag-atiman sa Panglawas',
    rationale: 'Rason sa Pag-asess sa Klinikal:',
    whyOutcome: 'Eskplikasyon sa Klinikal nga Logika',
    newAssessment: 'Bag-ong Pag-asess',
    exportReport: 'I-export ang Report',
    emergencyCall: 'Tawag sa Emerhensya (911)',
  },

  tl: {
    // Brand & Header
    brandName: 'SymptomCheck',
    signIn: 'Mag-sign In',
    signOut: 'Mag-sign Out',
    administrator: 'Tagapamahala',
    guest: 'Bisita',
    language: 'Wika',
    selectLanguage: 'Pumili ng Wika',

    // Hero / Landing
    heroTitle: 'Unawain ang iyong mga sintomas nang may linaw, hindi hula-hula.',
    heroSub: 'Isang malinaw na karanasan sa pagtatasa ng sintomas na nagpapakita kung paano maipapaliwanag ng medical rule engine ang gabay nito.',
    startAssessment: 'Simulan ang Pagtatasa ng Sintomas',
    step1Title: '1. Pumili ng sintomas',
    step1Desc: 'Pumili mula sa malinaw at organisadong mga opsyon.',
    step2Title: '2. Suriin ang pinili',
    step2Desc: 'Kumpirmahin ang mga napiling sintomas bago tingnan ang resulta.',
    step3Title: '3. Tingnan ang dahilan',
    step3Desc: 'Tuklasin ang mga patakaran at lohika na nagbigay ng rekomendasyon.',

    // Login / Sign In
    loginTitle: 'Mag-sign In / Magrehistro',
    updateProfileTitle: 'I-update ang Profile',
    loginSub: 'Mangyaring ilagay ang iyong impormasyon upang mai-personalize ang iyong rekor.',
    fullNameLabel: 'Buong Pangalan',
    ageLabel: 'Edad',
    mobileLabel: 'Rehistradong Numero ng Telepono',
    addressLabel: 'Tirahan',
    adminToggle: 'Mag-sign in bilang Tagapamahala (Admin)',
    adminPasscode: 'Passcode ng Admin',
    cancel: 'Kanselahin',
    signInContinue: 'Mag-sign In at Magpatuloy',
    signInAdmin: 'Mag-sign In bilang Admin',
    continueAsGuest: 'Bisita',

    // Assessment
    assessmentTitle: 'Pagtatasa ng Sintomas',
    assessmentSub: 'Piliin ang lahat ng sintomas na nararanasan mo ngayon.',
    evaluateSymptoms: 'Suriin ang mga Sintomas',
    clearAll: 'Alisin Lahat',
    presets: 'Mabilis na Presets',
    emergencyNotice: 'Kung nakararanas ka ng malalang emerhensya (tulad ng sakit sa dibdib o hirap sa paghinga), tumawag agad sa 911.',

    // Triage & Results
    triageDirectives: 'Mga Direktiba sa Pangangalaga',
    rationale: 'Dahilan ng Pagtatasa:',
    whyOutcome: 'Paliwanag ng Lohika ng Klinikal',
    newAssessment: 'Bagong Pagtatasa',
    exportReport: 'I-export ang Report',
    emergencyCall: 'Tumawag sa Emergency (911)',
  },

  es: {
    // Brand & Header
    brandName: 'SymptomCheck',
    signIn: 'Iniciar Sesión',
    signOut: 'Cerrar Sesión',
    administrator: 'Administrador',
    guest: 'Invitado',
    language: 'Idioma',
    selectLanguage: 'Seleccionar Idioma',

    // Hero / Landing
    heroTitle: 'Comprenda sus síntomas con claridad, sin suposiciones.',
    heroSub: 'Una experiencia transparente de evaluación de síntomas que demuestra cómo un motor de reglas médicas explica sus recomendaciones.',
    startAssessment: 'Iniciar Evaluación de Síntomas',
    step1Title: '1. Seleccione síntomas',
    step1Desc: 'Elija entre opciones claras y categorizadas.',
    step2Title: '2. Revise su selección',
    step2Desc: 'Confirme los síntomas seleccionados antes de ver el resultado.',
    step3Title: '3. Vea el razonamiento',
    step3Desc: 'Explore los hechos simulados y las reglas aplicadas.',

    // Login / Sign In
    loginTitle: 'Iniciar Sesión / Registro',
    updateProfileTitle: 'Actualizar Perfil',
    loginSub: 'Ingrese su información de paciente para personalizar sus registros.',
    fullNameLabel: 'Nombre Completo',
    ageLabel: 'Edad',
    mobileLabel: 'Número de Teléfono Registrado',
    addressLabel: 'Dirección',
    adminToggle: 'Iniciar sesión como Administrador',
    adminPasscode: 'Código de Administrador',
    cancel: 'Cancelar',
    signInContinue: 'Iniciar Sesión y Continuar',
    signInAdmin: 'Iniciar Sesión como Admin',
    continueAsGuest: 'Invitado',

    // Assessment
    assessmentTitle: 'Evaluación de Síntomas',
    assessmentSub: 'Seleccione todos los síntomas activos que experimenta actualmente.',
    evaluateSymptoms: 'Evaluar Síntomas',
    clearAll: 'Borrar Todo',
    presets: 'Ajustes Rápidos',
    emergencyNotice: 'Si experimenta síntomas graves de emergencia (como dolor en el pecho o dificultad respiratoria), llame inmediatamente al 911.',

    // Triage & Results
    triageDirectives: 'Directivas de Atención Clínica',
    rationale: 'Justificación de la Evaluación:',
    whyOutcome: 'Explicación de Lógica Clínica',
    newAssessment: 'Nueva Evaluación',
    exportReport: 'Exportar Informe',
    emergencyCall: 'Llamar a Emergencias (911)',
  },
};
