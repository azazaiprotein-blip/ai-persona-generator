import Anthropic from "@anthropic-ai/sdk";

import {
  PERSONA_RESPONSE_JSON_SCHEMA,
  PersonaCoreSchema,
  type Brief,
  type PersonaCore,
} from "./types";
import { z } from "zod";

/** Default to the most capable Opus model; allow an override via env. */
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const ResponseSchema = z.object({
  personas: z.array(PersonaCoreSchema),
});

function buildSystemPrompt(): string {
  return [
    "You are an expert UX researcher and brand strategist who builds vivid, realistic user personas.",
    "Given a short product brief, invent distinct, believable personas grounded in the product's industry and audience.",
    "Make each persona feel like a real, specific person — varied names, ages, backgrounds, and viewpoints. Avoid clichés and avoid making every persona a fan of the product; include realistic skepticism.",
    "Write goals, frustrations, motivations, and behaviors as concrete, concise phrases (not full sentences).",
    "The quote must be first-person and reflect the requested tone of voice.",
    "Include realistic devices, a one-sentence buying behavior, and honest accessibility needs (use 'no specific needs' when appropriate).",
    "Personality meters use a 0–100 scale where the label describes the spectrum (0 = left trait, 100 = right trait).",
    "Jobs-to-be-done should be written in the \"When ___, I want to ___, so I can ___\" format.",
    "The journey should move from Awareness through Advocacy, with a realistic sentiment (0–100) at each stage — including a dip where friction is likely.",
    "Recommendations should be concrete, actionable product or marketing moves for winning this persona.",
    "Return only data that conforms to the provided schema.",
  ].join(" ");
}

function buildUserPrompt(brief: Brief): string {
  const lines = [
    `Product / service: ${brief.product}`,
    brief.audience ? `Target audience: ${brief.audience}` : `Target audience: (infer a plausible one)`,
    `Industry: ${brief.industry}`,
    `Tone of voice for quotes: ${brief.tone}`,
    `Number of personas to generate: ${brief.count}`,
    "",
    "Generate exactly the requested number of distinct personas. Each should feel meaningfully different from the others (different goals, temperaments, and levels of tech comfort).",
  ];
  return lines.join("\n");
}

/**
 * Generate persona cores with Claude. Throws if the API errors or the response
 * fails schema validation — callers are expected to fall back to the local
 * generator on failure.
 */
export async function generatePersonasWithAI(
  brief: Brief,
): Promise<{ personas: PersonaCore[]; model: string }> {
  const client = new Anthropic();

  // `output_config` is the canonical structured-output param; cast defensively
  // in case the installed SDK's types predate it.
  const params = {
    model: MODEL,
    max_tokens: 8000,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: buildUserPrompt(brief) }],
    output_config: {
      format: {
        type: "json_schema",
        schema: PERSONA_RESPONSE_JSON_SCHEMA,
      },
    },
  } as unknown as Anthropic.MessageCreateParamsNonStreaming;

  const message: Anthropic.Message = await client.messages.create(params);

  const text = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  if (!text.trim()) {
    throw new Error("Empty response from model");
  }

  const parsed = ResponseSchema.parse(JSON.parse(text));
  return {
    personas: parsed.personas.slice(0, brief.count),
    model: message.model ?? MODEL,
  };
}
