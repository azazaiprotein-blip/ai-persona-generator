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
  title: "Folium — AI UX Research Copilot",
  description:
    "Turn your product idea into a complete UX research package in minutes — personas, empathy maps, journeys, jobs-to-be-done, opportunities, feature priorities, user stories, and go-to-market recommendations.",
  keywords: [
    "UX research",
    "user personas",
    "empathy map",
    "user journey map",
    "jobs to be done",
    "product discovery",
    "AI research copilot",
  ],
  openGraph: {
    title: "Folium — AI UX Research Copilot",
    description:
      "Turn your product idea into a complete UX research package in minutes.",
    type: "website",
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
