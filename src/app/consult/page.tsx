"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  CheckCheck,
  MessageCircle,
  Mic,
  PhoneOff,
  Play,
  Radar,
  Target,
  UserRound,
  Video,
  Wrench,
} from "lucide-react";

import { AvatarBlob } from "@/components/persona/AvatarBlob";
import { SiteHeader } from "@/components/persona/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONSULT_URL } from "@/lib/site";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

/* ------------------------------------------------------------------ */
/* The story — a messenger window where the consultation begins         */
/* ------------------------------------------------------------------ */

const bubbleIn = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/** Your message — lime bubble, right-aligned, optional read receipt. */
function YouBubble({ children, seen }: { children: React.ReactNode; seen?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={bubbleIn}
      className="flex flex-col items-end"
    >
      <div className="bg-brand max-w-[80%] rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed [color:var(--brand-foreground)]">
        {children}
      </div>
      {seen && (
        <span className="mt-1.5 flex items-center gap-1 text-[11px] text-white/40">
          <CheckCheck className="size-3.5 [color:var(--brand)]" />
          Seen just now
        </span>
      )}
    </motion.div>
  );
}

/** Azaz's message — typing dots that resolve into the reply. */
function AzazBubble({
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={bubbleIn}
      className="flex items-end gap-2.5"
    >
      <AvatarBlob initials="AZ" hue={205} className="mb-0.5 size-8 shrink-0" />
      <div
        className={
          wide
            ? "relative w-full max-w-[88%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3 text-sm leading-relaxed text-white/90"
            : "relative max-w-[80%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3 text-sm leading-relaxed text-white/90"
        }
      >
        {/* reply fades in after the dots */}
        <motion.span
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: [0, 0, 1], transition: { duration: 1.5, times: [0, 0.65, 1] } },
          }}
          className="block"
        >
          {children}
        </motion.span>
        {/* typing dots, visible first */}
        <motion.span
          aria-hidden
          variants={{
            hidden: { opacity: 1 },
            show: { opacity: [1, 1, 0], transition: { duration: 1.5, times: [0, 0.6, 1] } },
          }}
          className="absolute top-1/2 left-4 flex -translate-y-1/2 gap-1"
        >
          {[0, 0.15, 0.3].map((d) => (
            <motion.span
              key={d}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.9, delay: d, repeat: 2 }}
              className="size-1.5 rounded-full bg-white/70"
            />
          ))}
        </motion.span>
      </div>
    </motion.div>
  );
}

