import type { Metadata } from "next";
import { ClerkLoginPageContent } from "@/components/auth/ClerkLoginPageContent";

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
  return <ClerkLoginPageContent country={country} region={region} city={city} />;
}
