"use client";

// These hooks hydrate from localStorage on mount — the setState-in-effect calls
// below are the intentional client-hydration pattern, not a synchronization bug.
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";

import {
  PersonaSchema,
  ProjectSchema,
  type Brief,
  type Persona,
  type Project,
} from "./types";
import { z } from "zod";

const SAVED_KEY = "fouxium:saved";
const HISTORY_KEY = "fouxium:history";
const PROJECTS_KEY = "fouxium:projects";
const HISTORY_LIMIT = 24;

// One-time migration from earlier key namespaces (theaix:* and folium:* →
// fouxium:*) so existing saved personas, history, and projects survive the
// rename. Idempotent, newest-namespace-first: only copies when the new key is
// empty, so a more recent value always wins over an older one.
if (typeof window !== "undefined") {
  for (const [legacy, current] of [
    ["theaix:saved", SAVED_KEY],
    ["folium:saved", SAVED_KEY],
    ["theaix:history", HISTORY_KEY],
    ["folium:history", HISTORY_KEY],
    ["theaix:projects", PROJECTS_KEY],
    ["folium:projects", PROJECTS_KEY],
  ] as const) {
    try {
      const value = window.localStorage.getItem(legacy);
      if (value !== null && window.localStorage.getItem(current) === null) {
        window.localStorage.setItem(current, value);
        window.localStorage.removeItem(legacy);
      }
    } catch {
      /* storage unavailable — nothing to migrate */
    }
  }
}

const SavedSchema = z.array(PersonaSchema);

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readJson<T>(key: string, schema: z.ZodType<T>, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private-mode — fail silently */
  }
}

/* ------------------------------------------------------------------ */
/* Saved personas                                                      */
/* ------------------------------------------------------------------ */

export function useSavedPersonas() {
  const [saved, setSaved] = useState<Persona[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSaved(readJson(SAVED_KEY, SavedSchema, []));
    setHydrated(true);
    function onStorage(e: StorageEvent) {
      if (e.key === SAVED_KEY) setSaved(readJson(SAVED_KEY, SavedSchema, []));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((updater: (prev: Persona[]) => Persona[]) => {
    setSaved((prev) => {
      const next = updater(prev);
      writeJson(SAVED_KEY, next);
      return next;
    });
  }, []);

  const save = useCallback(
    (persona: Persona) =>
      commit((prev) =>
        prev.some((p) => p.id === persona.id) ? prev : [persona, ...prev],
      ),
    [commit],
  );

  const remove = useCallback(
    (id: string) => commit((prev) => prev.filter((p) => p.id !== id)),
    [commit],
  );

  const clear = useCallback(() => commit(() => []), [commit]);

  const toggleFavorite = useCallback(
    (id: string) =>
      commit((prev) =>
        prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)),
      ),
    [commit],
  );

  const duplicate = useCallback(
    (persona: Persona) =>
      commit((prev) => {
        const copy: Persona = {
          ...persona,
          id: newId(),
          favorite: false,
          createdAt: new Date().toISOString(),
        };
        const idx = prev.findIndex((p) => p.id === persona.id);
        if (idx === -1) return [copy, ...prev];
        const next = [...prev];
        next.splice(idx + 1, 0, copy);
        return next;
      }),
    [commit],
  );

  const isSaved = useCallback(
    (id: string) => saved.some((p) => p.id === id),
    [saved],
  );

  return {
    saved,
    hydrated,
    save,
    remove,
    clear,
    toggleFavorite,
    duplicate,
    isSaved,
  };
}

/* ------------------------------------------------------------------ */
/* Generation history                                                  */
/* ------------------------------------------------------------------ */

export const HistoryEntrySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  source: z.enum(["ai", "local"]),
  brief: z.object({
    product: z.string(),
    audience: z.string().optional(),
    industry: z.string(),
    tone: z.string(),
    count: z.number(),
  }),
  personas: z.array(PersonaSchema),
});
export type HistoryEntry = z.infer<typeof HistoryEntrySchema>;

const HistorySchema = z.array(HistoryEntrySchema);

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHistory(readJson(HISTORY_KEY, HistorySchema, []));
    setHydrated(true);
    function onStorage(e: StorageEvent) {
      if (e.key === HISTORY_KEY)
        setHistory(readJson(HISTORY_KEY, HistorySchema, []));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback(
    (updater: (prev: HistoryEntry[]) => HistoryEntry[]) => {
      setHistory((prev) => {
        const next = updater(prev).slice(0, HISTORY_LIMIT);
        writeJson(HISTORY_KEY, next);
        return next;
      });
    },
    [],
  );

  const add = useCallback(
    (entry: { brief: Brief; personas: Persona[]; source: "ai" | "local" }) =>
      commit((prev) => [
        {
          id: newId(),
          createdAt: new Date().toISOString(),
          source: entry.source,
          brief: entry.brief,
          personas: entry.personas,
        },
        ...prev,
      ]),
    [commit],
  );

  const remove = useCallback(
    (id: string) => commit((prev) => prev.filter((e) => e.id !== id)),
    [commit],
  );

  const clear = useCallback(() => commit(() => []), [commit]);

  return { history, hydrated, add, remove, clear };
}

/* ------------------------------------------------------------------ */
/* Research projects                                                   */
/* ------------------------------------------------------------------ */

const ProjectsSchema = z.array(ProjectSchema);

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProjects(readJson(PROJECTS_KEY, ProjectsSchema, []));
    setHydrated(true);
    function onStorage(e: StorageEvent) {
      if (e.key === PROJECTS_KEY)
        setProjects(readJson(PROJECTS_KEY, ProjectsSchema, []));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((updater: (prev: Project[]) => Project[]) => {
    setProjects((prev) => {
      const next = updater(prev);
      writeJson(PROJECTS_KEY, next);
      return next;
    });
  }, []);

  const save = useCallback(
    (project: Project) =>
      commit((prev) => {
        const idx = prev.findIndex((p) => p.id === project.id);
        if (idx === -1) return [project, ...prev];
        const next = [...prev];
        next[idx] = project;
        return next;
      }),
    [commit],
  );

  const remove = useCallback(
    (id: string) => commit((prev) => prev.filter((p) => p.id !== id)),
    [commit],
  );

  const toggleFavorite = useCallback(
    (id: string) =>
      commit((prev) =>
        prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)),
      ),
    [commit],
  );

  const duplicate = useCallback(
    (project: Project) =>
      commit((prev) => {
        const copy: Project = {
          ...project,
          id: newId(),
          name: `${project.name} (copy)`,
          favorite: false,
          createdAt: new Date().toISOString(),
        };
        const idx = prev.findIndex((p) => p.id === project.id);
        if (idx === -1) return [copy, ...prev];
        const next = [...prev];
        next.splice(idx + 1, 0, copy);
        return next;
      }),
    [commit],
  );

  const rename = useCallback(
    (id: string, name: string) =>
      commit((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p))),
    [commit],
  );

  const clear = useCallback(() => commit(() => []), [commit]);

  const isSaved = useCallback(
    (id: string) => projects.some((p) => p.id === id),
    [projects],
  );

  return {
    projects,
    hydrated,
    save,
    remove,
    toggleFavorite,
    duplicate,
    rename,
    clear,
    isSaved,
  };
}
