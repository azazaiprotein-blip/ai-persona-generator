"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  BriefSchema,
  DEFAULT_BRIEF,
  INDUSTRIES,
  MAX_PERSONAS,
  MIN_PERSONAS,
  TONES,
  type Brief,
} from "@/lib/types";

type FieldErrors = Partial<Record<keyof Brief, string[]>>;

interface PersonaFormProps {
  onGenerate: (brief: Brief) => void;
  isLoading: boolean;
}

const COUNTS = Array.from(
  { length: MAX_PERSONAS - MIN_PERSONAS + 1 },
  (_, i) => MIN_PERSONAS + i,
);

const EXAMPLES = [
  "A budgeting app that turns grocery receipts into monthly reports",
  "A B2B tool that schedules social posts for small agencies",
  "An online course marketplace for hands-on hobbies",
];

function FieldError({ messages }: { messages?: string[] }) {
  return (
    <AnimatePresence>
      {messages && messages.length > 0 && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-destructive text-xs"
        >
          {messages[0]}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function PersonaForm({ onGenerate, isLoading }: PersonaFormProps) {
  const [form, setForm] = useState<Brief>(DEFAULT_BRIEF);
  const [errors, setErrors] = useState<FieldErrors>({});

  function update<K extends keyof Brief>(key: K, value: Brief[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = BriefSchema.safeParse(form);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as FieldErrors);
      return;
    }
    setErrors({});
    onGenerate(result.data);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="text-brand size-5" />
            Describe your product
          </CardTitle>
          <CardDescription>
            Give us the essentials and we&apos;ll craft rich, realistic personas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product">
                Product or service <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="product"
                placeholder="e.g. A budgeting app that turns grocery receipts into monthly reports"
                value={form.product}
                onChange={(e) => update("product", e.target.value)}
                aria-invalid={Boolean(errors.product)}
                className="min-h-24 resize-none"
                maxLength={600}
              />
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-muted-foreground text-xs">Try:</span>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => update("product", ex)}
                    className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md border px-2 py-0.5 text-xs transition-colors"
                  >
                    {ex.split(" ").slice(0, 4).join(" ")}…
                  </button>
                ))}
              </div>
              <FieldError messages={errors.product} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">
                Target audience{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="audience"
                placeholder="e.g. busy young families new to budgeting"
                value={form.audience ?? ""}
                onChange={(e) => update("audience", e.target.value)}
                aria-invalid={Boolean(errors.audience)}
                maxLength={400}
              />
              <FieldError messages={errors.audience} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={form.industry}
                  onValueChange={(v) =>
                    update("industry", v as Brief["industry"])
                  }
                >
                  <SelectTrigger id="industry" className="w-full">
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Quote tone of voice</Label>
                <Select
                  value={form.tone}
                  onValueChange={(v) => update("tone", v as Brief["tone"])}
                >
                  <SelectTrigger id="tone" className="w-full">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((tone) => (
                      <SelectItem key={tone} value={tone}>
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>How many personas?</Label>
              <div className="bg-muted/60 inline-flex gap-1 rounded-lg border p-1">
                {COUNTS.map((n) => {
                  const active = form.count === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => update("count", n)}
                      className={cn(
                        "relative rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                        active
                          ? "text-brand-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="count-pill"
                          className="bg-brand absolute inset-0 rounded-md"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{n}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating personas…
                </>
              ) : (
                <>
                  <Wand2 className="size-4" />
                  Generate personas
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
