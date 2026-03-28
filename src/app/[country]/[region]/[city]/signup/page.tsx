import { Suspense } from "react";
import type { Metadata } from "next";
import { ClerkSignupPageContent } from "@/components/auth/ClerkSignupPageContent";

function SignupFallback() {
  return (
    <section className="mt-24 min-h-[calc(100vh-220px)] bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40 px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-5xl animate-pulse rounded-3xl bg-white/60 p-10 h-96" aria-hidden />
    </section>
  );
}

type Props = {
  params: Promise<{ country: string; region: string; city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, region, city } = await params;
  const place = [city, region, country].filter(Boolean).join(" · ");
  return {
    title: `Create account | ${place}`,
    description: `Register as a student for AIM at ${place}. Phone verification with OTP.`,
    robots: { index: false, follow: true },
  };
}

export default async function SignupPage({ params }: Props) {
  const { country, region, city } = await params;
  return (
    <Suspense fallback={<SignupFallback />}>
      <ClerkSignupPageContent country={country} region={region} city={city} />
    </Suspense>
  );
}
