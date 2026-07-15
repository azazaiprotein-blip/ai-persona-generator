import { NextResponse } from "next/server";

import { generatePersonasWithAI, isAiConfigured } from "@/lib/anthropic";
import { generatePersonas } from "@/lib/generator";
import { enrichPersona } from "@/lib/persona-utils";
import { buildPersonaResearch, buildProjectArtifacts } from "@/lib/research";
import {
  BriefSchema,
  type GenerateResponse,
  type Persona,
  type PersonaCore,
} from "@/lib/types";
import type { Brief } from "@/lib/types";

// Persona generation is dynamic (no caching) and may call an external API.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Enrich persona cores into full personas with derived research. */
function assemble(
  cores: PersonaCore[],
  source: Persona["source"],
  brief: Brief,
  model?: string,
): Persona[] {
  return cores.map((core) => {
    const base = enrichPersona(core, source, model);
    return { ...base, research: buildPersonaResearch(core, brief, base.id) };
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = BriefSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid brief.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const brief = parsed.data;

  // Preferred path: generate the full package with Claude when a key is
  // configured — personas AND their research packs AND the project artifacts,
  // all grounded in the brief rather than template-derived.
  if (isAiConfigured()) {
    try {
      const { personas: cores, artifacts, model } = await generatePersonasWithAI(brief);
      const personas: Persona[] = cores.map((core) => {
        const base = enrichPersona(core, "ai", model);
        return { ...base, research: core.research };
      });
      const response: GenerateResponse = {
        personas,
        artifacts,
        source: "ai",
        model,
      };
      return NextResponse.json(response);
    } catch (error) {
      console.error("AI generation failed, falling back to local:", error);
    }
  }

  const cores = generatePersonas(brief);
  const response: GenerateResponse = {
    personas: assemble(cores, "local", brief),
    artifacts: buildProjectArtifacts(brief, cores),
    source: "local",
  };
  return NextResponse.json(response);
}
