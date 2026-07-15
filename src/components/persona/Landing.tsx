"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock,
  Compass,
  HelpCircle,
  Quote,
  Sparkles,
  Star,
  Target,
} from "lucide-react";

import { AvatarBlob } from "@/components/persona/AvatarBlob";
import { BentoFeatures } from "@/components/persona/BentoFeatures";
import { DotMesh } from "@/components/persona/DotMesh";
import { FeatureFilms } from "@/components/persona/FeatureFilms";
import { HeroFlow } from "@/components/persona/HeroFlow";
import { ScrollStory } from "@/components/persona/ScrollStory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SAMPLE_PERSONA } from "@/lib/sample";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
      <span className="text-brand text-sm font-semibold tracking-wide uppercase">
        {eyebrow}
      </span>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-balance">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

const ARTIFACT_TICKER = [
  "Personas",
  "Empathy maps",
  "Journey maps",
  "Jobs-to-be-done",
  "Opportunity areas",
  "MoSCoW board",
  "User stories",
  "MVP scope",
  "Success metrics",
  "Go-to-market",
  "UX direction",
];

const PROBLEM_POINTS = [
  {
    icon: Clock,
    text: "Real user research takes weeks of recruiting, interviews, and synthesis.",
  },
  {
    icon: Banknote,
    text: "Agencies and research panels cost thousands before the first insight lands.",
  },
  {
    icon: HelpCircle,
    text: (
      <>
        So teams guess — and{" "}
        <strong className="font-semibold">
          ship features nobody actually asked for.
        </strong>
      </>
    ),
  },
];

/** The people you're building for, as long as nobody's done the research. */
const UNKNOWN_USERS = [
  { initials: "?", hue: 220, name: "Early adopter?", detail: "Goals: unknown", chip: "Never interviewed", x: "sm:ml-16" },
  { initials: "?", hue: 330, name: "Power user?", detail: "Frustrations: unknown", chip: "No data", x: "sm:ml-0" },
  { initials: "?", hue: 150, name: "Decision maker?", detail: "Objections: unknown", chip: "Assumed", x: "sm:ml-24" },
  { initials: "?", hue: 40, name: "Churn risk?", detail: "Jobs to be done: unknown", chip: "Guessing", x: "sm:ml-8" },
];

/** Figma-style multiplayer cursor with a name tag, drifting on a loop. */
function CanvasCursor({
  name,
  color,
  className,
  duration,
  delay = 0,
}: {
  name: string;
  color: string;
  className?: string;
  duration: number;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ x: [0, 26, -16, 0], y: [0, -18, 12, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      className={cn("pointer-events-none absolute hidden sm:block", className)}
    >
      <svg width="19" height="19" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M2 1.5L15.5 8.2L9.2 9.9L6.4 15.9L2 1.5Z"
          fill={color}
          stroke="white"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{ backgroundColor: color }}
        className="ml-3.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-white shadow-md"
      >
        {name}
      </span>
    </motion.div>
  );
}

/**
 * Official Product Hunt embed badge (light + dark theme variants).
 * The widget live-updates the upvote count once the launch goes live.
 */
function ProductHuntBadge({ compact }: { compact?: boolean }) {
  const alt =
    "Fouxium - Build products people actually want | Product Hunt";
  const widget = (theme: "light" | "dark") =>
    `https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=fouxium&theme=${theme}`;
  const imgClass = cn(
    "w-auto max-w-full",
    compact ? "h-10" : "h-[54px]",
  );
  return (
    <a
      href="https://www.producthunt.com/posts/fouxium?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-fouxium"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block transition-transform hover:-translate-y-0.5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- official Product Hunt widget */}
      <img
        src={widget("light")}
        alt={alt}
        width={250}
        height={54}
        className={cn(imgClass, "dark:hidden")}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- official Product Hunt widget */}
      <img
        src={widget("dark")}
        alt={alt}
        width={250}
        height={54}
        className={cn(imgClass, "hidden dark:block")}
      />
    </a>
  );
}

