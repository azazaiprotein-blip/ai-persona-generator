"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Plus, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/persona/EmptyState";
import { PersonaForm } from "@/components/persona/PersonaForm";
import { PersonaSkeletonGrid } from "@/components/persona/PersonaCardSkeleton";
import { SiteHeader } from "@/components/persona/SiteHeader";
import { ProjectsLibrary } from "@/components/workspace/ProjectsLibrary";
import { ResearchWorkspace } from "@/components/workspace/ResearchWorkspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PENDING_BRIEF_KEY } from "@/components/persona/HeroFlow";
import {
  FREE_ATTEMPTS,
  attemptsLeft,
  canGenerate,
  getPlan,
  recordAttempt,
} from "@/lib/plan";
import { buildProjectArtifacts } from "@/lib/research";
import { SAMPLE_BRIEF, SAMPLE_PERSONA } from "@/lib/sample";
import { useProjects } from "@/lib/storage";
import {
  BriefSchema,
  GenerateResponseSchema,
  type Brief,
  type Project,
} from "@/lib/types";

type View = "workspace" | "projects";

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function projectName(product: string): string {
  const p = product.trim();
  if (!p) return "Untitled research";
  const short = p.length <= 52 ? p : `${p.slice(0, 49)}…`;
  return short;
}

export default function StudioPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [lastBrief, setLastBrief] = useState<Brief | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [view, setView] = useState<View>("workspace");
  const [runsLeft, setRunsLeft] = useState<number | null>(null);

  const projects = useProjects();

  // If the landing-page hero flow handed us a brief, generate right away.
  const autostarted = useRef(false);
  useEffect(() => {
    if (autostarted.current) return;
    autostarted.current = true;
    void syncRunsLeft();
    if (new URLSearchParams(window.location.search).get("example")) {
      void loadExampleProject();
      return;
    }
    try {
      const raw = window.localStorage.getItem(PENDING_BRIEF_KEY);
      if (!raw) return;
      window.localStorage.removeItem(PENDING_BRIEF_KEY);
      const parsed = BriefSchema.safeParse(JSON.parse(raw));
      if (parsed.success) {
        void handleGenerate(parsed.data);
      }
    } catch {
      /* corrupted pending brief — fall through to the normal form */
    }
  }, []);

  // Reflect the plan/attempt meter (null on the paid plans = unlimited).
  async function syncRunsLeft() {
    setRunsLeft(getPlan() === "free" ? attemptsLeft() : null);
  }

  // Load the landing-page example as a fully built research package.
  async function loadExampleProject() {
    setProject({
      id: "example-project",
      name: "Example — Ops reporting copilot",
      createdAt: new Date().toISOString(),
      source: SAMPLE_PERSONA.source,
      model: SAMPLE_PERSONA.model,
      brief: SAMPLE_BRIEF,
      personas: [SAMPLE_PERSONA],
      artifacts: buildProjectArtifacts(SAMPLE_BRIEF, [SAMPLE_PERSONA]),
    });
    setShowForm(false);
  }

  async function handleGenerate(brief: Brief) {
    if (!canGenerate()) {
      setError(
        `You've used all ${FREE_ATTEMPTS} free research runs. Upgrade to keep going — or revisit your saved projects anytime.`,
      );
      setShowForm(false);
      setView("workspace");
      toast.error("Free runs used up", {
        description: "Upgrade on the pricing page to unlock unlimited runs.",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setPendingCount(brief.count);
    setLastBrief(brief);
    setView("workspace");
    setShowForm(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }
      const data = GenerateResponseSchema.parse(await res.json());
      const built: Project = {
        id: makeId(),
        name: projectName(brief.product),
        createdAt: new Date().toISOString(),
        source: data.source,
        model: data.model,
        brief,
        personas: data.personas,
        artifacts: data.artifacts,
      };
      setProject(built);
      setShowForm(false);
      recordAttempt();
      void syncRunsLeft();
      toast.success("Research package ready", {
        description: `${data.personas.length} personas + full research package · ${
          data.source === "ai" ? "Claude" : "built-in engine"
        }`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Please try again.";
      setError(message);
      toast.error("Couldn't generate research", { description: message });
    } finally {
      setIsLoading(false);
    }
  }

  const isSaved = project ? projects.isSaved(project.id) : false;

  const tabs: { id: View; label: string; count?: number }[] = [
    { id: "workspace", label: "Workspace" },
    { id: "projects", label: "Projects", count: projects.projects.length },
  ];

  return (
    <>
      <SiteHeader variant="app" />
      <main className="relative">
        {/* Create / hero */}
        <section className="sky-wash relative overflow-hidden">
          <div className="bg-dots pointer-events-none absolute inset-0 -z-10" />
          <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-2 sm:pt-12">
            <AnimatePresence initial={false} mode="wait">
              {showForm ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                >
                  <div className="mx-auto max-w-2xl text-center">
                    <Badge variant="brand" className="mb-4">
                      <Sparkles className="size-3.5" />
                      UX Research Copilot
                    </Badge>
                    <h1 className="text-gradient text-3xl font-semibold tracking-tight sm:text-4xl">
                      Turn an idea into a research package
                    </h1>
                    <p className="text-muted-foreground mx-auto mt-3 max-w-lg text-balance">
                      Describe your product and get personas, empathy maps,
                      journeys, JTBD, opportunities, features, user stories, and
                      go-to-market recommendations — in one place.
                    </p>
                  </div>
                  <div className="mx-auto mt-8 max-w-2xl">
                    <PersonaForm onGenerate={handleGenerate} isLoading={isLoading} />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="bar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center"
                >
                  <Button variant="outline" onClick={() => setShowForm(true)}>
                    <Plus className="size-4" />
                    New research project
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Tabs + content */}
        <section className="mx-auto w-full max-w-6xl px-4 pt-8 pb-24">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="bg-muted/60 inline-flex gap-1 rounded-lg border p-1">
              {tabs.map((t) => {
                const active = view === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setView(t.id)}
                    className={cn(
                      "relative rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="studio-view"
                        className="bg-background absolute inset-0 rounded-md shadow-sm"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {t.label}
                      {t.count ? (
                        <span
                          className={cn(
                            "tabular-nums rounded-full px-1.5 text-xs",
                            active ? "bg-brand/12 text-brand" : "bg-muted-foreground/15 text-muted-foreground",
                          )}
                        >
                          {t.count}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              {runsLeft !== null && (
                <Link
                  href="/pricing"
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                    runsLeft === 0
                      ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/15"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Zap className="text-brand size-3.5" />
                  {runsLeft === 0
                    ? "Free runs used — see plans"
                    : `${runsLeft} free ${runsLeft === 1 ? "run" : "runs"} left`}
                </Link>
              )}
              {!showForm && view === "workspace" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
                >
                  Edit brief
                  <ChevronDown className="size-4" />
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view + (isLoading ? "-l" : "") + (error ? "-e" : "") + (project?.id ?? "")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {view === "workspace" ? (
                isLoading ? (
                  <div className="space-y-6">
                    <div className="bg-muted h-8 w-48 animate-pulse rounded-md" />
                    <PersonaSkeletonGrid count={pendingCount} />
                  </div>
                ) : error ? (
                  <div className="border-destructive/30 bg-destructive/5 flex flex-col items-center rounded-xl border px-6 py-14 text-center">
                    <h3 className="text-base font-semibold">
                      {runsLeft === 0 ? "You're out of free runs" : "Generation failed"}
                    </h3>
                    <p className="text-muted-foreground mt-1 max-w-sm text-sm text-balance">
                      {error}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      {runsLeft === 0 && (
                        <Button variant="brand" size="sm" asChild className="shadow-brand">
                          <Link href="/pricing">
                            <Zap className="size-4" />
                            See plans
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                      )}
                      {lastBrief && runsLeft !== 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerate(lastBrief)}
                        >
                          Try again
                        </Button>
                      )}
                    </div>
                  </div>
                ) : project ? (
                  <ResearchWorkspace
                    project={project}
                    isSaved={isSaved}
                    onSave={() => {
                      projects.save(project);
                      toast.success(isSaved ? "Project updated" : "Project saved");
                    }}
                  />
                ) : (
                  <EmptyState
                    icon={<Sparkles className="size-6" />}
                    title="No research yet"
                    description="Describe your product above and generate a complete UX research package."
                  />
                )
              ) : (
                <ProjectsLibrary
                  projects={projects.projects}
                  onOpen={(p) => {
                    setProject(p);
                    setShowForm(false);
                    setView("workspace");
                  }}
                  onDuplicate={projects.duplicate}
                  onToggleFavorite={projects.toggleFavorite}
                  onDelete={(id) => {
                    if (project?.id === id) setProject(null);
                    projects.remove(id);
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        <footer className="border-t border-border/60">
          <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs sm:flex-row">
            <span>Folium — your UX research copilot.</span>
            <span>Projects are saved locally in your browser.</span>
          </div>
        </footer>
      </main>
    </>
  );
}
