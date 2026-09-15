import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { siteConfig } from "@/lib/config";
import { profile } from "@/lib/content";
import { THEME_COLORS, themeInitScript } from "@/lib/theme";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const title = `${profile.name} · ${profile.role}`;
const siteName = `Portfolio de ${profile.shortName}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title,
  description: profile.tagline,
  applicationName: siteName,
  authors: [{ name: profile.name, url: siteConfig.github.profileUrl }],
  keywords: ["portfolio", "software engineer", "Next.js", "TypeScript", profile.name],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteConfig.url,
    title,
    description: profile.tagline,
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.tagline,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <noscript>
          {/* Sin JavaScript no hay animaciones de entrada: mostramos todo el contenido. */}
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
