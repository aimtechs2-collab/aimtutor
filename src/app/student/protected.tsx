"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { getStoredGeo } from "@/lib/geo";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) return;

    const geo = getStoredGeo();
    const loginUrl = `/${geo.country}/${geo.region}/${geo.city}/login?redirect=${encodeURIComponent(pathname)}`;
    router.replace(loginUrl);
  }, [isLoaded, isSignedIn, pathname, router]);

  if (!isLoaded) return null;
  if (!isSignedIn) return null;
  return <>{children}</>;
}

