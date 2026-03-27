import type { Metadata } from "next";
import { ClerkSignupPageContent } from "@/components/auth/ClerkSignupPageContent";

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
  return <ClerkSignupPageContent country={country} region={region} city={city} />;
}
