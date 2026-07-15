"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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

export const PENDING_BRIEF_KEY = "fouxium:pending-brief";
/** Pre-rebrand keys, still read once on the Studio so an in-flight handoff
 *  spanning a rename isn't lost. Newest first. */
export const LEGACY_PENDING_BRIEF_KEYS = [
  "theaix:pending-brief",
  "folium:pending-brief",
];

const COUNTS = Array.from(
  { length: MAX_PERSONAS - MIN_PERSONAS + 1 },
  (_, i) => MIN_PERSONAS + i,
);

/** One frame, one job: describe the product, tweak a couple of details
 *  on the same card, and go. */
export function HeroFlow() {
  const router = useRouter();
  const [launching, setLaunching] = useState(false);

  const [product, setProduct] = useState("");
  const [industry, setIndustry] = useState<Brief["industry"]>("Technology / SaaS");
  const [tone, setTone] = useState<Brief["tone"]>("Friendly");
  const [count, setCount] = useState(2);

  const productValid = product.trim().length >= 3;

  function launch() {
    if (!productValid || launching) return;
    const brief: Brief = {
      product: product.trim(),
      audience: "",
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
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border-border/80 shadow-ink/6 mx-auto w-full max-w-xl overflow-hidden rounded-2xl border text-left shadow-xl"
    >
      <div className="p-4 pb-2">
        <Textarea
          autoFocus
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && productValid) {
              e.preventDefault();
              launch();
            }
          }}
          placeholder="Describe your product — e.g. A time-blocking calendar app for freelance designers…"
          maxLength={600}
          className="min-h-24 resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
        />
      </div>

      {/* everything else lives on one compact row */}
      <div className="border-border/60 flex flex-wrap items-center gap-2 border-t px-4 py-3">
        <Select
          value={industry}
          onValueChange={(v) => setIndustry(v as Brief["industry"])}
        >
          <SelectTrigger size="sm" className="w-auto max-w-44" aria-label="Industry">
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

        <Select value={tone} onValueChange={(v) => setTone(v as Brief["tone"])}>
          <SelectTrigger size="sm" className="w-auto" aria-label="Tone of voice">
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

        <div
          className="bg-muted/60 inline-flex gap-0.5 rounded-lg border p-0.5"
          aria-label="Number of personas"
        >
          {COUNTS.map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={cn(
                "rounded-md px-2.5 py-1 text-sm font-semibold transition-colors",
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
          className="shadow-brand ml-auto"
        >
          {launching ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Opening Studio…
            </>
          ) : (
            <>
              Generate Research
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
