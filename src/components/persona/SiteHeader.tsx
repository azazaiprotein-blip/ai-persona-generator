import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/persona/BrandLogo";

interface SiteHeaderProps {
  variant?: "marketing" | "app";
}

const NAV = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/consult", label: "Consultation" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader({ variant = "marketing" }: SiteHeaderProps) {
  return (
    // Zipchat-style floating pill: detached from the top edge, fully rounded,
    // and tinted to match the hero's near-black so it reads as part of the
    // dark stage it floats over.
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between rounded-2xl border border-white/10 bg-neutral-800/70 pr-2 pl-2.5 shadow-lg shadow-black/25 backdrop-blur-md">
        <Link href="/" aria-label="Fouxium — home" className="group flex items-center">
          <BrandMark className="size-10 transition-transform group-hover:scale-105" />
        </Link>

        {variant === "marketing" && (
          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-1.5">
          {variant === "marketing" ? (
            <Button
              variant="brand"
              size="sm"
              asChild
              className="shadow-brand h-10 rounded-xl px-4"
            >
              <Link href="/studio">
                Start Research
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              asChild
              className="h-10 rounded-xl border border-white/20 bg-transparent px-4 text-white shadow-none hover:bg-white/10"
            >
              <Link href="/">Home</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
