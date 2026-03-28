"use client";

import { useEffect, useState, type ReactNode } from "react";

export function StarRow({
  value,
  showNumber = true,
  size = "sm",
}: {
  value: number;
  showNumber?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const whole = Math.round(value);
  const sizeClasses = {
    sm: "text-xs sm:text-sm",
    md: "text-sm sm:text-base",
    lg: "text-base sm:text-lg",
  };
  return (
    <div className="flex items-center gap-0.5 sm:gap-1" aria-label={`Rating ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-icons ${sizeClasses[size]} ${i < whole ? "text-yellow-500" : "text-gray-300"}`}
        >
          star
        </span>
      ))}
      {showNumber ? (
        <span className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">{value.toFixed(1)}</span>
      ) : null}
    </div>
  );
}

export function SectionHeading({ children, level = 2 }: { children: ReactNode; level?: 1 | 2 | 3 }) {
  const Tag = `h${level}` as const;
  const classes: Record<number, string> = {
    1: "text-2xl sm:text-3xl font-bold",
    2: "text-xl sm:text-2xl font-bold",
    3: "text-lg sm:text-xl font-semibold",
  };
  return <Tag className={classes[level] ?? classes[2]}>{children}</Tag>;
}

export function Divider() {
  return <hr className="my-6 sm:my-8 border-gray-200" />;
}

export function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function AccordionItem({
  id,
  title,
  children,
  defaultOpen = false,
}: {
  id: string;
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        id={`${id}-button`}
        aria-controls={`${id}-panel`}
        aria-expanded={open}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors gap-2"
      >
        <div className="font-semibold text-sm sm:text-base lg:text-lg pr-2 flex-1 min-w-0">{title}</div>
        <span
          className={`material-icons transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : "rotate-0"}`}
        >
          expand_more
        </span>
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={`transition-all duration-300 ease-in-out ${open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
      >
        <div className="p-4 sm:p-6 pt-0 bg-gray-50">{children}</div>
      </div>
    </div>
  );
}

export function MobileEnrollmentBar({
  price,
  courseCurrency,
  enrollLabel,
}: {
  price: number;
  courseCurrency: string;
  enrollLabel: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const priceStr =
    price > 0
      ? new Intl.NumberFormat("en-IN", { style: "currency", currency: courseCurrency || "INR" }).format(
          price,
        )
      : "Free";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-3 sm:p-4 z-50 lg:hidden shadow-lg">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        <div>
          <div className="text-lg sm:text-xl font-bold text-gray-900">{priceStr}</div>
          {price > 0 ? (
            <div className="text-xs text-gray-500 line-through">
              {new Intl.NumberFormat("en-IN", { style: "currency", currency: courseCurrency || "INR" }).format(
                Math.round(price * 1.5),
              )}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => document.getElementById("enrollment-form")?.scrollIntoView({ behavior: "smooth" })}
          className="flex-1 max-w-xs bg-violet-600 hover:bg-violet-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
        >
          {enrollLabel}
        </button>
      </div>
    </div>
  );
}
