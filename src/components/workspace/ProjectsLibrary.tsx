"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Files,
  FolderOpen,
  Heart,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { AvatarBlob } from "@/components/persona/AvatarBlob";
import { EmptyState } from "@/components/persona/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

interface ProjectsLibraryProps {
  projects: Project[];
  onOpen: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectsLibrary({
  projects,
  onOpen,
  onDuplicate,
  onToggleFavorite,
  onDelete,
}: ProjectsLibraryProps) {
  const [query, setQuery] = useState("");
  const [favOnly, setFavOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => (favOnly ? p.favorite : true))
      .filter((p) =>
        !q
          ? true
          : `${p.name} ${p.brief.product} ${p.brief.industry} ${p.personas
              .map((x) => x.name)
              .join(" ")}`
              .toLowerCase()
              .includes(q),
      )
      .sort((a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite)));
  }, [projects, query, favOnly]);

  const favCount = projects.filter((p) => p.favorite).length;

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<FolderOpen className="size-6" />}
        title="No saved projects yet"
        description="Generate a research package and hit Save to keep it here — stored locally in your browser."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="pl-9"
          />
        </div>
        <Button
          variant={favOnly ? "brand" : "outline"}
          size="sm"
          onClick={() => setFavOnly(!favOnly)}
        >
          <Heart className={cn("size-4", favOnly && "fill-current")} />
          Favorites{favCount > 0 ? ` (${favCount})` : ""}
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="size-6" />}
          title="No matches"
          description="Try a different search term or clear the favorites filter."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.03 }}
                className="group glass-card hover:border-brand/40 flex flex-col rounded-2xl border p-5 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => onOpen(project)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <h3 className="truncate font-semibold tracking-tight">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm">
                      {project.brief.product}
                    </p>
                  </button>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("size-8", project.favorite && "text-rose-500")}
                      aria-label="Favorite"
                      onClick={() => onToggleFavorite(project.id)}
                    >
                      <Heart className={cn("size-4", project.favorite && "fill-rose-500")} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8" aria-label="Project actions">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onOpen(project)}>
                          <FolderOpen />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            onDuplicate(project);
                            toast.success("Duplicated project");
                          }}
                        >
                          <Files />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            onDelete(project.id);
                            toast("Deleted project");
                          }}
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  <Badge variant="secondary" className="font-normal">
                    {project.brief.industry}
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    {project.source === "ai" ? "Claude" : "built-in"}
                  </Badge>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.personas.map((p) => (
                      <AvatarBlob
                        key={p.id}
                        src={p.avatar.photo}
                        initials={p.avatar.initials}
                        hue={p.avatar.hue}
                        className="size-7 ring-2 ring-[var(--card)]"
                      />
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpen(project)}
                    className="text-brand opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Open
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
