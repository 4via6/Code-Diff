import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from 'sonner'
import { SettingsProvider } from "@/contexts/SettingsContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Code Diff Tool - Smart Code Comparison",
  description: "A powerful tool for comparing code changes, detecting differences, and analyzing modifications. Features syntax highlighting, live editing, and intelligent diff detection.",
  keywords: ["code comparison", "diff tool", "code diff", "text comparison", "developer tools", "code analysis"],
  authors: [{ name: "Anurag Vishwakarma" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://code.arson.me",
    siteName: "Code Diff Tool",
    title: "Code Diff Tool - Smart Code Comparison",
    description: "Compare code changes, detect differences, and analyze modifications with our intelligent diff tool.",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Code Diff Tool Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Diff Tool - Smart Code Comparison",
    description: "Compare code changes, detect differences, and analyze modifications with our intelligent diff tool.",
    images: ["/preview.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          {children}
          <Toaster />
        </SettingsProvider>
      </body>
    </html>
  )
}
