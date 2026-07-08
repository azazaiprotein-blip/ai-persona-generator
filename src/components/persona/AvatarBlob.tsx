"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface AvatarBlobProps {
  initials: string;
  hue: number;
  className?: string;
  /** Explicit headshot URL (e.g. persona.avatar.photo). Wins over the map. */
  src?: string;
}

/**
 * Fixed cast members get hand-picked headshots so faces stay consistent
 * everywhere they appear (keyed by `initials-hue`).
 */
const KNOWN_FACES: Record<string, string> = {
  // Azaz — the consultant. Drop the real photo at public/avatars/azaz.jpg.
  "AZ-205": "/avatars/azaz.jpg",
  // Maya, Diego & Priya — the demo personas across the marketing pages.
  "MK-268": "https://randomuser.me/api/portraits/women/65.jpg",
  "DS-150": "https://randomuser.me/api/portraits/men/32.jpg",
  "PN-330": "https://randomuser.me/api/portraits/women/44.jpg",
  // Testimonial authors.
  "EF-268": "https://randomuser.me/api/portraits/women/17.jpg",
  "MR-190": "https://randomuser.me/api/portraits/men/22.jpg",
};

/** Deterministic stock portrait when no photo is provided. */
function fallbackPhoto(initials: string, hue: number): string {
  let h = 0x811c9dc5;
  for (const c of `${initials}-${hue}`) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 0x01000193);
  }
  h = h >>> 0;
  const gender = h % 2 ? "men" : "women";
  return `https://randomuser.me/api/portraits/${gender}/${(h % 98) + 1}.jpg`;
}

/**
 * A persona headshot. Resolves, in order: an explicit `src`, the known-faces
 * map, then a deterministic stock portrait. If the image fails to load it
 * falls back to the original gradient-initials blob.
 */
export function AvatarBlob({ initials, hue, className, src }: AvatarBlobProps) {
  const [failed, setFailed] = useState(false);
  const photo =
    src ?? KNOWN_FACES[`${initials}-${hue}`] ?? fallbackPhoto(initials, hue);

  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote stock portraits with graceful onError fallback
      <img
        src={photo}
        alt={`Avatar for ${initials}`}
        // The load error can fire before hydration attaches onError, so also
        // inspect the element when React takes over.
        ref={(el) => {
          if (el && el.complete && el.naturalWidth === 0) setFailed(true);
        }}
        onError={() => setFailed(true)}
        className={cn(
          "size-14 shrink-0 rounded-full object-cover [object-position:center_30%] shadow-sm",
          className,
        )}
      />
    );
  }

  const gradId = `avatar-grad-${hue}`;
  const from = `hsl(${hue} 70% 62%)`;
  const to = `hsl(${(hue + 48) % 360} 68% 48%)`;

  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={`Avatar for ${initials}`}
      className={cn("size-14 shrink-0 rounded-full shadow-sm", className)}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="32" fill={`url(#${gradId})`} />
      <text
        x="50%"
        y="52%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="26"
        fontWeight="600"
        fill="white"
        fontFamily="var(--font-sans, system-ui), sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}