const TESTIMONIALS = [
  {
    name: "Elena Fischer",
    role: "Product Designer",
    hue: 268,
    quote:
      "I mocked up an entire research readout in an afternoon. The journey timeline alone sold my PM.",
  },
  {
    name: "Marcus Reyes",
    role: "Founder, seed-stage SaaS",
    hue: 190,
    quote:
      "It's the fastest way I've found to pressure-test who we're actually building for. The exports are gorgeous.",
  },
  {
    name: "Priya Nair",
    role: "Growth Marketer",
    hue: 330,
    quote:
      "The recommendations read like they came from a senior strategist. I use it before every campaign brief.",
  },
];

const FAQS = [
  {
    q: "What's in a research package?",
    a: "For each project you get personas (with empathy maps, journeys, and jobs-to-be-done), plus opportunity areas, a feature-prioritization board, 15+ user stories, and product, marketing, and design recommendations — all in one workspace you can chat with and export.",
  },
  {
    q: "Do I need an API key?",
    a: "No. Fouxium works instantly with a built-in engine — every artifact and even the persona chat has a grounded local fallback. Add an ANTHROPIC_API_KEY to generate richer personas and chat responses with Claude.",
  },
  {
    q: "Can I really talk to my personas?",
    a: "Yes. Every persona has a chat where they answer in character — pressure-test pricing, features, onboarding, and objections before you build.",
  },
  {
    q: "Where is my work stored?",
    a: "Entirely in your browser's local storage. Save, favorite, duplicate, and search projects — with no account and no server database. Your data never leaves your device.",
  },
  {
    q: "What can I export?",
    a: "The whole package as PDF, PNG, Markdown, or JSON — or copy Markdown/JSON to your clipboard. Individual personas export the same way.",
  },
];

