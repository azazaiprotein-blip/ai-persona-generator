import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/persona/BrandLogo";

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
    <header className="glass sticky top-0 z-40 border-b border-border/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center">
          <BrandLogo className="transition-transform group-hover:scale-[1.03]" />
        </Link>

        {variant === "marketing" && (
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {variant === "marketing" ? (
            <Button variant="brand" size="sm" asChild className="shadow-brand">
              <Link href="/studio">
                Open Studio
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Home</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
