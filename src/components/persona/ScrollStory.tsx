"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  Check,
  Compass,
  MessageCircle,
  PenLine,
  Sparkles,
  Star,
} from "lucide-react";

import { AvatarBlob } from "@/components/persona/AvatarBlob";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Story content                                                       */
/* ------------------------------------------------------------------ */

const CHAPTERS = [
  {
    title: "It starts with one line.",
    body: "No surveys. No workshops. Just describe what you're building — Folium takes it from there.",
  },
  {
    title: "Meet the people you're building for.",
    body: "Personas appear with names, goals, frustrations and personalities — specific enough to argue with.",
  },
  {
    title: "Their world, fully mapped.",
    body: "Empathy maps, journeys and jobs-to-be-done unfold — the why behind every behavior.",
  },
  {
    title: "You leave with the plan.",
    body: "Prioritized features, user stories, metrics and go-to-market — ready for Monday's standup.",
  },
] as const;

const N = CHAPTERS.length;

/**
 * useTransform, padded so keyframes always span the full [0, 1] progress
 * range. Framer Motion 12 promotes scroll-linked styles to native WAAPI
 * ScrollTimeline animations, and WAAPI inserts *implicit* keyframes from the
 * element's inline style when offsets don't start at 0 / end at 1 — which
 * silently ramps values back toward their initial state outside the segment.
 */
function useSegment(
  progress: MotionValue<number>,
  inputs: number[],
  outputs: number[],
) {
  const ins = [...inputs];
  const outs = [...outputs];
  if (ins[0] > 0) {
    ins.unshift(0);
    outs.unshift(outs[0]);
  }
  if (ins[ins.length - 1] < 1) {
    ins.push(1);
    outs.push(outs[outs.length - 1]);
  }
  return useTransform(progress, ins, outs);
}

function chapterKeys(index: number, band: number): number[] {
  const start = index / N;
  const end = (index + 1) / N;
  const fade = (end - start) * band;
  return [start, start + fade, end - fade, end];
}

/* ------------------------------------------------------------------ */
/* Crossfading headline + caption                                      */
/* ------------------------------------------------------------------ */

