"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

import { Logo } from "@/components/persona/Logo";

/* ------------------------------------------------------------------ */
/* The magic pool                                                      */
/* ------------------------------------------------------------------ */

const QUOTES = [
  { text: "Good design is actually a lot harder to notice than poor design.", author: "Don Norman" },
  { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
  { text: "If you think good design is expensive, you should look at the cost of bad design.", author: "Ralf Speth" },
  { text: "A user interface is like a joke. If you have to explain it, it's not that good.", author: "Martin LeBlanc" },
  { text: "People ignore design that ignores people.", author: "Frank Chimero" },
  { text: "Design is intelligence made visible.", author: "Alina Wheeler" },
  { text: "You can't understand good design if you don't understand people.", author: "Dieter Rams" },
  { text: "Rule of thumb for UX: more options, more problems.", author: "Scott Belsky" },
  { text: "Content precedes design. Design in the absence of content is not design, it's decoration.", author: "Jeffrey Zeldman" },
  { text: "The best interface is no interface.", author: "Golden Krishna" },
  { text: "Design isn't finished until somebody is using it.", author: "Brenda Laurel" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
];

const TIPS = [
  "Test with just 5 users — Jakob Nielsen says you'll catch ~85% of usability problems.",
  "Your persona's biggest competitor is often a spreadsheet. Or doing nothing at all.",
  "If everything on the page is highlighted, nothing is.",
  "The wolf sniffs out assumptions — interview before you build. 🐺",
  "Onboarding tip: deliver one small win in the first 60 seconds.",
  "Empty states are prime real estate. Teach, don't apologize.",
  "Users don't read — they forage. Make your headings scannable.",
  "Every extra form field costs conversions. Bite only what you need.",
];

const RAIN_EMOJI = ["🐾", "✨", "💙", "🔍", "🧠", "🐺"];
const CONFETTI_COLORS = ["#2e6ff2", "#60a5fa", "#93c5fd", "#0d1a30", "#ffffff"];

type Popover =
  | { kind: "quote"; text: string; author: string }
  | { kind: "tip"; text: string };
type Confetto = { id: number; dx: number; dy: number; rot: number; color: string; size: number; round: boolean };
type Drop = { id: number; left: number; emoji: string; duration: number; drift: number; delay: number; fall: number };
type Spark = { id: number; x: number; y: number };

let uid = 0;
const pickFrom = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

/* ------------------------------------------------------------------ */
/* The wolf mark (PNG with inline-SVG fallback)                        */
/* ------------------------------------------------------------------ */

function MarkImage({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <Logo className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- brand asset with graceful fallback
    <img
      src="/brand/fouxium-mark.png"
      alt=""
      aria-hidden
      ref={(el) => {
        if (el && el.complete && el.naturalWidth === 0) setFailed(true);
      }}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

/* ------------------------------------------------------------------ */
/* The floating magic bubble                                           */
/* ------------------------------------------------------------------ */

export function MagicBubble() {
  const [popover, setPopover] = useState<Popover | null>(null);
  const [confetti, setConfetti] = useState<Confetto[]>([]);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [wolfDash, setWolfDash] = useState<{ id: number; w: number } | null>(null);
  const [sparkleOn, setSparkleOn] = useState(false);
  const [spin, setSpin] = useState(0);

  const sparkleUntil = useRef(0);
  const lastTrick = useRef("");
  const popTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sparkle-trail mode: while active, the cursor sheds little stars.
  useEffect(() => {
    if (!sparkleOn) return;
    let last = 0;
    function onMove(e: MouseEvent) {
      const now = performance.now();
      if (now - last < 40) return;
      last = now;
      const spark = { id: uid++, x: e.clientX, y: e.clientY };
      setSparks((prev) => [...prev.slice(-24), spark]);
      setTimeout(
        () => setSparks((prev) => prev.filter((s) => s.id !== spark.id)),
        900,
      );
    }
    window.addEventListener("mousemove", onMove);
    const off = setTimeout(
      () => setSparkleOn(false),
      Math.max(0, sparkleUntil.current - Date.now()),
    );
    return () => {
      window.removeEventListener("mousemove", onMove);
      clearTimeout(off);
    };
  }, [sparkleOn]);

  function showPopover(next: Popover) {
    if (popTimer.current) clearTimeout(popTimer.current);
    setPopover(next);
    popTimer.current = setTimeout(() => setPopover(null), 8000);
  }

  function cast() {
    setSpin((s) => s + 1);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pool = reduced
      ? ["quote", "tip"]
      : ["quote", "tip", "confetti", "wolf", "rain", "sparkles"];
    let trick = pickFrom(pool);
    if (trick === lastTrick.current)
      trick = pool[(pool.indexOf(trick) + 1) % pool.length];
    lastTrick.current = trick;

    switch (trick) {
      case "quote": {
        const q = pickFrom(QUOTES);
        showPopover({ kind: "quote", ...q });
        break;
      }
      case "tip": {
        showPopover({ kind: "tip", text: pickFrom(TIPS) });
        break;
      }
      case "confetti": {
        const parts: Confetto[] = Array.from({ length: 36 }, () => ({
          id: uid++,
          dx: (Math.random() - 0.5) * 340,
          dy: -(70 + Math.random() * 230),
          rot: (Math.random() - 0.5) * 640,
          color: pickFrom(CONFETTI_COLORS),
          size: 6 + Math.random() * 6,
          round: Math.random() > 0.6,
        }));
        setConfetti((prev) => [...prev, ...parts]);
        const ids = new Set(parts.map((p) => p.id));
        setTimeout(
          () => setConfetti((prev) => prev.filter((p) => !ids.has(p.id))),
          1800,
        );
        break;
      }
      case "wolf": {
        setWolfDash({ id: uid++, w: window.innerWidth });
        break;
      }
      case "rain": {
        const fall = window.innerHeight + 80;
        const batch: Drop[] = Array.from({ length: 18 }, () => ({
          id: uid++,
          left: Math.random() * 100,
          emoji: pickFrom(RAIN_EMOJI),
          duration: 1.8 + Math.random() * 1.4,
          drift: (Math.random() - 0.5) * 90,
          delay: Math.random() * 0.7,
          fall,
        }));
        setDrops((prev) => [...prev, ...batch]);
        const ids = new Set(batch.map((d) => d.id));
        setTimeout(
          () => setDrops((prev) => prev.filter((d) => !ids.has(d.id))),
          4200,
        );
        break;
      }
      case "sparkles": {
        sparkleUntil.current = Date.now() + 6000;
        setSparkleOn(true);
        showPopover({
          kind: "tip",
          text: "✨ Sparkle mode! Wiggle your mouse for the next few seconds.",
        });
        break;
      }
    }
  }

  return (
    <>
      {/* Confetti burst (anchored near the bubble) */}
      <div className="pointer-events-none fixed right-10 bottom-20 z-40">
        {confetti.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{
              x: p.dx,
              y: [0, p.dy, 300],
              rotate: p.rot,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.6,
              ease: "easeOut",
              times: [0, 0.4, 1],
            }}
            style={{
              width: p.size,
              height: p.round ? p.size : p.size * 0.55,
              backgroundColor: p.color,
              borderRadius: p.round ? "50%" : 2,
            }}
            className="absolute block border border-black/5"
          />
        ))}
      </div>

      {/* Emoji rain */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {drops.map((d) => (
          <motion.span
            key={d.id}
            initial={{ y: -48, x: 0, rotate: 0, opacity: 1 }}
            animate={{ y: d.fall, x: d.drift, rotate: 300, opacity: [1, 1, 0.6] }}
            transition={{ duration: d.duration, delay: d.delay, ease: "easeIn" }}
            style={{ left: `${d.left}%` }}
            className="absolute top-0 text-2xl"
          >
            {d.emoji}
          </motion.span>
        ))}
      </div>

      {/* Sparkle trail */}
      <div className="pointer-events-none fixed inset-0 z-50">
        {sparks.map((s) => (
          <motion.span
            key={s.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1.3, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 0.8 }}
            style={{ left: s.x - 8, top: s.y - 8 }}
            className="absolute text-base [color:var(--brand-2)]"
          >
            ✦
          </motion.span>
        ))}
      </div>

      {/* Wolf dash across the bottom of the screen */}
      <AnimatePresence>
        {wolfDash && (
          <motion.div
            key={wolfDash.id}
            initial={{ x: -96 }}
            animate={{ x: wolfDash.w + 96 }}
            transition={{ duration: 1.6, ease: "linear" }}
            onAnimationComplete={() => setWolfDash(null)}
            className="pointer-events-none fixed bottom-4 left-0 z-40"
          >
            <motion.div
              animate={{ y: [0, -14, 0, -10, 0, -14, 0] }}
              transition={{ duration: 1.6, times: [0, 0.16, 0.32, 0.48, 0.64, 0.82, 1] }}
              className="relative"
            >
              <MarkImage className="size-14 rounded-full shadow-xl" />
              <span className="absolute top-1/2 -left-7 -translate-y-1/2 text-xl">
                💨
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote / tip popover */}
      <AnimatePresence>
        {popover && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card fixed right-5 bottom-24 z-50 w-80 max-w-[calc(100vw-2.5rem)] rounded-2xl border p-4 shadow-xl"
          >
            <button
              onClick={() => setPopover(null)}
              aria-label="Dismiss"
              className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5"
            >
              <X className="size-4" />
            </button>
            {popover.kind === "quote" ? (
              <figure>
                <blockquote className="pr-5 text-sm leading-relaxed italic">
                  “{popover.text}”
                </blockquote>
                <figcaption className="text-brand mt-2 text-xs font-semibold">
                  — {popover.author}
                </figcaption>
              </figure>
            ) : (
              <div className="flex items-start gap-2.5 pr-5">
                <span className="bg-brand-subtle text-brand mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg">
                  <Sparkles className="size-4" />
                </span>
                <p className="text-sm leading-relaxed">{popover.text}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The bubble itself */}
      <motion.button
        onClick={cast}
        aria-label="A little magic — click me"
        title="Click for a surprise ✨"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        className="border-border/70 fixed right-5 bottom-5 z-50 flex size-14 cursor-pointer items-center justify-center rounded-full border bg-white shadow-lg"
      >
        <span
          aria-hidden
          className="bg-brand/20 absolute inset-0 -z-10 animate-ping rounded-full [animation-duration:3s]"
        />
        <motion.span
          key={spin}
          initial={{ rotate: 0 }}
          animate={{ rotate: spin === 0 ? 0 : 360 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="block size-11 overflow-hidden rounded-full"
        >
          <MarkImage className="size-full object-cover" />
        </motion.span>
      </motion.button>
    </>
  );
}
