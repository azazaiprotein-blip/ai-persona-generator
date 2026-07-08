"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Loader2,
  Lock,
  PenLine,
  Settings2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  INDUSTRIES,
  MAX_PERSONAS,
  MIN_PERSONAS,
  TONES,
  type Brief,
} from "@/lib/types";

export const PENDING_BRIEF_KEY = "folium:pending-brief";

const COUNTS = Array.from(
  { length: MAX_PERSONAS - MIN_PERSONAS + 1 },
  (_, i) => MIN_PERSONAS + i,
);

type StepId = 0 | 1 | 2;

const STEP_META = [
  { icon: PenLine, title: "Describe your product" },
  { icon: Users, title: "Who are you building it for?" },
  { icon: Settings2, title: "A few details" },
] as const;

function StepShell({
  index,
  state,
  summary,
  onEdit,
  children,
}: {
  index: StepId;
  state: "locked" | "active" | "done";
  summary?: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  const meta = STEP_META[index];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "bg-card border-border/80 shadow-ink/6 overflow-hidden rounded-2xl border text-left shadow-xl transition-opacity",
        state === "locked" && "opacity-70 shadow-none",
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            state === "done"
              ? "bg-brand text-brand-foreground"
              : state === "active"
                ? "bg-ink text-white dark:bg-white dark:text-ink"
                : "bg-muted text-muted-foreground",
          )}
        >
          {state === "done" ? (
            <Check className="size-4" />
          ) : state === "locked" ? (
            <Lock className="size-3.5" />
          ) : (
            index + 1
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{meta.title}</div>
          {state === "done" && summary && (
            <div className="text-muted-foreground truncate text-xs">
              {summary}
            </div>
          )}
        </div>
        {state === "done" && (
          <button
            onClick={onEdit}
            className="text-muted-foreground hover:text-foreground text-xs font-medium"
          >
            Edit
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {state === "active" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function HeroFlow() {
  const router = useRouter();
  const [step, setStep] = useState<StepId>(0);
  const [maxUnlocked, setMaxUnlocked] = useState<StepId>(0);
  const [launching, setLaunching] = useState(false);

  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [industry, setIndustry] = useState<Brief["industry"]>("Technology / SaaS");
  const [tone, setTone] = useState<Brief["tone"]>("Friendly");
  const [count, setCount] = useState(2);

  const productValid = product.trim().length >= 3;

  function stateFor(i: StepId): "locked" | "active" | "done" {
    if (i === step) return "active";
    return i <= maxUnlocked ? "done" : "locked";
  }

  function advance(next: StepId) {
    setStep(next);
    setMaxUnlocked((m) => (next > m ? next : m));
  }

  function launch() {
    if (!productValid || launching) return;
    const brief: Brief = {
      product: product.trim(),
      audience: audience.trim(),
      industry,
      tone,
      count,
    };
    try {
      window.localStorage.setItem(PENDING_BRIEF_KEY, JSON.stringify(brief));
    } catch {
      /* storage unavailable — the studio will just show the empty form */
    }
    setLaunching(true);
    router.push("/studio");
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
      {/* Step 1 — product */}
      <StepShell
        index={0}
        state={stateFor(0)}
        summary={product.trim()}
        onEdit={() => setStep(0)}
      >
        <Textarea
          autoFocus
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && productValid) {
              e.preventDefault();
              advance(1);
            }
          }}
          placeholder="e.g. A time-blocking calendar app for freelance designers…"
          maxLength={600}
          className="min-h-20 resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            One line is enough — Folium does the rest.
          </span>
          <Button
            variant="brand"
            size="sm"
            disabled={!productValid}
            onClick={() => advance(1)}
            className="shadow-brand"
          >
            Continue
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </StepShell>

      {/* Step 2 — audience */}
      <StepShell
        index={1}
        state={stateFor(1)}
        summary={audience.trim() || "Folium will infer the audience"}
        onEdit={() => setStep(1)}
      >
        <Input
          autoFocus
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              advance(2);
            }
          }}
          placeholder="e.g. busy freelance designers juggling multiple clients"
          maxLength={400}
        />
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => advance(2)}
            className="text-muted-foreground hover:text-foreground text-xs font-medium"
          >
            Skip — let Folium infer it
          </button>
          <Button variant="brand" size="sm" onClick={() => advance(2)} className="shadow-brand">
            Continue
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </StepShell>

      {/* Step 3 — key info + launch */}
      <StepShell
        index={2}
        state={stateFor(2)}
        summary={`${industry} · ${tone} · ${count} personas`}
        onEdit={() => setStep(2)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-medium">
              Industry
            </label>
            <Select
              value={industry}
              onValueChange={(v) => setIndustry(v as Brief["industry"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-medium">
              Tone of voice
            </label>
            <Select value={tone} onValueChange={(v) => setTone(v as Brief["tone"])}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="bg-muted/60 inline-flex gap-1 rounded-lg border p-1">
            {COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={cn(
                  "rounded-md px-3 py-1 text-sm font-semibold transition-colors",
                  count === n
                    ? "bg-ink text-white dark:bg-white dark:text-ink"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <Button
            variant="brand"
            disabled={!productValid || launching}
            onClick={launch}
            className="shadow-brand"
          >
            {launching ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Opening Studio…
              </>
            ) : (
              <>
                Generate my research
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </StepShell>
    </div>
  );
}
