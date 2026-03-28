import { Suspense } from "react";
import type { Metadata } from "next";
import { ClerkLoginPageContent } from "@/components/auth/ClerkLoginPageContent";

function LoginFallback() {
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
    title: `Sign in | ${place}`,
    description: `Log in to your student account for AIM at ${place}.`,
    robots: { index: false, follow: true },
  };
}

export default async function LoginPage({ params }: Props) {
  const { country, region, city } = await params;
  return (
    <Suspense fallback={<LoginFallback />}>
      <ClerkLoginPageContent country={country} region={region} city={city} />
    </Suspense>
  );
}
