import { cn } from "@/lib/utils";

/**
 * Fouxium mark — the wolf emblem. A white angular wolf head in profile with a
 * sweeping neck curve, set in a circular badge that runs deep navy → vivid
 * blue, matching the final brand logo.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Fouxium"
    >
      <defs>
        <linearGradient id="fouxium-badge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2e6ff2" />
          <stop offset="45%" stopColor="#16294a" />
          <stop offset="100%" stopColor="#0d1a30" />
        </linearGradient>
      </defs>

      {/* circular badge */}
      <circle cx="32" cy="32" r="30" fill="url(#fouxium-badge)" />

      {/* wolf head — angular profile, long muzzle facing right */}
      <path
        d="M20 27 L21.5 11 L26.5 17.5 L30 8 L33.5 16 C38 16.5 43.5 19.5 48.5 24.5 L42.5 26.5 L43.5 30.5 C39 34.5 32 35.5 27 33 L22 30 Z"
        fill="#ffffff"
      />

      {/* eye */}
      <path d="M32.3 22.5 L34.2 20.9 L36.1 22.5 L34.2 24.1 Z" fill="#2e6ff2" />

      {/* sweeping neck / tail curve */}
      <path
        d="M27 33 C21.5 40.5 24.5 48 33 49.5 C24 51 14.5 44.5 14.5 34.5 C14.5 30 16.5 27.5 20 26.5 C20.5 29.5 23 31.8 27 33 Z"
        fill="#ffffff"
      />
    </svg>
  );
}
