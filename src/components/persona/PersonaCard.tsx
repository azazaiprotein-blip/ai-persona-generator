"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Accessibility,
  Activity,
  Briefcase,
  Cake,
  Compass,
  Flame,
  Lightbulb,
  MapPin,
  Quote,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { JourneyStage, Persona } from "@/lib/types";
import { AvatarBlob } from "./AvatarBlob";
import { PersonalityRadar, type RadarAxis } from "./PersonalityRadar";
import {
  PersonaCardActions,
  type PersonaControls,
} from "./PersonaCardActions";

interface PersonaCardProps {
  persona: Persona;
  index?: number;
  controls?: PersonaControls;
  className?: string;
}

function rightTrait(label: string): string {
  const parts = label.split("↔");
  return (parts[1] ?? parts[0]).trim();
}

function sentimentColor(v: number): string {
  return `hsl(${Math.round(v * 1.15)} 62% 48%)`;
}

function TraitList({
  title,
  icon,
  items,
  accent,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  accent: string;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span
          className={cn(
            "flex size-6 items-center justify-center rounded-md",
            accent,
          )}
        >
          {icon}
        </span>
        {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="text-muted-foreground flex gap-2 text-sm leading-snug"
          >
            <span className="bg-current mt-1.5 size-1 shrink-0 rounded-full opacity-40" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TagRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-muted-foreground w-16 shrink-0 text-xs font-medium">
        {label}
      </span>
      {items.map((item) => (
        <Badge key={item} variant="secondary" className="font-normal">
          {item}
        </Badge>
      ))}
    </div>
  );
}

function JourneyTimeline({ journey }: { journey: JourneyStage[] }) {
  return (
    <ol className="border-border/70 relative ml-1 space-y-4 border-l pl-6">
      {journey.map((stage, i) => (
        <motion.li
          key={stage.stage}
          className="relative"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.06 }}
        >
          <span
            className="ring-card absolute top-0.5 -left-[31px] size-3 rounded-full ring-4"
            style={{ backgroundColor: sentimentColor(stage.sentiment) }}
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">{stage.stage}</span>
            <span
              className="tabular-nums text-xs font-medium"
              style={{ color: sentimentColor(stage.sentiment) }}
            >
              {stage.sentiment}
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-snug">
            {stage.summary}
          </p>
        </motion.li>
      ))}
    </ol>
  );
}

