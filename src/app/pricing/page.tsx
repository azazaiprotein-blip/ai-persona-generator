"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  MessageCircle,
  PenLine,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/persona/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FREE_ATTEMPTS,
  attemptsLeft,
  getPlan,
  setPlan,
  type PlanId,
} from "@/lib/plan";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

/* ------------------------------------------------------------------ */
/* The story — why pricing looks the way it does                       */
/* ------------------------------------------------------------------ */

const STORY = [
  {
    act: "Act 1",
    title: "Day one costs nothing.",
    body: "You type one line about your idea and get the full research package — personas, empathy maps, journeys, the plan. Nothing held back, no card asked. Every visitor gets 3 complete research runs, free.",
    chips: ["3 free runs", "All 11 artifacts", "Persona chat included"],
  },
  {
    act: "Act 2",
    title: "Then the ideas multiply.",
    body: "The first run validates your idea. The second explores a pivot. The third compares audiences. Suddenly you're rationing runs on the work that matters most — real research is iteration, and iteration eats runs.",
    chips: ["Run 1 · the idea", "Run 2 · the pivot", "Run 3 · the audience"],
  },
  {
    act: "Act 3",
    title: "Research on tap.",
    body: "Pro removes the meter: unlimited runs, Claude-powered personas that argue back, and boardroom-ready PDF exports. Upgrade when the habit forms — not before.",
    chips: ["Unlimited runs", "Claude engine", "PDF + PNG exports"],
  },
];

/* ------------------------------------------------------------------ */
/* Tiers                                                               */
/* ------------------------------------------------------------------ */

const TIERS: {
  id: PlanId;
  icon: typeof PenLine;
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  features: string[];
  popular?: boolean;
}[] = [
  {
    id: "free",
    icon: PenLine,
    name: "Explorer",
    tagline: "Validate your first idea",
    monthly: 0,
    annual: 0,
    features: [
      `${FREE_ATTEMPTS} complete research runs`,
      "Full 11-artifact package per run",
      "Up to 2 personas per run",
      "Chat with your persona — in character",
      "Markdown & JSON export",
      "Projects saved in your browser",
    ],
  },
  {
    id: "pro",
    icon: Zap,
    name: "Pro",
    tagline: "For builders who iterate",
    monthly: 12,
    annual: 10,
    popular: true,
    features: [
      "Unlimited research runs",
      "Claude-powered personas & chat",
      "Up to 3 personas per run",
      "PDF + PNG boardroom exports",
      "Priority generation queue",
      "Everything in Explorer",
    ],
  },
  {
    id: "studio",
    icon: Users,
    name: "Studio",
    tagline: "For teams shipping together",
    monthly: 29,
    annual: 24,
    features: [
      "Shared project library",
      "Brand tone & industry presets",
      "Research package templates",
      "Early access to new artifacts",
      "Priority support",
      "Everything in Pro",
    ],
  },
];

/** Every free capability, and what Pro turns it into. */
const UPGRADE_PATH = [
  { free: "3 complete research runs", pro: "Unlimited runs — iterate freely" },
  { free: "Built-in engine personas & chat", pro: "Claude-powered depth that argues back" },
  { free: "Markdown & JSON exports", pro: "Boardroom-ready PDF + PNG" },
  { free: "Up to 2 personas per run", pro: "3 personas debating every decision" },
  { free: "Standard generation", pro: "Priority generation queue" },
];

