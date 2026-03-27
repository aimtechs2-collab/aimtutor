import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";
import "./globals.css";
import Providers from "./providers";
import { getSiteOrigin } from "@/lib/siteUrl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: {
    default: "Aim Tutor — #1 AI & Software Training Institute | 20+ Years of Excellence",
    template: "%s | Aim Tutor",
  },
  description:
    "Transform your career with Aim Tutor! Expert-led training in AI, Cloud Computing, Data Science, DevOps & more. 100K+ students trained. 20+ years of excellence. Enroll now!",
  openGraph: {
    type: "website",
    siteName: "Aim Tutor",
    images: [{ url: "/aimlogo.webp", width: 512, height: 512, alt: "Aim Tutor Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aimtutor",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <ClerkProvider ui={ui}>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
