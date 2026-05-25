import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CampusOS AI — Admin Dashboard",
  description:
    "Unified Smart Campus Operating System — Admin Command Center for managing academics, attendance, placements, and AI analytics.",
  keywords: ["campus", "education", "AI", "dashboard", "admin"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