const emptySubscribe = () => () => {};
const serverPlan = (): PlanId => "free";
const serverLeft = () => FREE_ATTEMPTS;

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  // Reads resolve on the client after hydration; re-render (bump) re-reads.
  const [, bump] = useState(0);
  const plan = useSyncExternalStore(emptySubscribe, getPlan, serverPlan);
  const left = useSyncExternalStore(emptySubscribe, attemptsLeft, serverLeft);

  function choose(tier: PlanId) {
    if (tier === "free") return;
    setPlan(tier);
    bump((n) => n + 1);
    toast.success(`${tier === "pro" ? "Pro" : "Studio"} unlocked`, {
      description:
        "Demo checkout — this browser now has unlimited research runs.",
    });
  }

  const used = FREE_ATTEMPTS - left;

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
                <Sparkles className="size-3.5 [color:var(--brand-2)]" />
                Pricing
              </Badge>
              <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
                Start free.{" "}
                <span className="bg-brand rounded-xl px-2 [color:var(--brand-foreground)]">
                  Upgrade
                </span>{" "}
                when the habit forms.
              </h1>
              <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-lg text-balance">
                Every visitor gets {FREE_ATTEMPTS} complete research runs — the
                whole package, nothing gated. Pay only when you can&apos;t stop.
              </p>
            </motion.div>
          </div>
        </section>

        {/* The story */}
        <section className="mx-auto max-w-3xl px-4 py-14">
          <div className="relative">
            <div className="bg-border absolute top-2 bottom-2 left-[15px] w-0.5 rounded-full sm:left-[19px]" />
            <div className="space-y-10">
              {STORY.map((s, i) => (
                <motion.div key={s.act} {...fadeUp} className="relative flex gap-5 sm:gap-7">
                  <span
                    className={cn(
                      "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:size-10 sm:text-sm",
                      i === 2
                        ? "bg-brand [color:var(--brand-foreground)]"
                        : "bg-ink text-white dark:bg-white dark:text-ink",
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="glass-card min-w-0 flex-1 rounded-2xl border p-5 sm:p-6">
                    <span className="text-brand text-xs font-semibold tracking-widest uppercase">
                      {s.act}
                    </span>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                      {s.title}
                    </h2>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {s.body}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {s.chips.map((c) => (
                        <span
                          key={c}
                          className="bg-muted rounded-full px-2.5 py-1 text-xs font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Attempts meter */}
        <section className="mx-auto max-w-3xl px-4 pb-4">
          <motion.div
            {...fadeUp}
            className="glass-card flex flex-col items-center justify-between gap-3 rounded-2xl border px-6 py-5 sm:flex-row"
          >
            <div>
              <div className="font-semibold">
                {plan === "free"
                  ? `You've used ${used} of ${FREE_ATTEMPTS} free runs`
                  : "You're on unlimited runs"}
              </div>
              <div className="text-muted-foreground text-sm">
                {plan === "free"
                  ? left > 0
                    ? "The meter only ticks when a run completes."
                    : "Your free runs are spent — Pro removes the meter."
                  : `${plan === "pro" ? "Pro" : "Studio"} plan · this browser`}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: FREE_ATTEMPTS }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-2.5 w-8 rounded-full",
                    plan !== "free" || i >= used ? "bg-brand" : "bg-muted-foreground/25",
                  )}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* Tiers */}
        <section className="mx-auto max-w-6xl px-4 py-14">
          <motion.div {...fadeUp} className="mb-10 flex flex-col items-center gap-5 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Pick your pace
            </h2>
            {/* Billing toggle */}
            <div className="bg-muted/60 inline-flex gap-1 rounded-lg border p-1">
              {(["monthly", "annual"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={cn(
                    "rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                    billing === b
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {b}
                  {b === "annual" && (
                    <span className="text-brand ml-1.5 text-xs font-semibold">
                      −2 months
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {TIERS.map((t, i) => {
              const price = billing === "monthly" ? t.monthly : t.annual;
              const current = plan === t.id || (t.id === "free" && plan === "free");
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.07 }}
                  className={cn(
                    "relative flex flex-col rounded-3xl border p-6",
                    t.popular
                      ? "bg-ink border-transparent text-white shadow-2xl shadow-black/20"
                      : "glass-card",
                  )}
                >
                  {t.popular && (
                    <>
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-3xl"
                        style={{
                          background:
                            "radial-gradient(60% 100% at 50% 0%, color-mix(in srgb, var(--brand) 30%, transparent) 0%, transparent 100%)",
                        }}
                      />
                      <span className="bg-brand absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold [color:var(--brand-foreground)]">
                        Most popular
                      </span>
                    </>
                  )}
                  <div className="relative">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex size-9 items-center justify-center rounded-xl",
                          t.popular
                            ? "bg-brand [color:var(--brand-foreground)]"
                            : "bg-brand-subtle text-brand",
                        )}
                      >
                        <t.icon className="size-4.5" />
                      </span>
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <div
                          className={cn(
                            "text-xs",
                            t.popular ? "text-white/60" : "text-muted-foreground",
                          )}
                        >
                          {t.tagline}
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex items-baseline gap-1.5">
                      <span className="text-4xl font-bold tracking-tight">
                        ${price}
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          t.popular ? "text-white/60" : "text-muted-foreground",
                        )}
                      >
                        {t.monthly === 0 ? "forever" : "/ month"}
                      </span>
                      {billing === "annual" && t.monthly > 0 && (
                        <span className="ml-1 text-xs font-semibold [color:var(--brand-2)]">
                          billed yearly
                        </span>
                      )}
                    </div>
                    <ul className="mt-5 space-y-2.5 text-sm">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <span
                            className={cn(
                              "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full",
                              t.popular ? "bg-brand" : "bg-brand-subtle",
                            )}
                          >
                            <Check
                              className={cn(
                                "size-3",
                                t.popular
                                  ? "[color:var(--brand-foreground)]"
                                  : "text-brand",
                              )}
                            />
                          </span>
                          <span className={t.popular ? "text-white/85" : undefined}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      {t.id === "free" ? (
                        <Button
                          variant="outline"
                          className={cn("w-full", plan !== "free" && "opacity-70")}
                          asChild
                        >
                          <Link href="/studio">
                            {plan === "free" && left < FREE_ATTEMPTS
                              ? `Use your ${left} remaining ${left === 1 ? "run" : "runs"}`
                              : "Start free"}
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                      ) : current ? (
                        <Button
                          variant="outline"
                          disabled
                          className={cn(
                            "w-full",
                            t.popular && "border-white/25 bg-transparent text-white",
                          )}
                        >
                          Current plan
                        </Button>
                      ) : (
                        <Button
                          onClick={() => choose(t.id)}
                          className={cn("w-full", t.popular && "shadow-brand")}
                          variant={t.popular ? "brand" : "outline"}
                        >
                          Upgrade to {t.name}
                          <ArrowRight className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="text-muted-foreground mt-6 text-center text-xs">
            Demo checkout — upgrading unlocks unlimited runs in this browser, no
            card required.
          </p>

          {/* The fourth option: a human, for free */}
          <motion.div
            {...fadeUp}
            className="glass-card mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border p-6 sm:flex-row sm:p-7"
          >
            <div className="flex items-center gap-4">
              <span className="bg-brand-subtle text-brand flex size-11 shrink-0 items-center justify-center rounded-xl">
                <MessageCircle className="size-5" />
              </span>
              <div>
                <div className="font-semibold">
                  Not sure any plan is right yet?
                </div>
                <div className="text-muted-foreground text-sm">
                  Book a free 30-minute UX consultation — walk through your
                  research with a human before deciding anything.
                </div>
              </div>
            </div>
            <Button variant="outline" asChild className="shrink-0">
              <Link href="/consult">
                Free consultation
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>
        </section>

        {/* The upgrade path — free flows into Pro, row by row */}
        <section className="border-y border-border/60 bg-muted/25">
          <div className="mx-auto max-w-4xl px-4 py-14">
            <motion.div {...fadeUp} className="mx-auto mb-10 max-w-xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Free is the starting line.
              </h2>
              <p className="text-muted-foreground mt-2 text-balance">
                Everything on the left stays free forever. Pro doesn&apos;t gate
                it — it removes the ceiling.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="glass-card overflow-hidden rounded-3xl border"
            >
              {/* column headers */}
              <div className="border-border/60 bg-muted/40 grid grid-cols-[1fr_2.5rem_1fr] border-b sm:grid-cols-[1fr_3.5rem_1fr]">
                <div className="px-4 py-3 text-xs font-semibold tracking-wide uppercase sm:px-6 sm:text-sm sm:normal-case sm:tracking-normal">
                  Explorer — free forever
                </div>
                <div />
                <div className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold tracking-wide uppercase sm:px-6 sm:text-sm sm:normal-case sm:tracking-normal">
                  <Zap className="text-brand size-4" />
                  Pro
                </div>
              </div>

              <div className="divide-border/60 divide-y">
                {UPGRADE_PATH.map((row, i) => (
                  <div
                    key={row.free}
                    className="grid grid-cols-[1fr_2.5rem_1fr] items-center sm:grid-cols-[1fr_3.5rem_1fr]"
                  >
                    <div className="text-muted-foreground flex items-start gap-2 px-4 py-4 text-sm sm:px-6">
                      <Check className="text-positive mt-0.5 size-4 shrink-0" />
                      {row.free}
                    </div>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.8,
                        delay: i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="text-brand flex justify-center"
                    >
                      <ArrowRight className="size-4.5" />
                    </motion.div>
                    <div className="bg-brand/8 flex h-full items-center gap-2 px-4 py-4 text-sm font-medium sm:px-6">
                      {row.pro}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-4 py-16 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              The first three runs are on us.
            </h2>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-balance">
              See what a full research package feels like before spending a
              cent.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button variant="brand" size="lg" asChild className="shadow-brand">
                <Link href="/studio">
                  Start your first run
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/#example">See an example first</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        <footer className="border-t border-border/60">
          <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs sm:flex-row">
            <span>Fouxium — your product research copilot.</span>
            <span>Plans are simulated · no payment is ever collected.</span>
          </div>
        </footer>
      </main>
    </>
  );
}
