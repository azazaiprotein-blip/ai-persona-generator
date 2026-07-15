import Anthropic from "@anthropic-ai/sdk";

import {
  PERSONA_RESPONSE_JSON_SCHEMA,
  PersonaCoreSchema,
  PersonaResearchSchema,
  ProjectArtifactsSchema,
  type Brief,
  type PersonaCore,
  type PersonaResearch,
  type ProjectArtifacts,
} from "./types";
import { z } from "zod";

/** Default to the most capable Opus model; allow an override via env. */
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

export function isAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** A persona core plus its AI-written research pack. */
export type AiPersonaCore = PersonaCore & { research: PersonaResearch };

const ResponseSchema = z.object({
  personas: z.array(PersonaCoreSchema.extend({ research: PersonaResearchSchema })),
  artifacts: ProjectArtifactsSchema,
});

/**
 * System prompt: define the researcher, the analyse-first workflow, and the
 * quality bar. Written as guidance rather than a wall of "MUST" directives —
 * Opus-tier models follow the system prompt closely, and over-prescription
 * lowers output quality. Adaptive thinking (enabled on the request) is what
 * lets the model actually run the analysis and the self-review below before
 * it emits the structured personas.
 */
function buildSystemPrompt(): string {
  return [
    "You are a senior UX researcher who has run discovery for products across many industries. You build personas that feel like real, specific people a product team could recruit and interview — not demographic placeholders.",
    "",
    "Before writing a single persona, reason through this product's world:",
    "- Product category, business model, and how it actually makes money.",
    "- The value proposition and the jobs people are really hiring it to do.",
    "- Who uses it versus who pays for it, and the goals that drive each.",
    "- The likely competitors and the alternatives people use today (including doing nothing).",
    "- Geographic and cultural context, and how technology-comfortable this audience genuinely is.",
    "",
    "Infer the pressures that come with the domain even when the brief doesn't spell them out. A fintech product carries trust, security, and money-anxiety; a healthcare product carries privacy and high personal stakes; a travel product has seasonality and trip-planning stress; a logistics platform lives or dies on operational efficiency and reliability. Let these realities shape who the personas are and what they worry about.",
    "",
    "Derive the personas from the distinct user segments that naturally emerge for THIS product — never a generic template. A food-delivery app surfaces people like the time-pressed office worker, the budget-conscious student, the family meal-planner, and the late-shift professional; a travel app surfaces the budget backpacker, the luxury traveler, the business traveler, the digital nomad. Choose the segments that genuinely differ in goals, context, and what would make them adopt or abandon the product — and include at least one skeptic or reluctant user. Two different products should never produce interchangeable personas.",
    "",
    "Make every field concrete and grounded in that person's real life. Favor specifics over adjectives. Weak: \"wants an easy-to-use app.\" Strong: \"has fifteen minutes before the school run and needs to reorder the family's usual groceries without comparing twenty options.\" Write goals, frustrations, motivations, and behaviors as short, real phrases — their routines, their emotional drivers, what actually triggers a purchase, and the specific objections that make them hesitate. The quote must sound like something the person would say out loud in an interview, in the requested tone — never a marketing slogan.",
    "",
    "Push for real diversity across the set: ages, occupations, digital literacy, personalities, living situations, and honest accessibility needs (use \"no specific needs\" when that's the truth — don't invent needs to look thorough).",
    "",
    "Field conventions: personality meters use a 0–100 scale where the label names the spectrum (0 = left trait, 100 = right trait). Jobs-to-be-done use the \"When ___, I want to ___, so I can ___\" form. The journey runs Awareness → Advocacy with a realistic sentiment (0–100) at each stage, including a dip where friction is genuinely likely for THIS product. Recommendations are concrete product or go-to-market moves for winning THIS persona for THIS product — they should be impossible to paste onto an unrelated app.",
    "",
    "Each persona also carries a research pack, written to the same bar:",
    "- Empathy map (thinks / feels / says / does / pains / gains): every entry is a concrete, situated observation from this persona's actual week — the sentence they'd mutter at their desk, the workaround they run today, the thing they'd ask a colleague before trying this product. Name real situations, tools, amounts, and time pressures from their world. Nothing that could be pasted under a different persona.",
    "- Journey map, exactly six stages in order: Awareness, Research, Decision, Onboarding, Daily Usage, Retention. Say where THIS persona would genuinely first hear of a product like this (the specific channel or community), what they'd compare it against (real alternative categories or competitors), the precise objection that stalls the Decision, the first-session moment that makes or breaks Onboarding, the habit the product must slot into for Daily Usage, and what would realistically lure them away at Retention. Sentiment values must tell an honest story with a visible dip.",
    "- Jobs-to-be-done in four categories (functional, social, emotional, consumption), each anchored in one of this persona's real situations rather than generic tool-buying behavior.",
    "",
    "You also write the project-level strategy artifacts: opportunity areas, a MoSCoW feature board, 12–17 user stories, product recommendations with measurable metrics, marketing copy, and design direction. Ground all of it in the product and the personas you just created: features that only make sense for this product, user stories in the personas' actual roles and vocabulary, marketing copy that names the product's actual value in the requested tone, metrics tied to this product's real activation moment, and design direction that reflects its real workflows. Never fall back on interchangeable SaaS boilerplate like \"guided onboarding\", \"fewer tabs\", or \"results dashboard\" unless that is genuinely what this specific product needs — and then say it in this product's terms.",
    "",
    "Before you finish, reread everything — personas, empathy maps, journeys, jobs, and artifacts — and ask of each line: could this belong to a different product? If yes, sharpen it until it couldn't. This specificity is the entire value of the output.",
    "",
    "Return only data that conforms to the provided schema.",
  ].join("\n");
}