/** The other side of the story — a warm video-call scene. */
function ConsultScene() {
  return (
    <div aria-hidden className="relative mx-auto hidden w-full max-w-sm lg:block">
      {/* soft lime blob behind everything */}
      <svg
        viewBox="0 0 400 400"
        className="absolute -top-10 -left-8 w-[115%] opacity-60"
        fill="none"
      >
        <path
          d="M196 22c74-12 158 30 176 96 18 67-32 128-92 162-61 35-141 44-192 2C37 240 22 158 56 100 89 43 122 34 196 22Z"
          fill="color-mix(in srgb, var(--brand) 26%, transparent)"
        />
      </svg>

      {/* the call window */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="glass-card relative rounded-3xl border p-4 shadow-2xl shadow-black/10"
      >
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-rose-400/80" />
          <span className="size-2 rounded-full bg-amber-400/80" />
          <span className="size-2 rounded-full bg-emerald-400/80" />
        </div>
        <div className="bg-ink relative mt-3 flex h-48 flex-col items-center justify-center overflow-hidden rounded-2xl">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-20"
            style={{
              background:
                "radial-gradient(60% 100% at 50% 0%, color-mix(in srgb, var(--brand) 20%, transparent) 0%, transparent 100%)",
            }}
          />
          <AvatarBlob initials="AZ" hue={205} className="size-16" />
          <div className="mt-2 text-sm font-semibold text-white">Azaz</div>
          {/* speaking waveform */}
          <span className="mt-2 flex h-4 items-center gap-[3px]">
            {[6, 12, 9, 15, 8, 13, 6].map((h, i) => (
              <motion.span
                key={i}
                animate={{ scaleY: [0.4, 1, 0.4] }}
                transition={{ duration: 1, delay: i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                style={{ height: h }}
                className="bg-brand w-[3px] rounded-full"
              />
            ))}
          </span>
          {/* self view */}
          <span className="absolute right-2.5 bottom-2.5 rounded-lg bg-white/12 px-2.5 py-1.5 text-[10px] font-medium text-white/80">
            You
          </span>
        </div>
        {/* call controls */}
        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full">
            <Mic className="size-4" />
          </span>
          <span className="flex size-9 items-center justify-center rounded-full bg-rose-500 text-white">
            <PhoneOff className="size-4" />
          </span>
          <span className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full">
            <Video className="size-4" />
          </span>
        </div>
      </motion.div>

      {/* sticky note */}
      <motion.div
        animate={{ y: [0, -7, 0], rotate: [-7, -5, -7] }}
        transition={{ duration: 6, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-7 -left-10 w-36 rounded-md bg-amber-200 p-3 text-xs leading-snug font-medium text-amber-950 shadow-lg"
      >
        “which persona actually pays?”
      </motion.div>

      {/* outcome chip */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [3, 4.5, 3] }}
        transition={{ duration: 7, delay: 1.2, repeat: Infinity, ease: "easeInOut" }}
        className="glass-card absolute -right-8 -bottom-5 flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium shadow-lg"
      >
        <span className="bg-brand flex size-4 items-center justify-center rounded-full">
          <Check className="size-3 [color:var(--brand-foreground)]" />
        </span>
        Monday-ready next steps
      </motion.div>

      {/* squiggle from the sticky note to the call */}
      <svg
        viewBox="0 0 120 90"
        className="absolute top-16 -left-14 w-24"
        fill="none"
      >
        <path
          d="M8 8c34 6 62 18 78 44 6 10 10 18 12 30m0 0-12-12m12 12 6-16"
          stroke="var(--brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 7"
        />
      </svg>
    </div>
  );
}

/** A voice note from Azaz with a living waveform. */
function VoiceNote() {
  const bars = [8, 14, 10, 18, 12, 20, 9, 16, 11, 19, 13, 8, 15, 10];
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={bubbleIn}
      className="flex items-end gap-2.5"
    >
      <AvatarBlob initials="AZ" hue={205} className="mb-0.5 size-8 shrink-0" />
      <div className="flex items-center gap-3 rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3">
        <span className="bg-brand flex size-7 shrink-0 items-center justify-center rounded-full">
          <Play className="ml-0.5 size-3.5 fill-current [color:var(--brand-foreground)]" />
        </span>
        <span className="flex h-6 items-center gap-[3px]">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              animate={{ scaleY: [0.5, 1, 0.5] }}
              transition={{ duration: 1.1, delay: i * 0.08, repeat: Infinity, ease: "easeInOut" }}
              style={{ height: h }}
              className="w-[3px] rounded-full bg-white/70"
            />
          ))}
        </span>
        <span className="text-xs text-white/50">0:12</span>
      </div>
    </motion.div>
  );
}

/** The four takeaways, as numbered deliverable cards. */
const OUTCOMES = [
  {
    icon: Radar,
    title: "A pro's read",
    desc: "On your personas, priorities, and what to actually trust.",
  },
  {
    icon: Target,
    title: "Risks, ranked",
    desc: "The two or three issues worth fixing before anything else.",
  },
  {
    icon: Wrench,
    title: "MVP sanity-check",
    desc: "What to cut, what to keep, and what can wait.",
  },
  {
    icon: CalendarCheck,
    title: "Monday-ready steps",
    desc: "Concrete next actions you can start immediately.",
  },
];

/** Things people actually say before booking — shown as speech bubbles. */
const SOUNDS_LIKE = [
  "I generated the package… but I'm not sure how much of it to trust.",
  "We keep debating what to cut before we build.",
  "My team can't agree on who the user actually is.",
  "I just want a second pair of eyes before the pitch.",
];

