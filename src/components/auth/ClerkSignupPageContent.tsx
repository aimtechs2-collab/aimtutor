"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { slugify } from "@/lib/seoSlug";

export function ClerkSignupPageContent({
  country,
  region,
  city,
}: {
  country: string;
  region: string;
  city: string;
}) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const locPrefix = useMemo(() => {
    return `/${country}/${region}/${slugify(city)}`;
  }, [country, region, city]);

  let forceRedirectUrl: string | null = null;
  if (redirect) {
    try {
      forceRedirectUrl = decodeURIComponent(redirect);
    } catch {
      forceRedirectUrl = null;
    }
  }

  // SignUp will internally route to SignIn via `signInUrl`.
  return (
    <SignUp
      routing="hash"
      signInUrl={`${locPrefix}/login`}
      forceRedirectUrl={forceRedirectUrl ?? "/student"}
    />
  );
}