function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.04 }}
      className="border-border/70 border-b"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-medium">{q}</span>
        <ChevronDown
          className={cn(
            "text-muted-foreground size-4 shrink-0 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-muted-foreground pb-4 text-sm leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Landing() {
  return (
    <main className="relative">
      {/* Hero — dark stage: constellation dots connecting behind the flow.
          The `dark` class flips the token set for this subtree only, so the
          nested cards/inputs restyle themselves while the rest of the page
          stays light. */}
      {/* -mt-17 slides the hero up behind the sticky pill nav (12px offset +
          56px pill) so the black stage runs edge-to-edge to the top. */}
      <section className="dark bg-ink text-foreground relative -mt-17 overflow-hidden">
        {/* connecting-dots animation, fading out toward the next section */}
        <DotMesh className="opacity-80 [mask-image:linear-gradient(180deg,#000_0%,#000_70%,transparent_100%)]" />

        {/* Canvas decorations — the research file is already open */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          {/* plus marks, like an infinite canvas */}
          {[
            "top-[16%] left-[7%]",
            "top-[58%] left-[4%]",
            "top-[12%] right-[9%]",
            "top-[46%] right-[5%]",
            "bottom-[14%] right-[22%]",
          ].map((pos) => (
            <span
              key={pos}
              className={cn(
                "text-ink/12 dark:text-white/12 absolute text-2xl font-light select-none",
                pos,
              )}
            >
              +
            </span>
          ))}

          {/* brand ring + dot for a splash of accent */}
          <span className="border-brand/50 absolute top-[14%] right-[7%] size-16 rounded-full border-2" />
          <span className="bg-brand absolute bottom-[24%] left-[18%] size-2.5 rounded-full" />
        </div>

        {/* drifting collaborator cursors */}
        <CanvasCursor
          name="Fouxium"
          color="#3a9e21"
          duration={12}
          className="top-[62%] left-[13%] hidden lg:block"
        />
        <CanvasCursor
          name="You"
          color="#a855f7"
          duration={10}
          delay={0.8}
          className="top-[34%] right-[9%] hidden lg:block"
        />

        <div className="relative mx-auto max-w-6xl px-4 pt-32 pb-16 text-center sm:pt-40">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="https://www.producthunt.com/posts/fouxium?utm_source=hero-badge&utm_medium=badge"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 py-1 pr-3.5 pl-1 text-[13px] text-white shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-0.5"
            >
              <span className="rounded-full bg-white/12 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white/70 uppercase">
                Recent
              </span>
              <span className="font-medium">
                We just launched on Product Hunt
              </span>
            </a>
            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              The fastest way to validate your next product.
            </h1>
            <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg text-balance">
              Turn a simple product idea into complete UX research and product
              strategy in minutes using AI.
            </p>

            {/* Rating / trust row */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-1.5">
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </span>
                <span className="text-sm font-medium">4.9</span>
              </span>
              <span className="text-muted-foreground text-sm">
                Loved by designers, PMs &amp; founders
              </span>
            </div>
          </motion.div>

          {/* Direct input flow — steps unlock as you go */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10"
          >
            <HeroFlow />
            <div className="text-muted-foreground mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm">
              {["No sign-up", "Works instantly", "Private to your browser"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <Check className="text-positive size-4" />
                    {item}
                  </span>
                ),
              )}
            </div>
            <a
              href="#example"
              className="text-muted-foreground hover:text-foreground mt-4 inline-block text-sm underline underline-offset-4"
            >
              See Demo
            </a>
            <div className="mt-6 flex justify-center">
              <ProductHuntBadge />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Artifact ticker — a dark tape strip cycling every UX term */}
      <section className="bg-ink relative overflow-hidden">
        {/* brand sheen sweeping across the strip */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--brand) 14%, transparent) 50%, transparent 100%)",
          }}
        />
        <div
          className="relative overflow-hidden py-4"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
          }}
        >
          <div className="animate-marquee flex w-max items-center">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center">
                {ARTIFACT_TICKER.map((a) => (
                  <span
                    key={`${copy}-${a}`}
                    className="flex items-center gap-4 pr-4 text-sm font-semibold tracking-widest whitespace-nowrap text-white/75 uppercase"
                  >
                    {a}
                    <span className="bg-brand size-1.5 rounded-full" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The problem — who are you actually building for? */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <Badge variant="secondary" className="mb-4 gap-1.5 font-normal">
              <AlertTriangle className="size-3.5 text-amber-500" />
              The problem
            </Badge>
            <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              It&apos;s hard to know who you&apos;re really building for
            </h2>
            <div className="mt-8 space-y-3">
              {PROBLEM_POINTS.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 + i * 0.08 }}
                  className="border-border/70 bg-card flex items-start gap-3 rounded-xl border px-4 py-3.5"
                >
                  <span className="bg-muted text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg">
                    <p.icon className="size-4" />
                  </span>
                  <p className="text-sm leading-relaxed">{p.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* The cast you've never met — persona cards full of question marks */}
          <div className="relative">
            <div
              aria-hidden
              className="bg-brand absolute -inset-6 -z-10 rounded-[2rem] opacity-[0.07] blur-3xl"
            />
            <div className="flex flex-col gap-3">
              {UNKNOWN_USERS.map((u, i) => (
                <motion.div
                  key={u.name}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.1 + i * 0.09 }}
                  className={cn(
                    "glass-card flex w-full max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg",
                    u.x,
                  )}
                >
                  <AvatarBlob initials={u.initials} hue={u.hue} className="size-10 shrink-0 opacity-70" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{u.name}</div>
                    <div className="text-muted-foreground truncate text-xs">
                      {u.detail}
                    </div>
                  </div>
                  <span className="bg-muted text-muted-foreground shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium">
                    {u.chip}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* See it in action — a short demo film per feature */}
      <FeatureFilms />

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to know your users"
          subtitle="Not just names and ages — the depth a real research artifact needs."
        />
        <BentoFeatures />
      </section>

      {/* How it works — pinned scrollytelling narrative */}
      <ScrollStory />

      {/* Example — compact teaser that opens the full package in the Studio */}
      <section id="example" className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading
          eyebrow="Live example"
          title="A taste of the package"
          subtitle="Meet Maya — one persona from a full 11-artifact research package."
        />
        <motion.div {...fadeUp} className="relative mx-auto mt-12 max-w-3xl">
          <div className="bg-brand absolute -inset-4 -z-10 rounded-[2rem] opacity-10 blur-3xl" />
          <div className="glass-card overflow-hidden rounded-3xl border">
            {/* Persona snapshot */}
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:p-8">
              <AvatarBlob
                initials={SAMPLE_PERSONA.avatar.initials}
                hue={SAMPLE_PERSONA.avatar.hue}
                className="size-16 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold">{SAMPLE_PERSONA.name}</h3>
                  <Badge variant="secondary" className="font-normal">
                    {SAMPLE_PERSONA.archetype}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2 text-sm italic">
                  “{SAMPLE_PERSONA.quote}”
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {SAMPLE_PERSONA.traits.map((t) => (
                    <span
                      key={t}
                      className="bg-muted rounded-full px-2.5 py-0.5 text-xs font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="border-border/60 divide-border/60 grid grid-cols-3 divide-x border-t text-center">
              {[
                { v: `${SAMPLE_PERSONA.techProficiency}%`, l: "Tech proficiency" },
                { v: SAMPLE_PERSONA.journey.length, l: "Journey stages" },
                { v: SAMPLE_PERSONA.jtbd.length, l: "Jobs to be done" },
              ].map((s) => (
                <div key={s.l} className="px-2 py-4">
                  <div className="text-brand text-xl font-bold tabular-nums">
                    {s.v}
                  </div>
                  <div className="text-muted-foreground text-xs">{s.l}</div>
                </div>
              ))}
            </div>

            {/* What's behind the fold — faded chips leading to the Studio */}
            <div className="border-border/60 relative border-t p-6 pb-8 sm:px-8">
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Empathy map",
                  "Journey map",
                  "Jobs to be done",
                  "Opportunities",
                  "MoSCoW board",
                  "15+ user stories",
                  "MVP scope",
                  "Success metrics",
                  "Go-to-market",
                  "UX direction",
                  "Persona chat",
                ].map((a, i) => (
                  <span
                    key={a}
                    className="border-border/70 bg-card rounded-full border px-2.5 py-1 text-xs font-medium"
                    style={{ opacity: Math.max(0.25, 1 - i * 0.08) }}
                  >
                    {a}
                  </span>
                ))}
              </div>
              {/* fade into the CTA */}
              <div className="from-background/95 pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent" />
              <div className="relative mt-2 flex justify-center">
                <Button variant="brand" size="lg" asChild className="shadow-brand">
                  <Link href="/studio?example=1">
                    Open the full example in Studio
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border/60 bg-muted/25">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHeading eyebrow="Loved by builders" title="What people say" />
          <div className="mt-12 grid gap-4 lg:grid-cols-5">
            {/* Featured quote */}
            <motion.figure
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              className="glass-card relative flex flex-col justify-between overflow-hidden rounded-3xl border p-8 lg:col-span-3"
            >
              <Quote className="text-brand/15 absolute -top-2 right-4 size-24 rotate-180" />
              <div className="relative">
                <div className="mb-5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-xl leading-snug font-medium text-balance sm:text-2xl">
                  “{TESTIMONIALS[0].quote}”
                </blockquote>
              </div>
              <figcaption className="relative mt-8 flex items-center gap-3">
                <AvatarBlob
                  initials={TESTIMONIALS[0].name.split(" ").map((n) => n[0]).join("")}
                  hue={TESTIMONIALS[0].hue}
                  className="size-11"
                />
                <div>
                  <div className="font-medium">{TESTIMONIALS[0].name}</div>
                  <div className="text-muted-foreground text-sm">
                    {TESTIMONIALS[0].role}
                  </div>
                </div>
              </figcaption>
            </motion.figure>

            {/* Compact stack */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              {TESTIMONIALS.slice(1).map((t, i) => (
                <motion.figure
                  key={t.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: 0.08 + i * 0.08 }}
                  className="glass-card flex flex-1 flex-col rounded-2xl border p-6"
                >
                  <figcaption className="flex items-center gap-3">
                    <AvatarBlob
                      initials={t.name.split(" ").map((n) => n[0]).join("")}
                      hue={t.hue}
                      className="size-9"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-muted-foreground text-xs">{t.role}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="size-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </figcaption>
                  <blockquote className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                </motion.figure>
              ))}
            </div>
          </div>
          <motion.p
            {...fadeUp}
            className="text-muted-foreground mt-8 text-center text-sm"
          >
            <span className="text-foreground font-semibold">4.9/5</span> average
            across <span className="text-foreground font-semibold">1,200+</span>{" "}
            research packages generated
          </motion.p>
        </div>
      </section>

      {/* Free consultation — for the hesitant */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <motion.div
          {...fadeUp}
          className="glass-card relative overflow-hidden rounded-[2rem] border"
        >
          {/* soft brand wash + canvas dots */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 120% at 100% 0%, color-mix(in srgb, var(--brand) 16%, transparent) 0%, transparent 60%)",
            }}
          />
          <CanvasCursor
            name="Azaz"
            color="#0ea5e9"
            duration={9}
            className="top-[18%] right-[8%]"
          />
          <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto]">
            <div>
              <Badge variant="secondary" className="mb-4 gap-1.5 font-normal">
                <CalendarCheck className="text-brand size-3.5" />
                Free · 30 minutes · a real human
              </Badge>
              <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Still on the fence? Talk it through with a UX pro — free.
              </h2>
              <p className="text-muted-foreground mt-3 max-w-lg text-balance">
                Generate your package, then bring it to a free 30-minute
                consultation. Pressure-test the personas, sharpen the MVP cut,
                and leave with next steps — no pitch, no card, no obligation.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button variant="brand" size="lg" asChild className="shadow-brand">
                  <Link href="/consult">
                    Book a free consultation
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <span className="text-muted-foreground text-sm">
                  Usually booked within a day
                </span>
              </div>
            </div>
            <div className="hidden lg:block">
              {/* Booking illustration — calendar with a claimed slot */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-60"
              >
                <svg viewBox="0 0 240 210" fill="none" className="w-full" aria-hidden>
                  {/* backdrop ring */}
                  <circle cx="196" cy="38" r="26" stroke="var(--brand)" strokeOpacity="0.45" strokeWidth="3" />
                  {/* calendar sheet */}
                  <rect x="28" y="34" width="160" height="148" rx="18" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
                  <path d="M28 52c0-9.9 8.1-18 18-18h124c9.9 0 18 8.1 18 18v18H28V52Z" fill="var(--brand)" />
                  <rect x="62" y="24" width="8" height="22" rx="4" fill="var(--ink)" />
                  <rect x="146" y="24" width="8" height="22" rx="4" fill="var(--ink)" />
                  {/* day grid */}
                  {[0, 1, 2].map((row) =>
                    [0, 1, 2, 3].map((col) => {
                      const claimed = row === 1 && col === 2;
                      return (
                        <rect
                          key={`${row}-${col}`}
                          x={48 + col * 32}
                          y={86 + row * 30}
                          width="22"
                          height="20"
                          rx="6"
                          fill={claimed ? "var(--brand)" : "var(--muted)"}
                        />
                      );
                    }),
                  )}
                  {/* check on the claimed slot — white on brand green */}
                  <path
                    d="m117 124 4 4 8-8"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* spark */}
                  <path
                    d="M206 130c1.8 7.4 4.6 10.2 12 12-7.4 1.8-10.2 4.6-12 12-1.8-7.4-4.6-10.2-12-12 7.4-1.8 10.2-4.6 12-12Z"
                    fill="var(--brand)"
                  />
                </svg>
                {/* floating chat bubble */}
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 5, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-ink absolute -bottom-2 -left-6 rounded-2xl rounded-bl-sm px-3 py-2 text-xs font-medium text-white shadow-lg"
                >
                  30 min · free
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <div className="mt-10">
          {FAQS.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} i={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <motion.div
          {...fadeUp}
          className="bg-ink relative overflow-hidden rounded-[2rem] px-6 py-20 text-center"
        >
          {/* Optivus-style brand dome glowing from the top of the panel */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-72"
            style={{
              background:
                "radial-gradient(55% 100% at 50% 0%, color-mix(in srgb, var(--brand) 42%, transparent) 0%, transparent 100%)",
            }}
          />
          {/* Figma-style canvas dot grid */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
              maskImage:
                "radial-gradient(80% 80% at 50% 45%, transparent 30%, #000 100%)",
              WebkitMaskImage:
                "radial-gradient(80% 80% at 50% 45%, transparent 30%, #000 100%)",
            }}
          />

          {/* Multiplayer cursors — the personas are on the canvas */}
          <CanvasCursor
            name="Maya"
            color="#a855f7"
            duration={9}
            className="top-[22%] left-[12%]"
          />
          <CanvasCursor
            name="Diego"
            color="#2dd4bf"
            duration={11}
            delay={1.2}
            className="top-[58%] right-[10%]"
          />
          <CanvasCursor
            name="Priya"
            color="#fb7185"
            duration={10}
            delay={0.6}
            className="bottom-[16%] left-[20%]"
          />

          {/* Figma-style comment pin */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[13%] right-[6%] hidden items-center gap-2 rounded-2xl rounded-bl-sm bg-white px-3 py-2 shadow-xl shadow-black/30 lg:flex"
          >
            <AvatarBlob initials="MK" hue={268} className="size-6" />
            <span className="text-xs font-medium text-neutral-800">
              Can we ship this by Monday?
            </span>
          </motion.div>

          <div className="relative">
            <Badge className="border-white/15 bg-white/10 mb-5 gap-1.5 px-3 py-1 text-[13px] text-white backdrop-blur-sm">
              <Sparkles className="size-3.5 [color:var(--brand-2)]" />
              Free · No sign-up
            </Badge>
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance text-white sm:text-5xl">
              Ready to meet{" "}
              <span className="relative inline-block [color:var(--brand-2)]">
                your users?
                {/* Figma selection box with corner handles + layer tag.
                    Hidden on mobile where the headline wraps and the tag
                    would collide with the first line. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-x-3 -inset-y-1.5 hidden border-2 [border-color:color-mix(in_srgb,var(--brand-2)_75%,transparent)] sm:block"
                >
                  {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map(
                    (pos) => (
                      <span
                        key={pos}
                        className={cn(
                          "absolute size-2 border-2 bg-white [border-color:var(--brand-2)]",
                          pos,
                        )}
                      />
                    ),
                  )}
                  <span className="bg-brand absolute -top-6 left-0 rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-normal [color:var(--brand-foreground)]">
                    audience
                  </span>
                </span>
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-balance text-white/70">
              Generate your first research package in under a minute — personas,
              maps, stories, and the plan.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                variant="brand"
                asChild
                className="shadow-brand"
              >
                <Link href="/studio">
                  Start free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <a href="#example">See an example</a>
              </Button>
            </div>
            <p className="mt-6 text-xs tracking-wide text-white/45 uppercase">
              11 artifacts · chat with personas · export everything
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                Fou<span className="text-brand">x</span>ium
              </span>
              <Badge variant="secondary" className="font-normal">
                <Target className="size-3" />
                UX research copilot
              </Badge>
            </div>
            <nav className="text-muted-foreground flex items-center gap-5 text-sm">
              <a href="#features" className="hover:text-foreground">
                Features
              </a>
              <a href="#how" className="hover:text-foreground">
                How it works
              </a>
              <a href="#faq" className="hover:text-foreground">
                FAQ
              </a>
              <Link href="/studio" className="hover:text-foreground">
                Studio
              </Link>
            </nav>
          </div>
          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-muted-foreground/70 flex items-center gap-1.5 text-xs">
              <Compass className="size-3.5" />
              Built with Next.js, Tailwind CSS, shadcn/ui, Framer Motion &amp;
              Claude.
            </p>
            <ProductHuntBadge compact />
          </div>
        </div>
      </footer>
    </main>
  );
}