export default function ConsultPage() {
  return (
    <>
      <SiteHeader variant="marketing" />
      <main className="relative">
        {/* Hero */}
        <section className="hero-dome relative overflow-hidden">
          <div className="relative mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:pt-20">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-ink mb-6 gap-1.5 border-transparent px-3 py-1 text-[13px] text-white">
                <UserRound className="size-3.5 [color:var(--brand)]" />
                Free UX consultation
              </Badge>
              <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
                Research is generated.{" "}
                <span className="bg-brand rounded-xl px-2 [color:var(--brand-foreground)]">
                  Judgment
                </span>{" "}
                is human.
              </h1>
              <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-lg text-balance">
                Book a free 30-minute session and walk through your research
                package with a UX professional — no card, no pitch.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button variant="brand" size="lg" asChild className="shadow-brand">
                  <a href={CONSULT_URL} target="_blank" rel="noopener noreferrer">
                    <CalendarCheck className="size-4" />
                    Book your free session
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <span className="text-muted-foreground text-sm">
                  30 min · Google Meet · genuinely free
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The story — messenger on one side, the human scene on the other */}
        <section className="mx-auto max-w-6xl px-4 py-14">
          <motion.div {...fadeUp} className="mb-10 text-center">
            <span className="text-brand text-sm font-semibold tracking-widest uppercase">
              The story
            </span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Every consultation starts like this
            </h2>
          </motion.div>

          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            {...fadeUp}
            className="bg-ink relative overflow-hidden rounded-[1.75rem] shadow-2xl shadow-black/25"
          >
            {/* canvas dots + lime glow inside the window */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-40"
              style={{
                background:
                  "radial-gradient(60% 100% at 50% 0%, color-mix(in srgb, var(--brand) 16%, transparent) 0%, transparent 100%)",
              }}
            />

            {/* contact header */}
            <div className="relative flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <div className="relative">
                <AvatarBlob initials="AZ" hue={205} className="size-10" />
                <span className="bg-positive border-ink absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white">Azaz</div>
                <div className="text-xs text-white/50">
                  UX consultant · online now
                </div>
              </div>
              <span className="bg-brand rounded-full px-2.5 py-1 text-[11px] font-bold [color:var(--brand-foreground)]">
                FREE · 30 MIN
              </span>
            </div>

            {/* thread */}
            <div className="relative space-y-4 px-5 py-7 sm:px-7">
              <div className="flex justify-center">
                <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] text-white/45">
                  Today · 9:41
                </span>
              </div>

              <YouBubble>
                Theaix just generated my whole research package — personas,
                journeys, the plan. It looks great… but how much of it should I
                trust?
              </YouBubble>

              <AzazBubble>
                The draft is the easy part. The real questions: which persona
                actually pays? Which “must-have” is quietly a distraction?
              </AzazBubble>

              <YouBubble>That&apos;s exactly where I&apos;m stuck.</YouBubble>

              <VoiceNote />

              <AzazBubble>
                Bring the package. In 30 minutes we&apos;ll pressure-test the
                personas, sharpen your MVP cut, and you&apos;ll leave with next
                steps you can act on Monday.
              </AzazBubble>

              <YouBubble seen>And what does that cost me?</YouBubble>

              <AzazBubble>
                Nothing — genuinely free. No pitch, no card, no obligation.
              </AzazBubble>
            </div>
          </motion.div>

          {/* The human side of the call */}
          <ConsultScene />
          </div>

          {/* Your invite — deliberately its own thing, outside the chat */}
          <motion.div {...fadeUp} className="mx-auto mt-14 max-w-xl">
            <p className="text-muted-foreground mb-3 text-center text-xs font-semibold tracking-widest uppercase">
              Your invite
            </p>
            <div className="glass-card flex flex-col items-stretch overflow-hidden rounded-2xl border shadow-xl shadow-black/5 sm:flex-row">
              <div className="bg-brand flex items-center justify-center px-6 py-4">
                <CalendarCheck className="size-7 [color:var(--brand-foreground)]" />
              </div>
              <div className="border-border/70 flex flex-1 flex-col items-start justify-between gap-4 border-t border-dashed p-5 sm:flex-row sm:items-center sm:border-t-0 sm:border-l">
                <div>
                  <div className="font-semibold">UX Consultation — 30 min</div>
                  <div className="text-muted-foreground text-sm">
                    Google Meet · Free · pick any slot
                  </div>
                </div>
                <Button variant="brand" asChild className="shadow-brand shrink-0">
                  <a href="#book">
                    Book a slot
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Takeaways + "sounds like you?" */}
        <section className="border-y border-border/60 bg-muted/25">
          <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-16">
            {/* Left — numbered deliverable cards */}
            <div>
              <motion.h2 {...fadeUp} className="flex items-center gap-2.5 text-xl font-semibold tracking-tight">
                <span className="bg-brand flex size-8 items-center justify-center rounded-lg">
                  <Check className="size-4.5 [color:var(--brand-foreground)]" />
                </span>
                What you leave with
              </motion.h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {OUTCOMES.map((o, i) => (
                  <motion.div
                    key={o.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.07 }}
                    className="glass-card hover:border-brand/40 rounded-2xl border p-4 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-brand-subtle text-brand flex size-9 items-center justify-center rounded-xl">
                        <o.icon className="size-4.5" />
                      </span>
                      <span className="text-muted-foreground/50 font-mono text-xs">
                        0{i + 1}
                      </span>
                    </div>
                    <div className="mt-3 text-sm font-semibold">{o.title}</div>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      {o.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right — the thoughts that bring people here */}
            <div>
              <motion.h2 {...fadeUp} className="flex items-center gap-2.5 text-xl font-semibold tracking-tight">
                <span className="bg-ink dark:bg-white flex size-8 items-center justify-center rounded-lg">
                  <MessageCircle className="dark:text-ink size-4.5 text-white" />
                </span>
                Sounds like you?
              </motion.h2>
              <div className="mt-6 space-y-3.5">
                {SOUNDS_LIKE.map((q, i) => (
                  <motion.div
                    key={q}
                    initial={{ opacity: 0, y: 14, rotate: 0 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      rotate: i % 2 === 0 ? -1.2 : 1.2,
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.09 }}
                    className={
                      i % 2 === 0
                        ? "glass-card max-w-[88%] rounded-2xl rounded-bl-sm border px-4 py-3 text-sm italic"
                        : "bg-ink dark:bg-white dark:text-ink ml-auto max-w-[88%] rounded-2xl rounded-br-sm px-4 py-3 text-sm text-white italic"
                    }
                  >
                    “{q}”
                  </motion.div>
                ))}
              </div>
              <motion.p {...fadeUp} className="text-muted-foreground mt-6 text-sm">
                If any of these sound familiar, the 30 minutes will pay for
                themselves.{" "}
                <a
                  href="#book"
                  className="text-brand font-medium underline underline-offset-4"
                >
                  Book the call →
                </a>
              </motion.p>
            </div>
          </div>
        </section>

        {/* Booking */}
        <section id="book" className="mx-auto max-w-4xl px-4 py-16">
          <motion.div {...fadeUp} className="text-center">
            <div className="mb-5 flex items-center justify-center gap-3">
              <AvatarBlob initials="AZ" hue={205} className="size-12" />
              <div className="text-left">
                <div className="font-semibold">Azaz</div>
                <div className="text-muted-foreground text-sm">
                  UX professional · your consultant
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Pick a slot that suits you
            </h2>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-balance text-sm">
              Booking happens on Cal.com — pick a time below, or open it in a
              new tab.
            </p>
          </motion.div>
          <motion.div
            {...fadeUp}
            className="glass-card mt-8 overflow-hidden rounded-3xl border"
          >
            <iframe
              src={CONSULT_URL}
              title="Book a free UX consultation"
              className="h-[640px] w-full"
              loading="lazy"
            />
          </motion.div>
          <div className="mt-5 text-center">
            <Button variant="outline" asChild>
              <a href={CONSULT_URL} target="_blank" rel="noopener noreferrer">
                Open booking in a new tab
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </section>

        <footer className="border-t border-border/60">
          <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs sm:flex-row">
            <span>Theaix — your product research copilot.</span>
            <Link href="/pricing" className="hover:text-foreground">
              Prefer self-serve? See plans →
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
