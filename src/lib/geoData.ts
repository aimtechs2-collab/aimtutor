/**
 * Geo data lookup — maps country codes to coordinates, locale, OpenGraph locale,
 * and default region/city for SEO purposes.
 *
 * Used by: generateMetadata, sitemap.ts, generateStaticParams.
 */

export type CountryGeoData = {
  /** ISO 3166-1 alpha-2 country code */
  code: string;
  name: string;
  /** Default latitude,longitude for the country (capital city) */
  lat: string;
  lng: string;
  /** BCP-47 language tag for <html lang> */
  lang: string;
  /** OpenGraph locale string */
  ogLocale: string;
  /** Default region code used in URL */
  defaultRegion: string;
  /** Default city slug used in URL */
  defaultCity: string;
};

// Comprehensive lookup for all countries in city-urls.json
const COUNTRY_GEO: Record<string, CountryGeoData> = {
  // ---- Europe ----
  at: { code: "at", name: "Austria",        lat: "48.2082", lng: "16.3738", lang: "de",    ogLocale: "de_AT", defaultRegion: "vie", defaultCity: "vienna" },
  ch: { code: "ch", name: "Switzerland",    lat: "47.3769", lng: "8.5417",  lang: "de",    ogLocale: "de_CH", defaultRegion: "zh",  defaultCity: "zurich" },
  de: { code: "de", name: "Germany",        lat: "52.5200", lng: "13.4050", lang: "de",    ogLocale: "de_DE", defaultRegion: "by",  defaultCity: "berlin" },
  cz: { code: "cz", name: "Czech Republic", lat: "50.0755", lng: "14.4378", lang: "cs",    ogLocale: "cs_CZ", defaultRegion: "pr",  defaultCity: "prague" },
  dk: { code: "dk", name: "Denmark",        lat: "55.6761", lng: "12.5683", lang: "da",    ogLocale: "da_DK", defaultRegion: "84",  defaultCity: "copenhagen" },
  ee: { code: "ee", name: "Estonia",        lat: "59.4370", lng: "24.7536", lang: "et",    ogLocale: "et_EE", defaultRegion: "37",  defaultCity: "tallinn" },
  fi: { code: "fi", name: "Finland",        lat: "60.1699", lng: "24.9384", lang: "fi",    ogLocale: "fi_FI", defaultRegion: "18",  defaultCity: "helsinki" },
  gr: { code: "gr", name: "Greece",         lat: "37.9838", lng: "23.7275", lang: "el",    ogLocale: "el_GR", defaultRegion: "a1",  defaultCity: "athens" },
  hu: { code: "hu", name: "Hungary",        lat: "47.4979", lng: "19.0402", lang: "hu",    ogLocale: "hu_HU", defaultRegion: "bu",  defaultCity: "budapest" },
  ie: { code: "ie", name: "Ireland",        lat: "53.3498", lng: "-6.2603", lang: "en",    ogLocale: "en_IE", defaultRegion: "d",   defaultCity: "dublin" },
  lu: { code: "lu", name: "Luxembourg",     lat: "49.6117", lng: "6.1319",  lang: "fr",    ogLocale: "fr_LU", defaultRegion: "lx",  defaultCity: "luxembourg-city" },
  lv: { code: "lv", name: "Latvia",         lat: "56.9496", lng: "24.1052", lang: "lv",    ogLocale: "lv_LV", defaultRegion: "ri",  defaultCity: "riga" },
  es: { code: "es", name: "Spain",          lat: "40.4168", lng: "-3.7038", lang: "es",    ogLocale: "es_ES", defaultRegion: "md",  defaultCity: "madrid" },
  it: { code: "it", name: "Italy",          lat: "41.9028", lng: "12.4964", lang: "it",    ogLocale: "it_IT", defaultRegion: "la",  defaultCity: "rome" },
  lt: { code: "lt", name: "Lithuania",      lat: "54.6872", lng: "25.2797", lang: "lt",    ogLocale: "lt_LT", defaultRegion: "vl",  defaultCity: "vilnius" },
  nl: { code: "nl", name: "Netherlands",    lat: "52.3676", lng: "4.9041",  lang: "nl",    ogLocale: "nl_NL", defaultRegion: "nh",  defaultCity: "amsterdam" },
  no: { code: "no", name: "Norway",         lat: "59.9139", lng: "10.7522", lang: "no",    ogLocale: "nb_NO", defaultRegion: "03",  defaultCity: "oslo" },
  pt: { code: "pt", name: "Portugal",       lat: "38.7223", lng: "-9.1393", lang: "pt",    ogLocale: "pt_PT", defaultRegion: "lx",  defaultCity: "lisbon" },
  ro: { code: "ro", name: "Romania",        lat: "44.4268", lng: "26.1025", lang: "ro",    ogLocale: "ro_RO", defaultRegion: "b",   defaultCity: "bucharest" },
  se: { code: "se", name: "Sweden",         lat: "59.3293", lng: "18.0686", lang: "sv",    ogLocale: "sv_SE", defaultRegion: "ab",  defaultCity: "stockholm" },
  tr: { code: "tr", name: "Turkey",         lat: "41.0082", lng: "28.9784", lang: "tr",    ogLocale: "tr_TR", defaultRegion: "34",  defaultCity: "istanbul" },
  mt: { code: "mt", name: "Malta",          lat: "35.8989", lng: "14.5146", lang: "en",    ogLocale: "en_MT", defaultRegion: "ma",  defaultCity: "valletta" },
  be: { code: "be", name: "Belgium",        lat: "50.8503", lng: "4.3517",  lang: "nl",    ogLocale: "nl_BE", defaultRegion: "bru", defaultCity: "brussels" },
  fr: { code: "fr", name: "France",         lat: "48.8566", lng: "2.3522",  lang: "fr",    ogLocale: "fr_FR", defaultRegion: "idf", defaultCity: "paris" },
  pl: { code: "pl", name: "Poland",         lat: "52.2297", lng: "21.0122", lang: "pl",    ogLocale: "pl_PL", defaultRegion: "mz",  defaultCity: "warsaw" },
  gb: { code: "gb", name: "United Kingdom", lat: "51.5074", lng: "-0.1278", lang: "en",    ogLocale: "en_GB", defaultRegion: "ldn", defaultCity: "london" },
  bg: { code: "bg", name: "Bulgaria",       lat: "42.6977", lng: "23.3219", lang: "bg",    ogLocale: "bg_BG", defaultRegion: "22",  defaultCity: "sofia" },
  md: { code: "md", name: "Moldova",        lat: "47.0105", lng: "28.8638", lang: "ro",    ogLocale: "ro_MD", defaultRegion: "chi", defaultCity: "chisinau" },
  sk: { code: "sk", name: "Slovakia",       lat: "48.1486", lng: "17.1077", lang: "sk",    ogLocale: "sk_SK", defaultRegion: "bl",  defaultCity: "bratislava" },
  si: { code: "si", name: "Slovenia",       lat: "46.0569", lng: "14.5058", lang: "sl",    ogLocale: "sl_SI", defaultRegion: "lj",  defaultCity: "ljubljana" },
  hr: { code: "hr", name: "Croatia",        lat: "45.8150", lng: "15.9819", lang: "hr",    ogLocale: "hr_HR", defaultRegion: "zg",  defaultCity: "zagreb" },
  rs: { code: "rs", name: "Serbia",         lat: "44.7866", lng: "20.4489", lang: "sr",    ogLocale: "sr_RS", defaultRegion: "bg",  defaultCity: "belgrade" },

  // ---- Asia ----
  in: { code: "in", name: "India",          lat: "17.3850", lng: "78.4867", lang: "en",    ogLocale: "en_IN", defaultRegion: "ts",  defaultCity: "hyderabad" },
  cn: { code: "cn", name: "China",          lat: "39.9042", lng: "116.4074", lang: "zh",   ogLocale: "zh_CN", defaultRegion: "bj",  defaultCity: "beijing" },
  hk: { code: "hk", name: "Hong Kong",      lat: "22.3193", lng: "114.1694", lang: "zh",   ogLocale: "zh_HK", defaultRegion: "hk",  defaultCity: "central" },
  mo: { code: "mo", name: "Macao",          lat: "22.1987", lng: "113.5439", lang: "zh",   ogLocale: "zh_MO", defaultRegion: "mo",  defaultCity: "macao" },
  tw: { code: "tw", name: "Taiwan",         lat: "25.0330", lng: "121.5654", lang: "zh",   ogLocale: "zh_TW", defaultRegion: "tp",  defaultCity: "taipei" },
  jp: { code: "jp", name: "Japan",          lat: "35.6762", lng: "139.6503", lang: "ja",   ogLocale: "ja_JP", defaultRegion: "13",  defaultCity: "tokyo" },
  kr: { code: "kr", name: "South Korea",    lat: "37.5665", lng: "126.9780", lang: "ko",   ogLocale: "ko_KR", defaultRegion: "11",  defaultCity: "seoul" },
  pk: { code: "pk", name: "Pakistan",       lat: "24.8607", lng: "67.0011", lang: "ur",    ogLocale: "ur_PK", defaultRegion: "sd",  defaultCity: "karachi" },
  lk: { code: "lk", name: "Sri Lanka",      lat: "6.9271",  lng: "79.8612", lang: "si",    ogLocale: "si_LK", defaultRegion: "we",  defaultCity: "colombo" },
  id: { code: "id", name: "Indonesia",      lat: "-6.2088", lng: "106.8456", lang: "id",   ogLocale: "id_ID", defaultRegion: "jk",  defaultCity: "jakarta" },
  kz: { code: "kz", name: "Kazakhstan",     lat: "43.2220", lng: "76.8512", lang: "kk",    ogLocale: "kk_KZ", defaultRegion: "alm", defaultCity: "almaty" },
  bt: { code: "bt", name: "Bhutan",         lat: "27.4728", lng: "89.6390", lang: "dz",    ogLocale: "dz_BT", defaultRegion: "ty",  defaultCity: "thimphu" },
  np: { code: "np", name: "Nepal",          lat: "27.7172", lng: "85.3240", lang: "ne",    ogLocale: "ne_NP", defaultRegion: "ba",  defaultCity: "kathmandu" },
  uz: { code: "uz", name: "Uzbekistan",     lat: "41.2995", lng: "69.2401", lang: "uz",    ogLocale: "uz_UZ", defaultRegion: "tk",  defaultCity: "tashkent" },

  // ---- Oceania ----
  au: { code: "au", name: "Australia",      lat: "-33.8688", lng: "151.2093", lang: "en",  ogLocale: "en_AU", defaultRegion: "nsw", defaultCity: "sydney" },
  nz: { code: "nz", name: "New Zealand",    lat: "-36.8485", lng: "174.7633", lang: "en",  ogLocale: "en_NZ", defaultRegion: "auk", defaultCity: "auckland" },

  // ---- Southeast Asia ----
  my: { code: "my", name: "Malaysia",       lat: "3.1390",  lng: "101.6869", lang: "ms",   ogLocale: "ms_MY", defaultRegion: "kl",  defaultCity: "kuala-lumpur" },
  ph: { code: "ph", name: "Philippines",    lat: "14.5995", lng: "120.9842", lang: "en",   ogLocale: "en_PH", defaultRegion: "ncr", defaultCity: "manila" },
  sg: { code: "sg", name: "Singapore",      lat: "1.3521",  lng: "103.8198", lang: "en",   ogLocale: "en_SG", defaultRegion: "sg",  defaultCity: "singapore" },
  th: { code: "th", name: "Thailand",       lat: "13.7563", lng: "100.5018", lang: "th",   ogLocale: "th_TH", defaultRegion: "10",  defaultCity: "bangkok" },
  vn: { code: "vn", name: "Vietnam",        lat: "21.0278", lng: "105.8342", lang: "vi",   ogLocale: "vi_VN", defaultRegion: "sg",  defaultCity: "hanoi" },

  // ---- Americas ----
  ca: { code: "ca", name: "Canada",         lat: "43.6532", lng: "-79.3832", lang: "en",   ogLocale: "en_CA", defaultRegion: "on",  defaultCity: "toronto" },
  us: { code: "us", name: "United States",  lat: "37.7749", lng: "-122.4194", lang: "en",  ogLocale: "en_US", defaultRegion: "ca",  defaultCity: "california" },
  cr: { code: "cr", name: "Costa Rica",     lat: "9.9281",  lng: "-84.0907", lang: "es",   ogLocale: "es_CR", defaultRegion: "sj",  defaultCity: "san-jose" },
  gt: { code: "gt", name: "Guatemala",      lat: "14.6349", lng: "-90.5069", lang: "es",   ogLocale: "es_GT", defaultRegion: "gu",  defaultCity: "guatemala-city" },
  mx: { code: "mx", name: "Mexico",         lat: "19.4326", lng: "-99.1332", lang: "es",   ogLocale: "es_MX", defaultRegion: "cmx", defaultCity: "mexico-city" },
  pa: { code: "pa", name: "Panama",         lat: "8.9824",  lng: "-79.5199", lang: "es",   ogLocale: "es_PA", defaultRegion: "pa",  defaultCity: "panama-city" },
  br: { code: "br", name: "Brazil",         lat: "-23.5505", lng: "-46.6333", lang: "pt",  ogLocale: "pt_BR", defaultRegion: "sp",  defaultCity: "sao-paulo" },
  ar: { code: "ar", name: "Argentina",      lat: "-34.6037", lng: "-58.3816", lang: "es",  ogLocale: "es_AR", defaultRegion: "c",   defaultCity: "buenos-aires" },
  cl: { code: "cl", name: "Chile",          lat: "-33.4489", lng: "-70.6693", lang: "es",  ogLocale: "es_CL", defaultRegion: "rm",  defaultCity: "santiago" },
  ec: { code: "ec", name: "Ecuador",        lat: "-0.1807",  lng: "-78.4678", lang: "es",  ogLocale: "es_EC", defaultRegion: "p",   defaultCity: "quito" },
  co: { code: "co", name: "Colombia",       lat: "4.7110",  lng: "-74.0721", lang: "es",   ogLocale: "es_CO", defaultRegion: "dc",  defaultCity: "bogota" },
  pe: { code: "pe", name: "Peru",           lat: "-12.0464", lng: "-77.0428", lang: "es",  ogLocale: "es_PE", defaultRegion: "li",  defaultCity: "lima" },
  uy: { code: "uy", name: "Uruguay",        lat: "-34.9011", lng: "-56.1645", lang: "es",  ogLocale: "es_UY", defaultRegion: "mo",  defaultCity: "montevideo" },
  ve: { code: "ve", name: "Venezuela",      lat: "10.4806", lng: "-66.9036", lang: "es",   ogLocale: "es_VE", defaultRegion: "dc",  defaultCity: "caracas" },
  bo: { code: "bo", name: "Bolivia",        lat: "-16.4897", lng: "-68.1193", lang: "es",  ogLocale: "es_BO", defaultRegion: "lp",  defaultCity: "la-paz" },

  // ---- Middle East & Africa ----
  ae: { code: "ae", name: "UAE",            lat: "25.2048", lng: "55.2708",  lang: "ar",   ogLocale: "ar_AE", defaultRegion: "du",  defaultCity: "dubai" },
  qa: { code: "qa", name: "Qatar",          lat: "25.2854", lng: "51.5310",  lang: "ar",   ogLocale: "ar_QA", defaultRegion: "da",  defaultCity: "doha" },
  eg: { code: "eg", name: "Egypt",          lat: "30.0444", lng: "31.2357",  lang: "ar",   ogLocale: "ar_EG", defaultRegion: "c",   defaultCity: "cairo" },
  sa: { code: "sa", name: "Saudi Arabia",   lat: "24.7136", lng: "46.6753",  lang: "ar",   ogLocale: "ar_SA", defaultRegion: "01",  defaultCity: "riyadh" },
  za: { code: "za", name: "South Africa",   lat: "-26.2041", lng: "28.0473", lang: "en",   ogLocale: "en_ZA", defaultRegion: "gt",  defaultCity: "johannesburg" },
  ma: { code: "ma", name: "Morocco",        lat: "33.5731", lng: "-7.5898",  lang: "ar",   ogLocale: "ar_MA", defaultRegion: "cas", defaultCity: "casablanca" },
  tn: { code: "tn", name: "Tunisia",        lat: "36.8065", lng: "10.1815",  lang: "ar",   ogLocale: "ar_TN", defaultRegion: "tn",  defaultCity: "tunis" },
  kw: { code: "kw", name: "Kuwait",         lat: "29.3759", lng: "47.9774",  lang: "ar",   ogLocale: "ar_KW", defaultRegion: "kw",  defaultCity: "kuwait-city" },
  om: { code: "om", name: "Oman",           lat: "23.5880", lng: "58.3829",  lang: "ar",   ogLocale: "ar_OM", defaultRegion: "mu",  defaultCity: "muscat" },
  ke: { code: "ke", name: "Kenya",          lat: "-1.2921", lng: "36.8219",  lang: "en",   ogLocale: "en_KE", defaultRegion: "na",  defaultCity: "nairobi" },
  ng: { code: "ng", name: "Nigeria",        lat: "6.5244",  lng: "3.3792",   lang: "en",   ogLocale: "en_NG", defaultRegion: "la",  defaultCity: "lagos" },
  bw: { code: "bw", name: "Botswana",       lat: "-24.6282", lng: "25.9231", lang: "en",   ogLocale: "en_BW", defaultRegion: "ga",  defaultCity: "gaborone" },
};

const DEFAULT_GEO: CountryGeoData = COUNTRY_GEO["in"];

/** Get geo data for a country code. Returns India defaults for unknown codes. */
export function getCountryGeo(countryCode: string): CountryGeoData {
  return COUNTRY_GEO[countryCode.toLowerCase()] ?? DEFAULT_GEO;
}

/** Get all country codes that have geo data registered. */
export function getAllCountryCodes(): string[] {
  return Object.keys(COUNTRY_GEO);
}

/** Get all country geo records. */
export function getAllCountryGeo(): CountryGeoData[] {
  return Object.values(COUNTRY_GEO);
}

/**
 * Parse city-urls.json entries into { country, region, city } tuples.
 * Each URL looks like: https://domain.tld/at/vie/vienna
 */
export function parseCityUrls(urls: string[]): Array<{ country: string; region: string; city: string }> {
  return urls
    .map((url) => {
      const path = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
      const parts = path.split("/");
      if (parts.length !== 3) return null;
      return { country: parts[0], region: parts[1], city: parts[2] };
    })
    .filter(Boolean) as Array<{ country: string; region: string; city: string }>;
}
