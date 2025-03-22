import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Permanent_Marker } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Inter } from "next/font/google";
import { Toaster as SonnerToaster } from "sonner";
import localFont from 'next/font/local';

// Main font for body text
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Accent font for headings and artistic elements
const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const calSans = localFont({
  src: '../fonts/CalSans-SemiBold.woff2',
  variable: '--font-calsans',
});

export const metadata: Metadata = {
  title: "Thiago Brito | Senior Front-End Developer",
  description: "Portfolio of Thiago Brito, a Senior Front-End Developer specializing in React, Next.js, and modern web technologies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${permanentMarker.variable} ${poppins.variable} ${calSans.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
          {children}
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
