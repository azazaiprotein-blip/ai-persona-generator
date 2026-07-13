import { cn } from "@/lib/utils";

/** Theaix mark — a geometric "T" lettermark on the brand gradient. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Theaix"
    >
      <defs>
        <linearGradient id="theaix-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--brand-2)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="var(--ink)" />
      <path
        d="M9.5 10.5H22.5M16 10.5V23"
        stroke="url(#theaix-logo)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
