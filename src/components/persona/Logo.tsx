import { cn } from "@/lib/utils";

/** Folium mark — a leaf glyph (folium = "leaf" in Latin). */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Folium"
    >
      <defs>
        <linearGradient id="folium-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--brand-2)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="var(--ink)" />
      <path d="M9 23c0-8 6-13 14-13 0 8-6 13-14 13z" fill="url(#folium-logo)" />
      <path
        d="M10.5 22.5C13 18 16.5 14.8 21 12.5"
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
