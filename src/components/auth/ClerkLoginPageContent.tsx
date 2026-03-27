"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { Lock, Sparkles } from "lucide-react";
import { slugify } from "@/lib/seoSlug";

export function ClerkLoginPageContent({
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

  return (
    <section className="mt-24 min-h-[calc(100vh-220px)] bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40 px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 p-10 text-white shadow-2xl lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Student Portal Access
          </div>
          <h1 className="text-4xl font-bold leading-tight">Welcome back to AIM Intelligence</h1>
          <p className="mt-4 text-base text-white/80">
            Continue your courses, track progress, and access your learning dashboard securely.
          </p>
          <div className="mt-10 space-y-3 text-sm text-white/85">
            <p className="flex items-center gap-2"><Lock className="h-4 w-4" /> Secure sign in with Clerk</p>
            <p className="flex items-center gap-2"><Lock className="h-4 w-4" /> Encrypted sessions and account safety</p>
            <p className="flex items-center gap-2"><Lock className="h-4 w-4" /> One-click Google authentication</p>
          </div>
        </div>

        <div className="flex items-start justify-center lg:pt-1">
          <SignIn
            routing="hash"
            signUpUrl={`${locPrefix}/signup`}
            forceRedirectUrl={forceRedirectUrl ?? "/student"}
            appearance={{ elements: { rootBox: "w-full max-w-md" } }}
          />
        </div>
      </div>
    </section>
  );
}

