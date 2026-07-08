import { randomUUID } from "crypto";

import type { Persona, PersonaCore } from "./types";

/** Deterministic 32-bit hash (FNV-1a) — used to derive stable avatar hues. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Up-to-two-letter initials from a display name. */
export function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** A stable hue (0–360) derived from the persona's name. */
export function hueFrom(name: string): number {
  return hashString(name) % 360;
}

/**
 * A deterministic stock headshot for a persona — gender-matched via pronouns
 * when available, stable across renders because it derives from the name.
 */
export function headshotFrom(name: string, pronouns?: string): string {
  const h = hashString(name);
  const p = pronouns?.toLowerCase() ?? "";
  const gender = p.startsWith("she")
    ? "women"
    : p.startsWith("he")
      ? "men"
      : h % 2
        ? "men"
        : "women";
  return `https://randomuser.me/api/portraits/${gender}/${(h % 98) + 1}.jpg`;
}

/**
 * Turn a generator's core output into a fully-formed, renderable Persona by
 * attaching an id, source, timestamp, and a derived avatar.
 */
export function enrichPersona(
  core: PersonaCore,
  source: Persona["source"],
  model?: string,
): Omit<Persona, "research"> {
  return {
    ...core,
    id: randomUUID(),
    source,
    model,
    createdAt: new Date().toISOString(),
    avatar: {
      initials: initialsFrom(core.name),
      hue: hueFrom(core.name),
      photo: headshotFrom(core.name, core.pronouns),
    },
  };
}
