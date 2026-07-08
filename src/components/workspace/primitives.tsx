"use client";

import { motion } from "framer-motion";

import { AvatarBlob } from "@/components/persona/AvatarBlob";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Persona } from "@/lib/types";

export function SectionHeader({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {icon && (
          <span className="bg-brand-subtle text-brand mt-0.5 flex size-9 items-center justify-center rounded-xl">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
              {description}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

export function InfoCard({
  title,
  icon,
  accent,
  children,
  className,
  index = 0,
}: {
  title?: string;
  icon?: React.ReactNode;
  accent?: string;
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className={cn(
        "glass-card hover:border-brand/30 rounded-2xl border p-5 transition-colors",
        className,
      )}
    >
      {title && (
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          {icon && (
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-md",
                accent ?? "bg-brand-subtle text-brand",
              )}
            >
              {icon}
            </span>
          )}
          {title}
        </div>
      )}
      {children}
    </motion.div>
  );
}

export function Bullets({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((item, i) => (
        <li
          key={i}
          className="text-muted-foreground flex gap-2 text-sm leading-snug"
        >
          <span className="bg-brand/50 mt-1.5 size-1.5 shrink-0 rounded-full" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ChipList({
  items,
  variant = "secondary",
}: {
  items: string[];
  variant?: "secondary" | "brand" | "outline";
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item} variant={variant} className="font-normal">
          {item}
        </Badge>
      ))}
    </div>
  );
}

/** A segmented persona picker used by per-persona sections. */
export function PersonaSwitcher({
  personas,
  activeId,
  onSelect,
}: {
  personas: Persona[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  if (personas.length < 2) return null;
  return (
    <div className="bg-muted/60 inline-flex flex-wrap gap-1 rounded-lg border p-1">
      {personas.map((p) => {
        const active = p.id === activeId;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={cn(
              "relative flex items-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="persona-switch"
                className="bg-background absolute inset-0 rounded-md shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <AvatarBlob
              src={p.avatar.photo}
              initials={p.avatar.initials}
              hue={p.avatar.hue}
              className="relative z-10 size-5"
            />
            <span className="relative z-10">{p.name.split(" ")[0]}</span>
          </button>
        );
      })}
    </div>
  );
}
