"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  Check,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { AvatarBlob } from "@/components/persona/AvatarBlob";
import { Button } from "@/components/ui/button";
import type { Persona } from "@/lib/types";

/**
 * The bridge from synthetic to real research: Fouxium recruits a real person
 * matching the persona's profile and arranges a moderated interview. The
 * booking itself is a Pro-membership feature, so this dialog sells the value
 * and routes to /pricing.
 */
export function MeetRealPersona({ persona }: { persona: Persona }) {
  const [open, setOpen] = useState(false);
  const first = persona.name.split(" ")[0];

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Users className="size-4" />
        Meet the real {first}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`Interview a real ${persona.archetype}`}
              className="bg-card w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl"
            >
              {/* Header — the persona goes from synthetic to real */}
              <div className="bg-ink relative px-6 pt-6 pb-5 text-white">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(80% 120% at 50% 0%, color-mix(in srgb, var(--brand) 30%, transparent) 0%, transparent 100%)",
                  }}
                />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="absolute top-4 right-4 text-white/60 hover:text-white"
                >
                  <X className="size-4" />
                </button>
                <div className="relative flex items-center gap-3">
                  <div className="relative">
                    <AvatarBlob
                      initials={persona.avatar.initials}
                      hue={persona.avatar.hue}
                      className="size-12"
                    />
                    <span className="border-ink absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border-2 bg-emerald-400">
                      <Users className="size-3 text-white" />
                    </span>
                  </div>
                  <div>
                    <div className="text-xs tracking-wide text-white/60 uppercase">
                      From synthetic to real
                    </div>
                    <h2 className="text-lg font-semibold">
                      Interview a real {persona.archetype.replace(/^The /, "").toLowerCase()}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Fouxium recruits a real person matching {first}&apos;s profile
                  — {persona.occupation.toLowerCase()}, {persona.location} — and
                  arranges a 45-minute moderated video interview for you.
                </p>
                <ul className="mt-4 space-y-2.5">
                  {[
                    "Matched from a vetted, fairly-paid participant panel",
                    "Scheduled within 3–5 business days",
                    "Recording, transcript & highlight reel in your workspace",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <span className="bg-brand mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full">
                        <Check className="size-3 [color:var(--brand-foreground)]" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Membership gate */}
                <div className="bg-brand-subtle/60 border-brand/20 mt-5 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5">
                  <Sparkles className="text-brand size-4 shrink-0" />
                  <p className="text-xs leading-relaxed">
                    Real-user interviews are part of the{" "}
                    <span className="font-semibold">Fouxium Pro membership</span>{" "}
                    — along with unlimited research runs.
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <Button variant="brand" asChild className="shadow-brand w-full">
                    <Link href="/pricing">
                      <CalendarClock className="size-4" />
                      Upgrade to book this interview
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground w-full"
                    onClick={() => setOpen(false)}
                  >
                    Maybe later
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
