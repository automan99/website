export const LOCALES = ['en', 'zh', 'hi', 'es', 'ru', 'de', 'fr', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

// Only these locales are built and offered in the language switcher.
// Add a locale here after its dictionary and content files exist.
export const ENABLED_LOCALES: readonly Locale[] = ['en', 'zh'];

export type LocaleMeta = {
  nativeName: string;
  htmlLang: string;
  ogLocale: string;
  pathPrefix: string;
};

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { nativeName: 'English', htmlLang: 'en', ogLocale: 'en_US', pathPrefix: '' },
  zh: { nativeName: '简体中文', htmlLang: 'zh-CN', ogLocale: 'zh_CN', pathPrefix: '/zh' },
  hi: { nativeName: 'हिन्दी', htmlLang: 'hi', ogLocale: 'hi_IN', pathPrefix: '/hi' },
  es: { nativeName: 'Español', htmlLang: 'es', ogLocale: 'es_ES', pathPrefix: '/es' },
  ru: { nativeName: 'Русский', htmlLang: 'ru', ogLocale: 'ru_RU', pathPrefix: '/ru' },
  de: { nativeName: 'Deutsch', htmlLang: 'de', ogLocale: 'de_DE', pathPrefix: '/de' },
  fr: { nativeName: 'Français', htmlLang: 'fr', ogLocale: 'fr_FR', pathPrefix: '/fr' },
  pt: { nativeName: 'Português', htmlLang: 'pt', ogLocale: 'pt_PT', pathPrefix: '/pt' }
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
