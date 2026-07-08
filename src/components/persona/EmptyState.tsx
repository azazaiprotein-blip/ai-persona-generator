"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "border-border/70 flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center",
        className,
      )}
    >
      <div className="bg-brand-subtle text-brand relative mb-4 flex size-12 items-center justify-center rounded-xl">
        <span className="bg-brand/20 absolute inset-0 animate-ping rounded-xl [animation-duration:2.4s]" />
        <span className="relative">{icon ?? <Users className="size-6" />}</span>
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm text-balance">
        {description}
      </p>
    </motion.div>
  );
}
