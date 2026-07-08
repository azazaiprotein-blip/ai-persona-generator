"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accessibility,
  Activity,
  Brain,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Frown,
  Gauge,
  Heart,
  Lightbulb,
  MessageCircle,
  Palette,
  Repeat,
  Rocket,
  Smile,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
} from "lucide-react";

import { PersonaCard } from "@/components/persona/PersonaCard";
import { AvatarBlob } from "@/components/persona/AvatarBlob";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  Persona,
  Project,
  ProjectArtifacts,
  UserStory,
} from "@/lib/types";
import { Bullets, ChipList, InfoCard, SectionHeader } from "./primitives";

function sentimentColor(v: number) {
  return `hsl(${Math.round(v * 1.15)} 62% 48%)`;
}

/* ------------------------------- Overview ------------------------------- */

export function OverviewSection({ project }: { project: Project }) {
  const stats = [
    { label: "Personas", value: String(project.personas.length) },
    { label: "User stories", value: String(project.artifacts.userStories.length) },
    {
      label: "Opportunities",
      value: String(
        Object.values(project.artifacts.opportunities).flat().length,
      ),
    },
    {
      label: "Features mapped",
      value: String(
        Object.values(project.artifacts.features).flat().length,
      ),
    },
  ];
  return (
    <div>
      <SectionHeader
        icon={<Gauge className="size-5" />}
        title="Project overview"
        description="A complete UX research package generated from your brief."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <InfoCard key={s.label} index={i}>
            <div className="text-brand text-3xl font-semibold tracking-tight tabular-nums">
              {s.value}
            </div>
            <div className="text-muted-foreground mt-1 text-sm">{s.label}</div>
          </InfoCard>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <InfoCard title="The brief" icon={<Target className="size-3.5" />} className="lg:col-span-2">
          <p className="text-sm leading-relaxed">{project.brief.product}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="font-normal">
              {project.brief.industry}
            </Badge>
            <Badge variant="secondary" className="font-normal">
              {project.brief.tone} tone
            </Badge>
            {project.brief.audience && (
              <Badge variant="secondary" className="font-normal">
                {project.brief.audience}
              </Badge>
            )}
          </div>
        </InfoCard>
        <InfoCard title="North Star" icon={<Sparkles className="size-3.5" />}>
          <p className="text-sm leading-relaxed">
            {project.artifacts.product.metrics.northStar}
          </p>
        </InfoCard>
      </div>

      {/* Glimpse of the product recommendations */}
      <div className="mt-4">
        <InfoCard
          title="Product recommendations — a glimpse"
          icon={<Rocket className="size-3.5" />}
        >
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <div className="mb-2.5 flex items-center gap-1.5 text-sm font-medium">
                <TrendingUp className="text-brand size-4" />
                Build first
              </div>
              <Bullets items={project.artifacts.product.topFeatures.slice(0, 3)} />
            </div>
            <div>
              <div className="mb-2.5 flex items-center gap-1.5 text-sm font-medium">
                <Wrench className="size-4 text-sky-500" />
                MVP scope
              </div>
              <Bullets items={project.artifacts.product.mvpScope.slice(0, 3)} />
            </div>
            <div>
              <div className="mb-2.5 flex items-center gap-1.5 text-sm font-medium">
                <Lightbulb className="size-4 text-amber-500" />
                Watch out for
              </div>
              <Bullets items={project.artifacts.product.uxRisks.slice(0, 2)} />
              <p className="text-muted-foreground/80 mt-3 text-xs">
                Activation: {project.artifacts.product.metrics.activation}
              </p>
            </div>
          </div>
          <p className="text-muted-foreground border-border/60 mt-5 border-t pt-3 text-xs">
            The full MoSCoW board, user stories, and success metrics live in the{" "}
            <span className="text-foreground font-medium">Features</span> and{" "}
            <span className="text-foreground font-medium">User Stories</span> tabs.
          </p>
        </InfoCard>
      </div>

      <div className="mt-4">
        <InfoCard title="Personas" icon={<Sparkles className="size-3.5" />}>
          <div className="flex flex-wrap gap-4">
            {project.personas.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <AvatarBlob src={p.avatar.photo} initials={p.avatar.initials} hue={p.avatar.hue} className="size-10" />
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {p.occupation} · {p.archetype}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfoCard>
      </div>
    </div>
  );
}

/* ------------------------------- Personas ------------------------------- */

export function PersonasSection({ project }: { project: Project }) {
  const personas = project.personas;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const exportControls = {
    variant: "export" as const,
    saved: false,
    favorite: false,
    onSave: () => {},
    onRemove: () => {},
    onToggleFavorite: () => {},
    onDuplicate: () => {},
  };

  // Stale index after switching to a project with fewer personas.
  const safeIndex = Math.min(index, personas.length - 1);
  const active = personas[safeIndex];

  function goTo(next: number) {
    setDir(next > safeIndex ? 1 : -1);
    setIndex(next);
  }

  function step(d: number) {
    setDir(d);
    setIndex((safeIndex + d + personas.length) % personas.length);
  }

  return (
    <div>
      <SectionHeader
        icon={<Sparkles className="size-5" />}
        title="Persona profiles"
        description="Rich, research-ready profiles with goals, behaviors, and a personality radar."
      />

      {personas.length === 1 ? (
        // A single persona owns the stage — no empty column beside it.
        <div className="mx-auto max-w-3xl">
          <PersonaCard persona={personas[0]} index={0} controls={exportControls} />
        </div>
      ) : (
        <div>
          {/* Carousel controls */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {personas.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => goTo(i)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm font-medium transition-colors",
                    i === safeIndex
                      ? "bg-ink dark:bg-white dark:text-ink border-transparent text-white"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  <AvatarBlob
                    src={p.avatar.photo} initials={p.avatar.initials}
                    hue={p.avatar.hue}
                    className="size-6"
                  />
                  {p.name.split(" ")[0]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm tabular-nums">
                {safeIndex + 1} / {personas.length}
              </span>
              <button
                onClick={() => step(-1)}
                aria-label="Previous persona"
                className="border-border bg-card text-muted-foreground hover:text-foreground hover:border-brand/50 flex size-8 items-center justify-center rounded-full border transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Next persona"
                className="border-border bg-card text-muted-foreground hover:text-foreground hover:border-brand/50 flex size-8 items-center justify-center rounded-full border transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Sliding stage */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={active.id}
                custom={dir}
                initial={{ opacity: 0, x: dir * 90 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -90 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto max-w-3xl"
              >
                <PersonaCard persona={active} index={0} controls={exportControls} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Empathy map ----------------------------- */

const EMPATHY_QUADRANTS = [
  { key: "thinks", label: "Thinks", icon: Brain, accent: "bg-violet-500/12 text-violet-600 dark:text-violet-400" },
  { key: "feels", label: "Feels", icon: Heart, accent: "bg-rose-500/12 text-rose-600 dark:text-rose-400" },
  { key: "says", label: "Says", icon: MessageCircle, accent: "bg-sky-500/12 text-sky-600 dark:text-sky-400" },
  { key: "does", label: "Does", icon: Activity, accent: "bg-teal-500/12 text-teal-600 dark:text-teal-400" },
  { key: "pains", label: "Pains", icon: Frown, accent: "bg-amber-500/12 text-amber-600 dark:text-amber-400" },
  { key: "gains", label: "Gains", icon: Smile, accent: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" },
] as const;

export function EmpathyMapSection({ persona }: { persona: Persona }) {
  const em = persona.research.empathyMap;
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {EMPATHY_QUADRANTS.map((q, i) => (
        <InfoCard
          key={q.key}
          index={i}
          title={q.label}
          icon={<q.icon className="size-3.5" />}
          accent={q.accent}
        >
          <Bullets items={em[q.key]} />
        </InfoCard>
      ))}
    </div>
  );
}

/* ------------------------------ Journey map ----------------------------- */

export function JourneyMapSection({ persona }: { persona: Persona }) {
  const stages = persona.research.journeyMap;
  return (
    <div>
      {/* Sentiment line */}
      <div className="glass-card mb-4 rounded-2xl border p-5">
        <div className="text-muted-foreground mb-3 text-xs font-medium">
          Emotional journey
        </div>
        <div className="flex items-end justify-between gap-2">
          {stages.map((s, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="tabular-nums text-xs font-medium" style={{ color: sentimentColor(s.sentiment) }}>
                {s.sentiment}
              </span>
              <div className="bg-muted flex h-24 w-full items-end overflow-hidden rounded-md">
                <motion.div
                  className="w-full rounded-md"
                  style={{ backgroundColor: sentimentColor(s.sentiment) }}
                  initial={{ height: 0 }}
                  animate={{ height: `${s.sentiment}%` }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="text-muted-foreground text-center text-[10px]">
                {s.stage}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stage detail cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stages.map((s, i) => (
          <InfoCard key={i} index={i}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold">{s.stage}</span>
              <Badge
                variant="outline"
                className="font-normal"
                style={{ color: sentimentColor(s.sentiment), borderColor: sentimentColor(s.sentiment) }}
              >
                {s.emotion}
              </Badge>
            </div>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">Goal</dt>
                <dd>{s.goal}</dd>
              </div>
              <div>
                <dt className="text-rose-500/90 text-xs">Pain point</dt>
                <dd className="text-muted-foreground">{s.painPoint}</dd>
              </div>
              <div>
                <dt className="text-emerald-600/90 text-xs dark:text-emerald-400/90">
                  Opportunity
                </dt>
                <dd className="text-muted-foreground">{s.opportunity}</dd>
              </div>
            </dl>
          </InfoCard>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- JTBD --------------------------------- */

const JTBD_GROUPS = [
  { key: "functional", label: "Functional jobs", icon: Wrench, accent: "bg-sky-500/12 text-sky-600 dark:text-sky-400" },
  { key: "social", label: "Social jobs", icon: MessageCircle, accent: "bg-violet-500/12 text-violet-600 dark:text-violet-400" },
  { key: "emotional", label: "Emotional jobs", icon: Heart, accent: "bg-rose-500/12 text-rose-600 dark:text-rose-400" },
  { key: "consumption", label: "Consumption jobs", icon: Repeat, accent: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" },
] as const;

export function JtbdSection({ persona }: { persona: Persona }) {
  const jtbd = persona.research.jtbd;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {JTBD_GROUPS.map((g, i) => (
        <InfoCard key={g.key} index={i} title={g.label} icon={<g.icon className="size-3.5" />} accent={g.accent}>
          <ul className="space-y-2.5">
            {jtbd[g.key].map((job, j) => (
              <li
                key={j}
                className="bg-muted/40 border-l-brand/50 rounded-r-md border-l-2 px-3 py-2 text-sm leading-snug"
              >
                {job}
              </li>
            ))}
          </ul>
        </InfoCard>
      ))}
    </div>
  );
}

/* ----------------------------- Opportunities ---------------------------- */

const OPP_GROUPS = [
  { key: "ux", label: "UX opportunities", icon: Sparkles, accent: "bg-violet-500/12 text-violet-600 dark:text-violet-400" },
  { key: "business", label: "Business opportunities", icon: Briefcase, accent: "bg-sky-500/12 text-sky-600 dark:text-sky-400" },
  { key: "retention", label: "Retention opportunities", icon: Repeat, accent: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" },
  { key: "monetization", label: "Monetization opportunities", icon: DollarSign, accent: "bg-amber-500/12 text-amber-600 dark:text-amber-400" },
  { key: "accessibility", label: "Accessibility improvements", icon: Accessibility, accent: "bg-teal-500/12 text-teal-600 dark:text-teal-400" },
] as const;

export function OpportunitiesSection({ artifacts }: { artifacts: ProjectArtifacts }) {
  return (
    <div>
      <SectionHeader
        icon={<Lightbulb className="size-5" />}
        title="Opportunity areas"
        description="Where to invest for the biggest wins across UX, business, retention, and more."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {OPP_GROUPS.map((g, i) => (
          <InfoCard key={g.key} index={i} title={g.label} icon={<g.icon className="size-3.5" />} accent={g.accent}>
            <Bullets items={artifacts.opportunities[g.key]} />
          </InfoCard>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- Feature priority --------------------------- */

const MOSCOW = [
  { key: "mustHave", label: "Must have", tint: "border-t-rose-500", badge: "bg-rose-500/12 text-rose-600 dark:text-rose-400" },
  { key: "shouldHave", label: "Should have", tint: "border-t-amber-500", badge: "bg-amber-500/12 text-amber-600 dark:text-amber-400" },
  { key: "couldHave", label: "Could have", tint: "border-t-sky-500", badge: "bg-sky-500/12 text-sky-600 dark:text-sky-400" },
  { key: "future", label: "Future ideas", tint: "border-t-violet-500", badge: "bg-violet-500/12 text-violet-600 dark:text-violet-400" },
] as const;

export function FeaturesSection({ artifacts }: { artifacts: ProjectArtifacts }) {
  return (
    <div>
      <SectionHeader
        icon={<Target className="size-5" />}
        title="Feature prioritization"
        description="A MoSCoW breakdown — with the reasoning behind every placement."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {MOSCOW.map((col, ci) => (
          <div key={col.key} className={cn("glass-card rounded-2xl border border-t-2 p-4", col.tint)}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">{col.label}</span>
              <span className={cn("rounded-full px-1.5 text-xs tabular-nums", col.badge)}>
                {artifacts.features[col.key].length}
              </span>
            </div>
            <div className="space-y-2.5">
              {artifacts.features[col.key].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (ci * 0.05) + i * 0.03 }}
                  className="bg-muted/40 rounded-lg p-3"
                >
                  <div className="text-sm font-medium">{f.feature}</div>
                  <div className="text-muted-foreground mt-1 text-xs leading-snug">
                    {f.why}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ User stories ---------------------------- */

const PRIORITY_STYLE: Record<UserStory["priority"], string> = {
  Must: "bg-rose-500/12 text-rose-600 dark:text-rose-400",
  Should: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
  Could: "bg-sky-500/12 text-sky-600 dark:text-sky-400",
};

export function UserStoriesSection({ artifacts }: { artifacts: ProjectArtifacts }) {
  const [filter, setFilter] = useState<"All" | UserStory["priority"]>("All");
  const stories = artifacts.userStories.filter(
    (s) => filter === "All" || s.priority === filter,
  );
  const filters: ("All" | UserStory["priority"])[] = ["All", "Must", "Should", "Could"];
  return (
    <div>
      <SectionHeader
        icon={<Rocket className="size-5" />}
        title="User stories"
        description={`${artifacts.userStories.length} stories to feed straight into your backlog.`}
        action={
          <div className="bg-muted/60 inline-flex gap-1 rounded-lg border p-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  filter === f
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {stories.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="glass-card hover:border-brand/30 rounded-xl border p-4 text-sm transition-colors"
          >
            <div className="mb-2 flex items-center justify-between">
              <Badge variant="secondary" className="font-normal capitalize">
                {s.role}
              </Badge>
              <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", PRIORITY_STYLE[s.priority])}>
                {s.priority}
              </span>
            </div>
            <p className="leading-snug">
              <span className="text-muted-foreground">As a </span>
              {s.role}
              <span className="text-muted-foreground">, I want to </span>
              {s.want}
              <span className="text-muted-foreground">, so that </span>
              {s.soThat}.
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Product -------------------------------- */

export function ProductSection({ artifacts }: { artifacts: ProjectArtifacts }) {
  const p = artifacts.product;
  return (
    <div>
      <SectionHeader
        icon={<Rocket className="size-5" />}
        title="Product recommendations"
        description="Scope, risks, and the metrics that tell you it's working."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <InfoCard title="Top 10 features" icon={<Sparkles className="size-3.5" />}>
          <ol className="space-y-1.5">
            {p.topFeatures.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-brand tabular-nums w-5 shrink-0 font-medium">
                  {i + 1}.
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ol>
        </InfoCard>
        <div className="space-y-4">
          <InfoCard title="MVP scope" icon={<Target className="size-3.5" />} accent="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
            <Bullets items={p.mvpScope} />
          </InfoCard>
          <InfoCard title="Nice to have" icon={<Sparkles className="size-3.5" />}>
            <ChipList items={p.niceToHave} />
          </InfoCard>
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <InfoCard title="Biggest UX risks" icon={<Frown className="size-3.5" />} accent="bg-rose-500/12 text-rose-600 dark:text-rose-400">
          <Bullets items={p.uxRisks} />
        </InfoCard>
        <InfoCard title="Success metrics" icon={<TrendingUp className="size-3.5" />} accent="bg-sky-500/12 text-sky-600 dark:text-sky-400">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground text-xs font-medium">Activation</dt>
              <dd>{p.metrics.activation}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium">Retention</dt>
              <dd>{p.metrics.retention}</dd>
            </div>
            <div>
              <dt className="text-brand text-xs font-medium">★ North Star</dt>
              <dd>{p.metrics.northStar}</dd>
            </div>
          </dl>
        </InfoCard>
      </div>
    </div>
  );
}

/* ------------------------------ Marketing ------------------------------- */

export function MarketingSection({ artifacts }: { artifacts: ProjectArtifacts }) {
  const m = artifacts.marketing;
  const fields: { label: string; value: string; wide?: boolean }[] = [
    { label: "Positioning statement", value: m.positioning, wide: true },
    { label: "Value proposition", value: m.valueProposition, wide: true },
    { label: "Landing page headline", value: m.headline },
    { label: "Call to action", value: m.cta },
    { label: "Email subject line", value: m.emailSubject },
    { label: "Social media angle", value: m.socialAngle },
    { label: "Ad copy", value: m.adCopy, wide: true },
  ];
  return (
    <div>
      <SectionHeader
        icon={<TrendingUp className="size-5" />}
        title="Marketing recommendations"
        description="Positioning and copy ready to drop into your go-to-market."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f, i) => (
          <InfoCard
            key={f.label}
            index={i}
            title={f.label}
            className={cn(f.wide && "md:col-span-2")}
          >
            <p className="text-sm leading-relaxed">{f.value}</p>
          </InfoCard>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Design -------------------------------- */

export function DesignSection({ artifacts }: { artifacts: ProjectArtifacts }) {
  const d = artifacts.design;
  const fields: { label: string; value: string }[] = [
    { label: "Navigation", value: d.navigation },
    { label: "Information architecture", value: d.informationArchitecture },
    { label: "Dashboard layout", value: d.dashboardLayout },
    { label: "Onboarding", value: d.onboarding },
    { label: "Empty states", value: d.emptyStates },
    { label: "Error states", value: d.errorStates },
    { label: "Accessibility", value: d.accessibility },
    { label: "Visual hierarchy", value: d.visualHierarchy },
  ];
  return (
    <div>
      <SectionHeader
        icon={<Palette className="size-5" />}
        title="Design recommendations"
        description="Concrete UX direction for navigation, layout, states, and accessibility."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f, i) => (
          <InfoCard key={f.label} index={i} title={f.label} icon={<Palette className="size-3.5" />}>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.value}</p>
          </InfoCard>
        ))}
      </div>
    </div>
  );
}
