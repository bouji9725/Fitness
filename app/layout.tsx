import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Global font configuration.
// Keep fonts defined here so the entire app inherits them consistently.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Root metadata for the entire application.
// Keep this product-focused and generic enough to support all routes.
export const metadata: Metadata = {
  title: {
    default: "Fitsler",
    template: "%s | Fitsler",
  },
  description:
    "A fitness tracking application for workouts, nutrition, progress monitoring, and coach-friendly sharing.",
  applicationName: "Fitsler",
  keywords: [
    "fitness tracker",
    "workout tracking",
    "nutrition",
    "progress tracking",
    "fitness app",
  ],
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

// Root layout should stay minimal and stable.
// Responsibilities:
// - html/body structure
// - global font classes
// - metadata export
// - app-wide background hooks
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}