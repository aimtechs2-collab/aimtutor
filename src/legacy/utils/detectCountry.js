// utils/detectCountry.js
export const DEFAULT_COUNTRY = "in";

// Map language codes to country codes
export const LANGUAGE_TO_COUNTRY = {
  "en-in": "in",  // English (India)
  "hi-in": "in",  // Hindi (India)
  "en-us": "us",  // English (United States)
  "en-nz": "nz",  // English (New Zealand)
  "ar-ae": "ae",  // Arabic (UAE)
  "en-gb": "in",  // English (UK)
  "es-es": "es",  // Spanish (Spain)
  "fr-fr": "fr",  // French (France)

  // ✅ Base-language fallbacks
  "en": "us",
  "hi": "in",
  "ar": "ae",
  "es": "es",
  "fr": "fr",
};

export function detectCountry() {
    try {
        const langTag = navigator.language || "en-IN";
        const langLower = langTag.toLowerCase();

        // console.log("🌍 Browser Language:", langTag); // ✅ debug
        const country =
            LANGUAGE_TO_COUNTRY[langLower] ||
            LANGUAGE_TO_COUNTRY[langLower.split("-")[0]] ||
            DEFAULT_COUNTRY;

        // console.log("✅ Detected Country:", country); // ✅ debug
        return country.toLowerCase();
    } catch {
        return DEFAULT_COUNTRY;
    }
}

