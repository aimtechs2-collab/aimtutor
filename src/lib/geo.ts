export const DEFAULT_COUNTRY = "in";
export const DEFAULT_REGION = "ts";
export const DEFAULT_CITY = "hyderabad";

export type Geo = {
  country: string;
  region: string;
  city: string;
};

// Kept intentionally similar to old Frontend/src/utils/detectCountry.js
const LANGUAGE_TO_COUNTRY: Record<string, string> = {
  "en-in": "in",
  "hi-in": "in",
  "en-us": "us",
  "en-nz": "nz",
  "ar-ae": "ae",
  "en-gb": "in",
  "es-es": "es",
  "fr-fr": "fr",
  en: "us",
  hi: "in",
  ar: "ae",
  es: "es",
  fr: "fr",
};

export function detectCountryFromBrowserLanguage(): string {
  try {
    const langTag = (navigator.language || "en-IN").toLowerCase();
    return (
      LANGUAGE_TO_COUNTRY[langTag] ||
      LANGUAGE_TO_COUNTRY[langTag.split("-")[0]] ||
      DEFAULT_COUNTRY
    );
  } catch {
    return DEFAULT_COUNTRY;
  }
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-");
}

export function getStoredGeo(): Geo {
  if (typeof window === "undefined") {
    return { country: DEFAULT_COUNTRY, region: DEFAULT_REGION, city: DEFAULT_CITY };
  }
  const country = (localStorage.getItem("user_country") || DEFAULT_COUNTRY).toLowerCase();
  const region = (localStorage.getItem("user_region") || DEFAULT_REGION).toLowerCase();
  const city = (localStorage.getItem("user_city") || DEFAULT_CITY).toLowerCase();
  return { country, region, city };
}

export function setStoredGeo(geo: Geo) {
  if (typeof window === "undefined") return;
  localStorage.setItem("user_country", geo.country.toLowerCase());
  localStorage.setItem("user_region", geo.region.toLowerCase());
  localStorage.setItem("user_city", slugify(geo.city));
}
