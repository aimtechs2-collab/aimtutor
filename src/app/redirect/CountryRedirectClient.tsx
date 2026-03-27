"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_CITY,
  DEFAULT_COUNTRY,
  DEFAULT_REGION,
  detectCountryFromBrowserLanguage,
  setStoredGeo,
} from "@/lib/geo";

export default function CountryRedirectClient() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function redirectUser() {
      let country = DEFAULT_COUNTRY;
      let region = DEFAULT_REGION;
      let city = DEFAULT_CITY;

      try {
        const res = await fetch("/api/detect-location", { cache: "no-store" });
        const data = (await res.json()) as Partial<{
          country: string;
          region: string;
          city: string;
        }>;

        if (data.country) {
          country = data.country.toLowerCase();
          region = (data.region || region).toLowerCase();
          city = data.city || city;
        } else {
          country = detectCountryFromBrowserLanguage();
        }
      } catch {
        country = detectCountryFromBrowserLanguage();
      }

      const geo = { country, region, city };
      setStoredGeo(geo);
      if (!isMounted) return;
      router.replace(`/${geo.country}/${geo.region}/${encodeURIComponent(geo.city.toLowerCase().replace(/\s+/g, "-"))}`);
    }

    redirectUser();
    return () => {
      isMounted = false;
    };
  }, [router]);

  return null;
}

