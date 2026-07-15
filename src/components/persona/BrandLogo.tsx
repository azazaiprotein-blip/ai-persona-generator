"use client";

import { useState } from "react";

import { Logo } from "@/components/persona/Logo";
import { cn } from "@/lib/utils";

/**
 * The full Fouxium lockup (wolf emblem + wordmark) as provided by brand,
 * served from /brand/fouxium-logo.png. Until that file exists — or if it
 * fails to load — falls back to the inline SVG mark + text wordmark.
 */
export function BrandLogo({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- brand asset with graceful onError fallback
      <img
        src="/brand/fouxium-logo.png"
        alt="Fouxium"
        // The load error can fire before hydration attaches onError, so also
        // inspect the element when React takes over.
        ref={(el) => {
          if (el && el.complete && el.naturalWidth === 0) setFailed(true);
        }}
        onError={() => setFailed(true)}
        className={cn(
          "h-9 w-auto dark:rounded-md dark:bg-white/95 dark:px-1.5 dark:py-0.5",
          className,
        )}
      />
    );
  }

  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Logo className="size-7 transition-transform group-hover:scale-105" />
      <span className="text-base font-semibold tracking-tight">
        Fou<span className="text-brand">x</span>ium
      </span>
    </span>
  );
}

/**
 * Just the circular wolf emblem — the favicon mark — cropped to a circle.
 * The PNG has a baked-in white square, so we zoom it inside an overflow
 * clip until the green disc fills the frame. Falls back to the inline SVG.
 */
export function BrandMark({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) return <Logo className={className} />;

  return (
    <span
      className={cn("block overflow-hidden rounded-full bg-white", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- brand asset with graceful onError fallback */}
      <img
        src="/brand/fouxium-mark-white.png"
        alt="Fouxium"
        ref={(el) => {
          if (el && el.complete && el.naturalWidth === 0) setFailed(true);
        }}
        onError={() => setFailed(true)}
        className="size-full scale-150 object-cover"
      />
    </span>
  );
}
