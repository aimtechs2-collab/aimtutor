/**
 * i18n utility — returns the correct translations for a given country code.
 * Language is derived from country → language mapping in geoData.ts.
 */
import type { Translations } from "@/translations/en";
import en from "@/translations/en";

export type { Translations };
import { getCountryGeo } from "@/lib/geoData";

// Lazy-load translation modules to keep bundle size small
const translationModules: Record<string, () => Promise<{ default: Translations }>> = {
  en: () => Promise.resolve({ default: en }),
  ar: () => import("@/translations/ar"),
  zh: () => import("@/translations/zh"),
  ja: () => import("@/translations/ja"),
  ko: () => import("@/translations/ko"),
  es: () => import("@/translations/es"),
  fr: () => import("@/translations/fr"),
  de: () => import("@/translations/de"),
  nl: () => import("@/translations/nl"),
  pt: () => import("@/translations/pt"),
  tr: () => import("@/translations/tr"),
};

// Cache loaded translations
const cache: Record<string, Translations> = { en };

/**
 * Get the language code for a country.
 * Returns 'en' for unmapped countries or languages without translation files.
 */
export function getLanguageForCountry(countryCode: string): string {
  const geo = getCountryGeo(countryCode);
  const lang = geo.lang;
  // If we have a translation file for this language, use it; otherwise fall back to English
  return translationModules[lang] ? lang : "en";
}

/**
 * Get translations for a country code (async — for server components).
 */
export async function getTranslations(countryCode: string): Promise<Translations> {
  const lang = getLanguageForCountry(countryCode);
  if (cache[lang]) return cache[lang];

  try {
    const mod = await translationModules[lang]();
    cache[lang] = mod.default;
    return mod.default;
  } catch {
    return en;
  }
}

/**
 * Get translations synchronously (for client components — uses cache).
 * Falls back to English if the language hasn't been loaded yet.
 */
export function getTranslationsSync(countryCode: string): Translations {
  const lang = getLanguageForCountry(countryCode);
  return cache[lang] ?? en;
}

/**
 * Preload translations for a country (call this in layout to warm cache).
 */
export async function preloadTranslations(countryCode: string): Promise<void> {
  await getTranslations(countryCode);
}

/**
 * Simple template interpolation: replaces {{key}} with values.
 */
export function t(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(value));
  }
  return result;
}

/**
 * Whether a language uses right-to-left script.
 */
export function isRTL(countryCode: string): boolean {
  const lang = getLanguageForCountry(countryCode);
  return lang === "ar";
}
