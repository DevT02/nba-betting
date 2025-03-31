import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iverson Bets",
  description: "Analyze NBA betting data and find the best deals with Iverson Bets, your go-to platform for smarter betting",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en" className="font-sans" suppressHydrationWarning>
      <head />
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