function ChapterTitle({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const k = chapterKeys(index, 0.12);
  const first = index === 0;
  const last = index === N - 1;
  const opacity = useSegment(progress, k, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useSegment(progress, k, [first ? 0 : 26, 0, 0, last ? 0 : -26]);

  return (
    <motion.h2
      style={{ opacity, y }}
      className="absolute inset-x-0 top-0 text-2xl font-bold tracking-tight text-balance text-white sm:text-5xl"
    >
      {CHAPTERS[index].title}
    </motion.h2>
  );
}

function ChapterCaption({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const k = chapterKeys(index, 0.12);
  const first = index === 0;
  const last = index === N - 1;
  const opacity = useSegment(progress, k, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useSegment(progress, k, [first ? 0 : 14, 0, 0, last ? 0 : -14]);

  return (
    <motion.p
      style={{ opacity, y }}
      className="absolute inset-x-0 top-0 text-xs leading-relaxed text-pretty text-white/65 sm:text-base"
    >
      <span className="text-brand mr-3 font-mono text-xs font-semibold">
        0{index + 1} / 0{N}
      </span>
      {CHAPTERS[index].body}
    </motion.p>
  );
}

/* ------------------------------------------------------------------ */
/* Pagination dot — stretches into a pill while its chapter is active  */
/* ------------------------------------------------------------------ */

function Dot({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const k = chapterKeys(index, 0.1);
  const first = index === 0;
  const last = index === N - 1;
  const width = useSegment(progress, k, [first ? 28 : 8, 28, 28, last ? 28 : 8]);
  const active = useSegment(progress, k, [first ? 1 : 0, 1, 1, last ? 1 : 0]);

  return (
    <motion.span
      style={{ width }}
      className="relative block h-2 overflow-hidden rounded-full bg-white/20"
    >
      <motion.span
        style={{ opacity: active }}
        className="bg-brand absolute inset-0 rounded-full"
      />
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Slides inside the media frame                                       */
/* ------------------------------------------------------------------ */

function Slide({
  index,
  progress,
  children,
}: {
  index: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  const k = chapterKeys(index, 0.28);
  const first = index === 0;
  const last = index === N - 1;

  const x = useSegment(progress, k, [first ? 0 : 680, 0, 0, last ? 0 : -680]);
  const opacity = useSegment(progress, k, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const scale = useSegment(progress, k, [first ? 1 : 0.94, 1, 1, last ? 1 : 0.96]);

  return (
    <motion.div
      style={{ x, opacity, scale }}
      className={cn(
        "absolute inset-0 flex items-center justify-center px-6 sm:px-10",
        index === N - 1 ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div className="w-full max-w-md">{children}</div>
    </motion.div>
  );
}

function SlideCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white p-5 text-neutral-900 shadow-2xl shadow-black/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

function WindowDots() {
  return (
    <div className="mb-3 flex gap-1.5">
      <span className="size-2 rounded-full bg-rose-400/80" />
      <span className="size-2 rounded-full bg-amber-400/80" />
      <span className="size-2 rounded-full bg-emerald-400/80" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The pinned, Samsung-style showcase                                  */
/* ------------------------------------------------------------------ */

export function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section id="how" ref={ref} className="relative h-[380vh]">
      <div className="bg-ink sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* lime dome bleeding from the top of the dark stage */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-64"
          style={{
            background:
              "radial-gradient(55% 100% at 50% 0%, color-mix(in srgb, var(--brand) 18%, transparent) 0%, transparent 100%)",
          }}
        />

        {/* Header — static eyebrow, chapter title crossfades. Extra top
            padding on mobile so the sticky site header doesn't cover it. */}
        <div className="relative mx-auto w-full max-w-4xl px-4 pt-18 text-center sm:pt-14">
          <span className="text-sm font-semibold tracking-widest uppercase [color:var(--brand)]">
            How it works
          </span>
          <div className="relative mt-3 h-20 sm:h-24">
            {CHAPTERS.map((_, i) => (
              <ChapterTitle key={i} index={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>

        {/* Media frame — slides move through it like a carousel */}
        <div className="relative mx-auto w-full max-w-4xl min-h-0 flex-1 px-4">
          <div
            className="relative h-full overflow-hidden rounded-3xl border border-white/8"
            style={{
              background:
                "radial-gradient(95% 130% at 50% 0%, #3a4250 0%, #202633 58%, #161b25 100%)",
            }}
          >
            {/* Slide 1 — the brief */}
            <Slide index={0} progress={scrollYProgress}>
              <SlideCard>
                <WindowDots />
                <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                  Describe your product
                </p>
                <p className="mt-2.5 text-base font-medium">
                  “A time-blocking calendar for freelance designers”
                  <span className="bg-brand ml-1 inline-block h-4 w-0.5 animate-pulse align-middle" />
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    One line is enough
                  </span>
                  <span className="bg-brand inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold [color:var(--brand-foreground)]">
                    <Sparkles className="size-3.5" />
                    Generate
                  </span>
                </div>
              </SlideCard>
            </Slide>

            {/* Slide 2 — personas fan out (scaled down on phones so the
                side cards stay inside the frame) */}
            <Slide index={1} progress={scrollYProgress}>
              <div className="relative flex justify-center max-sm:scale-[0.78]">
                {[
                  { initials: "DS", hue: 150, name: "Diego", arch: "The Hands-On Doer", rot: -8, x: -150, y: 14, traits: ["practical", "visual"] },
                  { initials: "PN", hue: 330, name: "Priya", arch: "The Ambitious Skeptic", rot: 8, x: 150, y: 14, traits: ["driven", "wary"] },
                  { initials: "MK", hue: 268, name: "Maya", arch: "The Pragmatic Optimizer", rot: 0, x: 0, y: 0, traits: ["data-driven", "time-starved"] },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="absolute w-44 rounded-2xl border border-white/10 bg-white p-4 text-center text-neutral-900 shadow-2xl shadow-black/40 first:relative"
                    style={{
                      transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`,
                      zIndex: p.rot === 0 ? 2 : 1,
                    }}
                  >
                    <AvatarBlob
                      initials={p.initials}
                      hue={p.hue}
                      className="mx-auto size-11"
                    />
                    <div className="mt-2 text-sm font-semibold">{p.name}</div>
                    <div className="text-[11px] text-neutral-500">{p.arch}</div>
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {p.traits.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[9px] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Slide>

            {/* Slide 3 — the research grid */}
            <Slide index={2} progress={scrollYProgress}>
              <div className="grid grid-cols-2 gap-3">
                <SlideCard className="p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Brain className="size-3.5 text-violet-500" /> Empathy map
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-1">
                    {["Thinks", "Feels", "Says", "Does"].map((q) => (
                      <span
                        key={q}
                        className="rounded-md bg-neutral-100 px-1.5 py-1 text-center text-[9px] font-medium"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </SlideCard>
                <SlideCard className="p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Activity className="size-3.5 text-sky-500" /> Journey
                  </div>
                  <div className="mt-3 flex h-10 items-end gap-1">
                    {[45, 38, 30, 62, 78, 92].map((h, i) => (
                      <span
                        key={i}
                        className={cn(
                          "min-w-0 flex-1 rounded-t-sm",
                          h < 50 ? "bg-amber-400" : "bg-brand",
                        )}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </SlideCard>
                <SlideCard className="p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Compass className="size-3.5 text-teal-500" /> Jobs to be done
                  </div>
                  <p className="mt-2 text-[10px] leading-relaxed text-neutral-500 italic">
                    “When my week fills up, I want blocks to plan themselves…”
                  </p>
                </SlideCard>
                <SlideCard className="p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <MessageCircle className="text-brand size-3.5" /> In-character chat
                  </div>
                  <p className="mt-2 text-[10px] leading-relaxed text-neutral-500 italic">
                    “Show me the outcome and I&apos;m in.”
                  </p>
                </SlideCard>
              </div>
            </Slide>

            {/* Slide 4 — the plan + CTA */}
            <Slide index={3} progress={scrollYProgress}>
              <SlideCard>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wide uppercase">
                    Monday&apos;s plan
                  </span>
                  <span className="bg-brand-subtle text-brand flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold">
                    <Star className="size-3" /> North Star set
                  </span>
                </div>
                <ul className="mt-3.5 space-y-2 text-sm">
                  {[
                    "MoSCoW feature board",
                    "15+ backlog-ready user stories",
                    "MVP scope + success metrics",
                    "Go-to-market copy",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="bg-brand flex size-4.5 items-center justify-center rounded-full">
                        <Check className="size-3 [color:var(--brand-foreground)]" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="brand"
                  size="lg"
                  asChild
                  className="shadow-brand mt-5 w-full"
                >
                  <Link href="/studio">
                    <PenLine className="size-4" />
                    Write your first line
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </SlideCard>
            </Slide>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="relative flex items-center justify-center gap-2 pt-4 sm:pt-5">
          {CHAPTERS.map((_, i) => (
            <Dot key={i} index={i} progress={scrollYProgress} />
          ))}
        </div>

        {/* Caption */}
        <div className="relative mx-auto w-full max-w-4xl px-4 pt-3 pb-6 sm:pt-4 sm:pb-10">
          <div className="relative h-14 sm:h-12">
            {CHAPTERS.map((_, i) => (
              <ChapterCaption key={i} index={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
