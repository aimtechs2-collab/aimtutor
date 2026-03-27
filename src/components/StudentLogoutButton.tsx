"use client";

import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { getStoredGeo } from "@/lib/geo";

export default function StudentLogoutButton() {
  const router = useRouter();
  const { signOut } = useClerk();

  async function logout() {
    try {
      await signOut();
    } catch {
      /* ignore */
    }
    const geo = getStoredGeo();
    router.replace(`/${geo.country}/${geo.region}/${geo.city}/login`);
  }

  return (
    <button type="button" onClick={logout} className="text-sm text-zinc-700 underline">
      Log out
    </button>
  );
}
