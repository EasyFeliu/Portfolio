import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { profile } from "@/lib/content";
import { themeInitScript } from "@/lib/theme";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} · ${profile.role}`,
  description: profile.tagline,
  applicationName: `Portfolio de ${profile.shortName}`,
  authors: [{ name: profile.name, url: "https://github.com/EasyFeliu" }],
  keywords: ["portfolio", "software engineer", "Next.js", "TypeScript", profile.name],
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: `${profile.name} · ${profile.role}`,
    description: profile.tagline,
    siteName: `Portfolio de ${profile.shortName}`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · ${profile.role}`,
    description: profile.tagline,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
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
