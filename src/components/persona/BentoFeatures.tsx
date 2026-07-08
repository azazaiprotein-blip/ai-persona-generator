"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Check,
  Download,
  Megaphone,
  MessageCircle,
  Radar,
  Target,
  type LucideIcon,
} from "lucide-react";

import { AvatarBlob } from "@/components/persona/AvatarBlob";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Bento cell frame — header + description + a "screen" for the demo   */
/* ------------------------------------------------------------------ */

function Cell({
  icon: Icon,
  title,
  desc,
  className,
  children,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass-card group flex flex-col overflow-hidden rounded-2xl border p-5",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="bg-brand-subtle text-brand flex size-8 shrink-0 items-center justify-center rounded-lg">
          <Icon className="size-4" />
        </span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{desc}</p>
      {/* The "recording" frame */}
      <div className="border-border/60 bg-background/60 relative mt-4 flex-1 overflow-hidden rounded-xl border">
        <div className="border-border/50 bg-muted/50 flex items-center gap-1.5 border-b px-3 py-1.5">
          <span className="size-2 rounded-full bg-rose-400/70" />
          <span className="size-2 rounded-full bg-amber-400/70" />
          <span className="size-2 rounded-full bg-emerald-400/70" />
        </div>
        {children}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Demo 1 — radar morphing between two personas, with a scan sweep     */
/* ------------------------------------------------------------------ */

const RING_80 = "100,20 176.1,75.3 147,164.7 53,164.7 23.9,75.3";
const RING_55 = "100,45 152.3,83 132.3,144.5 67.7,144.5 47.7,83";
const RING_30 = "100,70 128.5,90.7 117.6,124.3 82.4,124.3 71.5,90.7";
const DATA_A = "100,42.4 144.1,85.7 137.6,151.8 78.8,129.1 50.5,83.9";
const DATA_B = "100,60 157.1,81.5 125.9,135.6 67.1,145.3 63.5,88.1";

const PERSONA_TABS = [
  { initials: "MK", hue: 268, name: "Maya" },
  { initials: "DS", hue: 150, name: "Diego" },
  { initials: "PN", hue: 330, name: "Priya" },
];

function RadarDemo() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
      <div className="relative">
        <svg viewBox="0 0 200 200" className="h-44 w-44 sm:h-52 sm:w-52">
          {[RING_80, RING_55, RING_30].map((pts) => (
            <polygon
              key={pts}
              points={pts}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}
          {RING_80.split(" ").map((p) => (
            <line
              key={p}
              x1="100"
              y1="100"
              x2={p.split(",")[0]}
              y2={p.split(",")[1]}
              stroke="var(--border)"
              strokeWidth="0.75"
            />
          ))}
          <motion.polygon
            points={DATA_A}
            fill="color-mix(in srgb, var(--brand) 26%, transparent)"
            stroke="var(--brand)"
            strokeWidth="1.5"
            animate={{ opacity: [1, 1, 0, 0, 1] }}
            transition={{ duration: 8, times: [0, 0.42, 0.5, 0.92, 1], repeat: Infinity }}
          />
          <motion.polygon
            points={DATA_B}
            fill="color-mix(in srgb, var(--brand-2) 30%, transparent)"
            stroke="var(--brand-2)"
            strokeWidth="1.5"
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: 8, times: [0, 0.42, 0.5, 0.92, 1], repeat: Infinity }}
          />
        </svg>
        {/* radar scan sweep */}
        <motion.div
          aria-hidden
          className="absolute inset-3 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, color-mix(in srgb, var(--brand) 22%, transparent) 0deg, transparent 70deg)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="flex items-center gap-2">
        {PERSONA_TABS.map((p, i) => (
          <motion.span
            key={p.name}
            className="border-border/70 bg-card flex items-center gap-1.5 rounded-full border py-1 pr-2.5 pl-1 text-xs font-medium"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 4, delay: i * 1.3, repeat: Infinity, ease: "easeInOut" }}
          >
            <AvatarBlob initials={p.initials} hue={p.hue} className="size-5" />
            {p.name}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Demo 2 — persona chat: question → typing dots → in-character reply  */
/* ------------------------------------------------------------------ */

const CHAT_LOOP = { duration: 7.5, repeat: Infinity } as const;

function ChatDemo() {
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 p-4 text-xs">
      <motion.div
        className="bg-ink self-end rounded-2xl rounded-br-sm px-3 py-2 text-white"
        animate={{ opacity: [0, 1, 1, 1, 0], y: [8, 0, 0, 0, 0] }}
        transition={{ ...CHAT_LOOP, times: [0, 0.06, 0.5, 0.94, 1] }}
      >
        Would you pay $12/mo for this?
      </motion.div>
      <motion.div
        className="bg-muted flex w-14 items-center justify-center gap-1 self-start rounded-2xl rounded-bl-sm px-3 py-2.5"
        animate={{ opacity: [0, 1, 1, 0, 0] }}
        transition={{ ...CHAT_LOOP, times: [0.1, 0.14, 0.34, 0.38, 1] }}
      >
        {[0, 1, 2].map((d) => (
          <motion.span
            key={d}
            className="bg-muted-foreground/70 size-1.5 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.9, delay: d * 0.2, repeat: Infinity }}
          />
        ))}
      </motion.div>
      <motion.div
        className="bg-muted flex max-w-[85%] items-start gap-2 self-start rounded-2xl rounded-bl-sm px-3 py-2"
        animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, 0] }}
        transition={{ ...CHAT_LOOP, times: [0.38, 0.44, 0.94, 1] }}
      >
        <AvatarBlob initials="MK" hue={268} className="mt-0.5 size-5 shrink-0" />
        <span>
          Only if it proves itself in the first ten minutes. Show me the outcome
          and I&apos;m in.
        </span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Demo 3 — living journey sentiment bars                              */
/* ------------------------------------------------------------------ */

const JOURNEY_BARS = [
  { base: 44, peak: 58, cls: "bg-amber-400/80" },
  { base: 38, peak: 50, cls: "bg-amber-400/80" },
  { base: 30, peak: 44, cls: "bg-rose-400/80" },
  { base: 56, peak: 72, cls: "bg-brand" },
  { base: 70, peak: 88, cls: "bg-brand" },
  { base: 82, peak: 96, cls: "bg-brand" },
];

function JourneyDemo() {
  return (
    <div className="flex h-full flex-col justify-end gap-2 p-4">
      <div className="flex h-28 items-end gap-2">
        {JOURNEY_BARS.map((b, i) => (
          <motion.div
            key={i}
            className={cn("min-w-0 flex-1 rounded-t-md", b.cls)}
            animate={{ height: [`${b.base}%`, `${b.peak}%`, `${b.base}%`] }}
            transition={{
              duration: 2.6,
              delay: i * 0.18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="text-muted-foreground flex justify-between text-[10px]">
        <span>Awareness</span>
        <span>Advocacy</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Demo 4 — MoSCoW board reprioritizing itself                         */
/* ------------------------------------------------------------------ */

const SHUFFLE = {
  duration: 6,
  times: [0, 0.42, 0.52, 0.92, 1],
  repeat: Infinity,
  ease: "easeInOut" as const,
};

function MoscowRow({
  label,
  badge,
  badgeCls,
  animateY,
}: {
  label: string;
  badge: string;
  badgeCls: string;
  animateY?: number[];
}) {
  return (
    <motion.div
      className="border-border/70 bg-card flex items-center justify-between rounded-lg border px-2.5 py-1.5"
      animate={animateY ? { y: animateY } : undefined}
      transition={animateY ? SHUFFLE : undefined}
    >
      <span className="truncate text-[11px] font-medium">{label}</span>
      <span
        className={cn(
          "ml-2 shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase",
          badgeCls,
        )}
      >
        {badge}
      </span>
    </motion.div>
  );
}

function MoscowDemo() {
  return (
    <div className="flex h-full flex-col justify-center gap-1.5 p-4">
      <MoscowRow
        label="One-line brief input"
        badge="Must"
        badgeCls="bg-brand [color:var(--brand-foreground)]"
        animateY={[0, 0, 38, 38, 0]}
      />
      <MoscowRow
        label="Calendar sync"
        badge="Should"
        badgeCls="bg-amber-400/90 text-amber-950"
        animateY={[0, 0, -38, -38, 0]}
      />
      <MoscowRow
        label="Team workspaces"
        badge="Could"
        badgeCls="bg-muted text-muted-foreground"
      />
      <MoscowRow
        label="AI voice notes"
        badge="Won't"
        badgeCls="bg-muted text-muted-foreground"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Demo 5 — go-to-market copy writing itself                           */
/* ------------------------------------------------------------------ */

function CopyDemo() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-4">
      <div className="overflow-hidden">
        <motion.p
          className="text-sm font-semibold whitespace-nowrap"
          animate={{
            clipPath: [
              "inset(0 100% 0 0)",
              "inset(0 0% 0 0)",
              "inset(0 0% 0 0)",
              "inset(0 100% 0 0)",
            ],
          }}
          transition={{ duration: 6, times: [0.05, 0.45, 0.92, 1], repeat: Infinity }}
        >
          Your week, planned in 60 seconds.
        </motion.p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["Positioning", "Value prop", "3 headlines", "UX direction"].map(
          (chip, i) => (
            <motion.span
              key={chip}
              className="border-border/70 bg-card rounded-full border px-2 py-0.5 text-[10px] font-medium"
              animate={{ opacity: [0, 1, 1, 0], y: [4, 0, 0, 0] }}
              transition={{
                duration: 6,
                times: [0.2 + i * 0.07, 0.3 + i * 0.07, 0.92, 1],
                repeat: Infinity,
              }}
            >
              {chip}
            </motion.span>
          ),
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Demo 6 — export pipeline: progress fill + files popping out         */
/* ------------------------------------------------------------------ */

const FILES = ["PDF", "PNG", "Markdown", "JSON"];

function ExportDemo() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 sm:flex-row sm:gap-8">
      <div className="w-full max-w-45">
        <div className="text-muted-foreground mb-1.5 flex justify-between text-[10px]">
          <span>research-package.pdf</span>
          <motion.span
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: 6, times: [0, 0.5, 0.55, 0.92, 1], repeat: Infinity }}
            className="text-brand flex items-center gap-0.5 font-medium"
          >
            <Check className="size-3" /> done
          </motion.span>
        </div>
        <div className="bg-muted h-2 overflow-hidden rounded-full">
          <motion.div
            className="bg-brand h-full origin-left rounded-full"
            animate={{ scaleX: [0, 1, 1, 0] }}
            transition={{
              duration: 6,
              times: [0.05, 0.5, 0.95, 1],
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
      <div className="flex gap-2">
        {FILES.map((f, i) => (
          <motion.span
            key={f}
            className="border-border/70 bg-card rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold"
            animate={{ opacity: [0, 1, 1, 0], scale: [0.7, 1, 1, 0.9], y: [8, 0, 0, 0] }}
            transition={{
              duration: 6,
              times: [0.5 + i * 0.06, 0.58 + i * 0.06, 0.94, 1],
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {f}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The bento grid                                                      */
/* ------------------------------------------------------------------ */

export function BentoFeatures() {
  return (
    <div className="mt-12 grid gap-4 md:grid-cols-3">
      <Cell
        icon={Radar}
        title="Personas + empathy maps"
        desc="Rich profiles with a personality radar, plus a 6-quadrant empathy map for every persona."
        className="min-h-[22rem] md:col-span-2"
      >
        <RadarDemo />
      </Cell>
      <Cell
        icon={MessageCircle}
        title="Chat with your persona"
        desc="Interview any persona in character — pressure-test pricing, features, and objections."
        className="min-h-[22rem]"
      >
        <ChatDemo />
      </Cell>
      <Cell
        icon={Activity}
        title="Journeys & jobs-to-be-done"
        desc="A 6-stage journey with emotions and opportunities, plus four kinds of jobs-to-be-done."
        className="min-h-[17rem]"
      >
        <JourneyDemo />
      </Cell>
      <Cell
        icon={Target}
        title="Feature strategy"
        desc="A MoSCoW board, 15+ user stories, MVP scope, UX risks, and success metrics."
        className="min-h-[17rem]"
      >
        <MoscowDemo />
      </Cell>
      <Cell
        icon={Megaphone}
        title="Marketing & design direction"
        desc="Positioning, value prop, ready-to-use headlines, and concrete UX recommendations."
        className="min-h-[17rem]"
      >
        <CopyDemo />
      </Cell>
      <Cell
        icon={Download}
        title="Export the whole package"
        desc="Ship it as PDF, PNG, Markdown, or JSON — and save, favorite, and search every project locally."
        className="min-h-[13rem] md:col-span-3"
      >
        <ExportDemo />
      </Cell>
    </div>
  );
}
