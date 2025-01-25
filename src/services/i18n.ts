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
  private readonly LANGUAGE_KEY = "app_language";
  private currentLanguage: LanguageTag;
  private translations: { [lang in LanguageTag]?: Translations };
  private enableCache: boolean;

  constructor(defaultLanguage: LanguageTag, enableCache: boolean = true) {
    this.currentLanguage = defaultLanguage;
    this.translations = {};
    this.enableCache = enableCache;

    if (typeof window !== "undefined") {
      this.initializeLanguage();
    }
  }

  // 初始化语言设置
  initializeLanguage(): void {
    const savedLanguage = this.getSavedLanguage();
    if (savedLanguage) {
      this.setLanguage(savedLanguage);
    } else {
      this.detectAndSetLanguage();
    }
  }

  // 获取保存的语言设置
  private getSavedLanguage(): LanguageTag | null {
    if (!this.enableCache) {
      return null;
    }
    const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY);
    return savedLanguage && this.translations[savedLanguage]
      ? savedLanguage
      : null;
  }

  // 保存语言设置
  private saveLanguage(language: LanguageTag): void {
    if (this.enableCache && typeof window !== "undefined") {
      localStorage.setItem(this.LANGUAGE_KEY, language);
    }
  }

  // 设置是否启用缓存
  public setEnableCache(enable: boolean): void {
    this.enableCache = enable;
    if (!enable && typeof window !== "undefined") {
      localStorage.removeItem(this.LANGUAGE_KEY);
    }
  }

  // 检测并设置语言
  private detectAndSetLanguage(): void {
    const browserLang = this.detectBrowserLanguage();
    if (browserLang) {
      this.setLanguage(browserLang);
    }
  }

  // 检测浏览器语言
  private detectBrowserLanguage(): LanguageTag | null {
    const browserLang = navigator.language;
    const supportedLanguages = Object.values(LanguageTagEnum);

    // 尝试完全匹配
    if (supportedLanguages.includes(browserLang as LanguageTagEnum)) {
      return browserLang;
    }

    // 尝试匹配语言的主要部分
    const primaryLang = browserLang.split("-")[0];
    const matchingLang = supportedLanguages.find((lang) =>
      lang.startsWith(primaryLang)
    );

    return matchingLang || null;
  }

  addTranslations(language: LanguageTag, translations: Translations) {
    this.translations[language] = translations;
  }

  setLanguage(language: LanguageTag) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      this.saveLanguage(language);
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

// 使用示例：不缓存语言设置
export const i18n = new I18n(LanguageTagEnum["zh-CN"], false);
// export const i18n = new I18n(LanguageTagEnum["en-US"], false);

i18n.addTranslations(LanguageTagEnum["en-US"], enUS);
i18n.addTranslations(LanguageTagEnum["zh-CN"], zhCN);
i18n.initializeLanguage();
