import { SupportedLanguage, TRANSLATIONS, LANGUAGE_OPTIONS, LanguageOption } from '../data/translations';

const STORAGE_KEY_LANGUAGE = 'symptomcheck_language_v1';

export class LanguageService {
  public static getLanguage(): SupportedLanguage {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANGUAGE);
      if (saved && (saved === 'en' || saved === 'ceb' || saved === 'tl' || saved === 'es')) {
        return saved as SupportedLanguage;
      }
      return 'en';
    } catch {
      return 'en';
    }
  }

  public static setLanguage(lang: SupportedLanguage): void {
    try {
      localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
    } catch (e) {
      console.error('Failed to set language', e);
    }
  }

  public static t(key: string, lang?: SupportedLanguage): string {
    const currentLang = lang || this.getLanguage();
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  public static getOptions(): LanguageOption[] {
    return LANGUAGE_OPTIONS;
  }
}
