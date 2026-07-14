"use client";

/**
 * Plan + free-attempt tracking, stored locally (no accounts).
 *
 * Every visitor gets FREE_ATTEMPTS research runs. "Upgrading" on the pricing
 * page is a demo checkout — it just stores the chosen plan and unlocks
 * unlimited runs for this browser.
 */

export const FREE_ATTEMPTS = 3;

const PLAN_KEY = "fouxium:plan";
const ATTEMPTS_KEY = "fouxium:attempts-used";

// One-time migration from earlier key namespaces (theaix:* and folium:* →
// fouxium:*) so a visitor's chosen plan and used free attempts carry over the
// rename. Newest-namespace-first: a more recent value wins.
if (typeof window !== "undefined") {
  for (const [legacy, current] of [
    ["theaix:plan", PLAN_KEY],
    ["folium:plan", PLAN_KEY],
    ["theaix:attempts-used", ATTEMPTS_KEY],
    ["folium:attempts-used", ATTEMPTS_KEY],
  ] as const) {
    try {
      const value = window.localStorage.getItem(legacy);
      if (value !== null && window.localStorage.getItem(current) === null) {
        window.localStorage.setItem(current, value);
        window.localStorage.removeItem(legacy);
      }
    } catch {
      /* storage unavailable — nothing to migrate */
    }
  }
}

export type PlanId = "free" | "pro" | "studio";

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — treat as session-only */
  }
}

export function getPlan(): PlanId {
  const raw = safeGet(PLAN_KEY);
  return raw === "pro" || raw === "studio" ? raw : "free";
}

export function setPlan(plan: PlanId) {
  safeSet(PLAN_KEY, plan);
}

export function attemptsUsed(): number {
  const n = Number(safeGet(ATTEMPTS_KEY));
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export function attemptsLeft(): number {
  return Math.max(0, FREE_ATTEMPTS - attemptsUsed());
}

export function recordAttempt() {
  safeSet(ATTEMPTS_KEY, String(attemptsUsed() + 1));
}

/** True when the visitor can start another research run. */
export function canGenerate(): boolean {
  return getPlan() !== "free" || attemptsLeft() > 0;
}
