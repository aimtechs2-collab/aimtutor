import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  DEFAULT_CITY,
  DEFAULT_COUNTRY,
  DEFAULT_REGION,
} from "@/lib/geo";
import { slugify } from "@/lib/seoSlug";

export default async function Root() {
  // Server-side redirect so crawlers see a proper 307 instead of a blank page.
  // Try the admin backend's detect-location first; fall back to defaults.
  let country = DEFAULT_COUNTRY;
  let region = DEFAULT_REGION;
  let city = DEFAULT_CITY;

  try {
    const adminBackend =
      process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL ?? "http://localhost:3001";

    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for") ?? "";

    const res = await fetch(`${adminBackend}/api/detect-location`, {
      headers: { "x-forwarded-for": forwarded },
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      const data = (await res.json()) as Partial<{
        country: string;
        region: string;
        city: string;
      }>;
      if (data.country) {
        country = slugify(data.country) || DEFAULT_COUNTRY;
        region = slugify(data.region || region) || DEFAULT_REGION;
        city = slugify(data.city || city) || DEFAULT_CITY;
      }
    }
  } catch {
    // Fall through to defaults
  }

  redirect(`/${country}/${region}/${city}`);
}
