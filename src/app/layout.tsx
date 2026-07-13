import type { Metadata, Viewport } from "next";
import { Geist_Mono, Onest } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Onest — the closest Google-Fonts match to TT Firs Neue's geometric
// grotesque skeleton (Zipchat's typeface, which is commercial).
const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  applicationName: "Theaix",
  title: "Theaix — Build products people actually want",
  description:
    "AI-powered product research that transforms a simple idea into personas, JTBD, empathy maps, user journeys, feature prioritization, user stories, and product strategy in minutes.",
  keywords: [
    "product research",
    "UX research",
    "user personas",
    "jobs to be done",
    "empathy map",
    "user journey map",
    "feature prioritization",
    "product strategy",
    "AI product research",
  ],
  openGraph: {
    title: "Theaix — Build products people actually want",
    description:
      "AI-powered product research that transforms a simple idea into personas, JTBD, empathy maps, user journeys, feature prioritization, user stories, and product strategy in minutes.",
    siteName: "Theaix",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Theaix — Build products people actually want",
    description:
      "AI-powered product research that turns a simple idea into personas, JTBD, empathy maps, journeys, feature prioritization, user stories, and product strategy in minutes.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#12151d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${onest.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
