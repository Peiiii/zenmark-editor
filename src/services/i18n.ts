import enUS from "./enUS.json";
import zhCN from "./zhCN.json";

type LanguageTag = string; // BCP 47语言标签
type Translations = { [key: string]: string };

export enum LanguageTagEnum {
  en = "en",
  fr = "fr",
  es = "es",
  "zh-CN" = "zh-CN",
  "en-US" = "en-US",
  "en-GB" = "en-GB",
  "fr-CA" = "fr-CA",
  "de-DE" = "de-DE",
  "ja-JP" = "ja-JP",
  "ko-KR" = "ko-KR",
  "pt-BR" = "pt-BR",
  "ar-SA" = "ar-SA",
}

class I18n {
  private currentLanguage: LanguageTag;
  private translations: { [lang in LanguageTag]?: Translations };

  constructor(defaultLanguage: LanguageTag) {
    this.currentLanguage = defaultLanguage;
    this.translations = {};
  }

  addTranslations(language: LanguageTag, translations: Translations) {
    this.translations[language] = translations;
  }

  setLanguage(language: LanguageTag) {
    if (this.translations[language]) {
      this.currentLanguage = language;
    } else {
      console.warn(
        `Translations for ${language} not found. Falling back to default.`
      );
    }
  }

  get({ key, defaultValue }: { key: string; defaultValue?: string }): string {
    const translation = this.translations[this.currentLanguage] || {};
    if (key in translation) {
      return translation[key];
    } else if (defaultValue !== undefined) {
      return defaultValue;
    } else {
      throw new Error(
        `Translation for key "${key}" not found in language "${this.currentLanguage}".`
      );
    }
  }
}

export const i18n = new I18n(LanguageTagEnum["zh-CN"]);

i18n.addTranslations(LanguageTagEnum["en-US"], enUS);
i18n.addTranslations(LanguageTagEnum["zh-CN"], zhCN);