/**
 * User prompt: give the model the brief plus the intent behind it, and ask for
 * the analyse-then-generate flow explicitly. Opus reasons better when it knows
 * *why* it's being asked, and the "reason … then decide … then write" framing
 * pairs with adaptive thinking to produce the internal analysis the personas
 * are built on.
 */
function buildUserPrompt(brief: Brief): string {
  const audience = brief.audience?.trim()
    ? `Target audience: ${brief.audience.trim()}`
    : "Target audience: (not specified — infer the most plausible primary and secondary audiences from the product and industry)";

  return [
    "I'm building the product below and need a research-grade package I could actually act on: personas I could recruit and interview, plus their empathy maps, journey maps, jobs-to-be-done, and the project-level strategy artifacts. Generic or repetitive output is worse than useless to me — every line must clearly belong to THIS product.",
    "",
    `Product / service: ${brief.product}`,
    audience,
    `Industry: ${brief.industry}`,
    `Tone of voice for quotes and marketing copy: ${brief.tone}`,
    `Number of personas to generate: ${brief.count}`,
    "",
    "First, reason through this product's world — its category and business model, the jobs people hire it for, the competitors and alternatives, the geographic and cultural context, how tech-comfortable this audience really is, and the domain pressures that come with it. Then decide which distinct, high-value user segments genuinely deserve their own persona here. Only then write the personas, their research packs, and the strategy artifacts.",
    "",
    `Generate exactly ${brief.count} personas, each with a full research pack (empathy map, six-stage journey map, categorized jobs-to-be-done). Each persona must be meaningfully different from the others in goals, temperament, life context, and technology comfort. Then write the project artifacts grounded in those personas. The whole package must read like it was researched for this exact product — reuse the brief's own vocabulary where it helps.`,
  ].join("\n");
}

/**
 * Generate persona cores with Claude. Throws if the API errors or the response
 * fails schema validation — callers are expected to fall back to the local
 * generator on failure.
 *
 * Uses adaptive thinking so the model runs the domain analysis and self-review
 * before emitting personas, and streams the response because the higher
 * max_tokens (thinking + rich structured output for up to a few personas)
 * would otherwise risk an HTTP timeout on a non-streaming request.
 */
export async function generatePersonasWithAI(brief: Brief): Promise<{
  personas: AiPersonaCore[];
  artifacts: ProjectArtifacts;
  model: string;
}> {
  const client = new Anthropic();

  // `output_config` (structured outputs + effort) and `thinking` are the
  // current canonical params; cast defensively in case the installed SDK's
  // types predate them.
  const params = {
    model: MODEL,
    max_tokens: 48000,
    thinking: { type: "adaptive" },
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: buildUserPrompt(brief) }],
    output_config: {
      effort: "high",
      format: {
        type: "json_schema",
        schema: PERSONA_RESPONSE_JSON_SCHEMA,
      },
    },
  } as unknown as Parameters<typeof client.messages.stream>[0];

  const stream = client.messages.stream(params);
  const message = await stream.finalMessage();

  // The structured-output text block carries the JSON; thinking blocks are
  // separate and filtered out here.
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
    artifacts: parsed.artifacts,
    model: message.model ?? MODEL,
  };
}