export function PersonaCard({
  persona,
  index = 0,
  controls,
  className,
}: PersonaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const radarAxes: RadarAxis[] = [
    ...persona.meters.map((m) => ({ label: rightTrait(m.label), value: m.value })),
    { label: "Tech", value: persona.techProficiency },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn("h-full", className)}
    >
      <Card
        ref={cardRef}
        className="hover:border-brand/40 h-full gap-6 overflow-hidden p-6 shadow-sm transition-[box-shadow,border-color] duration-300 hover:shadow-lg"
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="bg-brand-gradient absolute -inset-0.5 rounded-full opacity-40 blur-[3px]" />
            <AvatarBlob
              src={persona.avatar.photo}
              initials={persona.avatar.initials}
              hue={persona.avatar.hue}
              className="relative size-14 ring-2 ring-[var(--card)]"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <h3 className="text-lg font-semibold tracking-tight">
                {persona.name}
              </h3>
              <span className="text-muted-foreground text-xs">
                {persona.pronouns}
              </span>
              {persona.favorite && (
                <span className="text-rose-500">
                  <Sparkles className="size-3.5" />
                </span>
              )}
            </div>
            <Badge variant="brand" className="mt-1.5">
              <Sparkles className="size-3" />
              {persona.archetype}
            </Badge>
          </div>
          {controls && (
            <PersonaCardActions
              persona={persona}
              exportRef={cardRef}
              controls={controls}
            />
          )}
        </div>

        {/* Meta */}
        <div className="text-muted-foreground -mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5">
            <Briefcase className="size-3.5" />
            {persona.occupation}, {persona.company}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {persona.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Cake className="size-3.5" />
            {persona.age}
          </span>
        </div>

        {/* Quote */}
        <blockquote className="border-l-brand bg-muted/40 relative overflow-hidden rounded-r-lg rounded-l border-l-2 px-4 py-3 text-sm italic">
          <Quote className="text-brand/25 absolute top-2 right-2 size-6" />
          <span className="text-foreground/90 relative">“{persona.quote}”</span>
        </blockquote>

        {/* Bio */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {persona.bio}
        </p>

        <Separator />

        {/* Personality radar + tech + traits */}
        <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,220px)_1fr]">
          <div className="mx-auto">
            <PersonalityRadar axes={radarAxes} />
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
                <span>Tech proficiency</span>
                <span className="text-foreground tabular-nums">
                  {Math.round(persona.techProficiency)}%
                </span>
              </div>
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <motion.div
                  className="bg-brand h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${persona.techProficiency}%` }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {persona.traits.map((t) => (
                <Badge key={t} variant="brand" className="font-normal">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Goals & pain points */}
        <div className="grid gap-5 sm:grid-cols-2">
          <TraitList
            title="Goals"
            icon={<Target className="size-3.5" />}
            items={persona.goals}
            accent="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
          />
          <TraitList
            title="Pain points"
            icon={<TriangleAlert className="size-3.5" />}
            items={persona.frustrations}
            accent="bg-rose-500/12 text-rose-600 dark:text-rose-400"
          />
        </div>

        {/* Jobs to be done */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="bg-sky-500/12 flex size-6 items-center justify-center rounded-md text-sky-600 dark:text-sky-400">
              <Compass className="size-3.5" />
            </span>
            Jobs to be done
          </div>
          <div className="grid gap-2">
            {persona.jtbd.map((job) => (
              <p
                key={job}
                className="bg-muted/40 border-l-brand/50 rounded-r-md border-l-2 px-3 py-2 text-sm leading-snug"
              >
                {job}
              </p>
            ))}
          </div>
        </div>

        {/* Journey */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="bg-violet-500/12 flex size-6 items-center justify-center rounded-md text-violet-600 dark:text-violet-400">
              <Activity className="size-3.5" />
            </span>
            Journey
          </div>
          <JourneyTimeline journey={persona.journey} />
        </div>

        {/* Recommendations */}
        <div className="aura relative space-y-2.5 rounded-xl bg-brand-subtle/40 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="bg-brand/15 text-brand flex size-6 items-center justify-center rounded-md">
              <Lightbulb className="size-3.5" />
            </span>
            Recommendations
          </div>
          <ul className="space-y-1.5">
            {persona.recommendations.map((rec) => (
              <li key={rec} className="flex gap-2 text-sm leading-snug">
                <Sparkles className="text-brand mt-0.5 size-3.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Motivations & behaviors */}
        <div className="grid gap-5 sm:grid-cols-2">
          <TraitList
            title="Motivations"
            icon={<Flame className="size-3.5" />}
            items={persona.motivations}
            accent="bg-amber-500/12 text-amber-600 dark:text-amber-400"
          />
          <TraitList
            title="Behaviors"
            icon={<Activity className="size-3.5" />}
            items={persona.behaviors}
            accent="bg-teal-500/12 text-teal-600 dark:text-teal-400"
          />
        </div>

        {/* Profile: devices, buying, accessibility */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <Smartphone className="size-3.5" />
              Devices
            </div>
            <div className="flex flex-wrap gap-1.5">
              {persona.devices.map((d) => (
                <Badge key={d} variant="secondary" className="font-normal">
                  {d}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <ShoppingBag className="size-3.5" />
              Buying behavior
            </div>
            <p className="text-muted-foreground text-sm leading-snug">
              {persona.buyingBehavior}
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <Accessibility className="size-3.5" />
              Accessibility
            </div>
            <div className="flex flex-wrap gap-1.5">
              {persona.accessibilityNeeds.map((a) => (
                <Badge key={a} variant="outline" className="font-normal">
                  {a}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Channels & tools */}
        <div className="space-y-2.5">
          <TagRow label="Channels" items={persona.channels} />
          <TagRow label="Tools" items={persona.tools} />
        </div>

        <p className="text-muted-foreground/70 text-xs">
          {persona.source === "ai"
            ? `Crafted with ${persona.model ?? "Claude"}`
            : "Generated with the built-in engine"}
        </p>
      </Card>
    </motion.div>
  );
}
