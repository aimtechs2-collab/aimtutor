"use client";

import Link from "next/link";
import { ChevronRight, Globe } from "lucide-react";
import { slugify } from "@/lib/seoSlug";

/** Compact city label in header (e.g. hyderabad → hyd) — matches Frontend-style geo control */
export default function ChangeLocationButton({
  city,
  className = "",
  onPress,
}: {
  city: string;
  className?: string;
  onPress?: () => void;
}) {
  const slug = slugify(city);
  const shortLabel = slug.length >= 3 ? slug.slice(0, 3).toLowerCase() : slug.toLowerCase();

  return (
    <Link
      href="/choose-country-region"
      onClick={onPress}
      className={`flex items-center gap-2 ml-3 pl-3 border-l border-white/15 text-white hover:text-cyan-300 transition-colors ${className}`}
      aria-label="Change location"
    >
      <Globe className="h-5 w-5 shrink-0 text-cyan-400/90" strokeWidth={2} />
      <span className="text-base font-medium tracking-wide capitalize">{shortLabel}</span>
      <ChevronRight className="h-4 w-4 text-white/50 shrink-0" strokeWidth={2} />
    </Link>
  );
}
