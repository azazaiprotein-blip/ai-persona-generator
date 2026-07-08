import { z } from "zod";

/**
 * Option lists shared by the form, the local generator, and the Claude prompt.
 */
export const INDUSTRIES = [
  "Technology / SaaS",
  "E-commerce / Retail",
  "Finance / Fintech",
  "Healthcare",
  "Education",
  "Media / Entertainment",
  "Travel / Hospitality",
  "Real Estate",
  "Food & Beverage",
  "Gaming",
  "Nonprofit",
  "Other",
] as const;

export const TONES = [
  "Professional",
  "Friendly",
  "Witty",
  "Inspirational",
  "Analytical",
] as const;

export type Industry = (typeof INDUSTRIES)[number];
export type Tone = (typeof TONES)[number];

export const MIN_PERSONAS = 1;
export const MAX_PERSONAS = 3;

/**
 * The brief the user fills in. This is validated on both the client (form) and
 * the server (API route) so we never trust unvalidated input.
 */
export const BriefSchema = z.object({
  product: z
    .string()
    .trim()
    .min(3, "Tell us a little more about your product (min 3 characters).")
    .max(600, "Keep the product description under 600 characters."),
  audience: z
    .string()
    .trim()
    .max(400, "Keep the audience description under 400 characters.")
    .optional()
    .or(z.literal("")),
  industry: z.enum(INDUSTRIES),
  tone: z.enum(TONES),
  count: z.coerce.number().int().min(MIN_PERSONAS).max(MAX_PERSONAS),
});

export type Brief = z.infer<typeof BriefSchema>;

export const DEFAULT_BRIEF: Brief = {
  product: "",
  audience: "",
  industry: "Technology / SaaS",
  tone: "Friendly",
  count: 2,
};

/**
 * A single personality meter, e.g. Introvert (0) ←→ Extrovert (100).
 */
export const MeterSchema = z.object({
  label: z.string().min(1),
  value: z.number().min(0).max(100),
});
export type Meter = z.infer<typeof MeterSchema>;

/** A single stage in the persona's journey with the product. */
export const JourneyStageSchema = z.object({
  stage: z.string().min(1),
  summary: z.string().min(1),
  sentiment: z.number().min(0).max(100),
});
export type JourneyStage = z.infer<typeof JourneyStageSchema>;

/**
 * The subset of a persona the generator (AI or local) is responsible for
 * producing. Server-side we enrich this with id / source / avatar / timestamp.
 */
export const PersonaCoreSchema = z.object({
  name: z.string().min(1),
  archetype: z.string().min(1),
  age: z.number().int().min(16).max(90),
  pronouns: z.string().min(1),
  occupation: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  bio: z.string().min(1),
  quote: z.string().min(1),
  traits: z.array(z.string().min(1)).min(2).max(6),
  goals: z.array(z.string().min(1)).min(2).max(5),
  frustrations: z.array(z.string().min(1)).min(2).max(5),
  motivations: z.array(z.string().min(1)).min(2).max(5),
  behaviors: z.array(z.string().min(1)).min(2).max(5),
  channels: z.array(z.string().min(1)).min(2).max(6),
  tools: z.array(z.string().min(1)).min(2).max(6),
  techProficiency: z.number().min(0).max(100),
  devices: z.array(z.string().min(1)).min(1).max(5),
  buyingBehavior: z.string().min(1),
  accessibilityNeeds: z.array(z.string().min(1)).min(1).max(4),
  meters: z.array(MeterSchema).min(3).max(5),
  jtbd: z.array(z.string().min(1)).min(2).max(4),
  journey: z.array(JourneyStageSchema).min(3).max(6),
  recommendations: z.array(z.string().min(1)).min(2).max(4),
});
export type PersonaCore = z.infer<typeof PersonaCoreSchema>;

/* ------------------------------------------------------------------ */
/* Research artifacts (per persona) — derived deterministically         */
/* ------------------------------------------------------------------ */

/** Classic 6-quadrant empathy map. */
export const EmpathyMapSchema = z.object({
  thinks: z.array(z.string().min(1)),
  feels: z.array(z.string().min(1)),
  says: z.array(z.string().min(1)),
  does: z.array(z.string().min(1)),
  pains: z.array(z.string().min(1)),
  gains: z.array(z.string().min(1)),
});
export type EmpathyMap = z.infer<typeof EmpathyMapSchema>;

export const JOURNEY_STAGES = [
  "Awareness",
  "Research",
  "Decision",
  "Onboarding",
  "Daily Usage",
  "Retention",
] as const;

/** One stage of the full user journey map. */
export const JourneyMapStageSchema = z.object({
  stage: z.string().min(1),
  goal: z.string().min(1),
  emotion: z.string().min(1),
  sentiment: z.number().min(0).max(100),
  painPoint: z.string().min(1),
  opportunity: z.string().min(1),
});
export type JourneyMapStage = z.infer<typeof JourneyMapStageSchema>;

/** Jobs-to-be-done grouped by category. */
export const JtbdCategoriesSchema = z.object({
  functional: z.array(z.string().min(1)),
  social: z.array(z.string().min(1)),
  emotional: z.array(z.string().min(1)),
  consumption: z.array(z.string().min(1)),
});
export type JtbdCategories = z.infer<typeof JtbdCategoriesSchema>;

export const PersonaResearchSchema = z.object({
  empathyMap: EmpathyMapSchema,
  journeyMap: z.array(JourneyMapStageSchema),
  jtbd: JtbdCategoriesSchema,
});
export type PersonaResearch = z.infer<typeof PersonaResearchSchema>;

/**
 * The fully-enriched persona that the UI renders and localStorage persists.
 */
export const PersonaSchema = PersonaCoreSchema.extend({
  id: z.string().min(1),
  source: z.enum(["ai", "local"]),
  model: z.string().optional(),
  createdAt: z.string(),
  favorite: z.boolean().optional(),
  avatar: z.object({
    initials: z.string().min(1).max(2),
    hue: z.number().min(0).max(360),
    /** Optional real-headshot URL; falls back to a derived stock portrait. */
    photo: z.string().optional(),
  }),
  research: PersonaResearchSchema,
});
export type Persona = z.infer<typeof PersonaSchema>;

/* ------------------------------------------------------------------ */
/* Project-level research artifacts — derived deterministically         */
/* ------------------------------------------------------------------ */

export const OpportunityAreasSchema = z.object({
  ux: z.array(z.string().min(1)),
  business: z.array(z.string().min(1)),
  retention: z.array(z.string().min(1)),
  monetization: z.array(z.string().min(1)),
  accessibility: z.array(z.string().min(1)),
});
export type OpportunityAreas = z.infer<typeof OpportunityAreasSchema>;

export const FeatureItemSchema = z.object({
  feature: z.string().min(1),
  why: z.string().min(1),
});
export type FeatureItem = z.infer<typeof FeatureItemSchema>;

export const FeaturePrioritizationSchema = z.object({
  mustHave: z.array(FeatureItemSchema),
  shouldHave: z.array(FeatureItemSchema),
  couldHave: z.array(FeatureItemSchema),
  future: z.array(FeatureItemSchema),
});
export type FeaturePrioritization = z.infer<typeof FeaturePrioritizationSchema>;

export const UserStorySchema = z.object({
  role: z.string().min(1),
  want: z.string().min(1),
  soThat: z.string().min(1),
  priority: z.enum(["Must", "Should", "Could"]),
});
export type UserStory = z.infer<typeof UserStorySchema>;

export const ProductRecommendationsSchema = z.object({
  topFeatures: z.array(z.string().min(1)),
  mvpScope: z.array(z.string().min(1)),
  niceToHave: z.array(z.string().min(1)),
  uxRisks: z.array(z.string().min(1)),
  metrics: z.object({
    activation: z.string().min(1),
    retention: z.string().min(1),
    northStar: z.string().min(1),
  }),
});
export type ProductRecommendations = z.infer<
  typeof ProductRecommendationsSchema
>;

export const MarketingRecommendationsSchema = z.object({
  positioning: z.string().min(1),
  valueProposition: z.string().min(1),
  headline: z.string().min(1),
  cta: z.string().min(1),
  emailSubject: z.string().min(1),
  adCopy: z.string().min(1),
  socialAngle: z.string().min(1),
});
export type MarketingRecommendations = z.infer<
  typeof MarketingRecommendationsSchema
>;

export const DesignRecommendationsSchema = z.object({
  navigation: z.string().min(1),
  informationArchitecture: z.string().min(1),
  dashboardLayout: z.string().min(1),
  onboarding: z.string().min(1),
  emptyStates: z.string().min(1),
  errorStates: z.string().min(1),
  accessibility: z.string().min(1),
  visualHierarchy: z.string().min(1),
});
export type DesignRecommendations = z.infer<
  typeof DesignRecommendationsSchema
>;

export const ProjectArtifactsSchema = z.object({
  opportunities: OpportunityAreasSchema,
  features: FeaturePrioritizationSchema,
  userStories: z.array(UserStorySchema),
  product: ProductRecommendationsSchema,
  marketing: MarketingRecommendationsSchema,
  design: DesignRecommendationsSchema,
});
export type ProjectArtifacts = z.infer<typeof ProjectArtifactsSchema>;

/** A saved research project = brief + personas + full research package. */
export const ProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  createdAt: z.string(),
  favorite: z.boolean().optional(),
  source: z.enum(["ai", "local"]),
  model: z.string().optional(),
  brief: BriefSchema,
  personas: z.array(PersonaSchema),
  artifacts: ProjectArtifactsSchema,
});
export type Project = z.infer<typeof ProjectSchema>;

/**
 * The shape returned by the /api/generate endpoint.
 */
export const GenerateResponseSchema = z.object({
  personas: z.array(PersonaSchema),
  artifacts: ProjectArtifactsSchema,
  source: z.enum(["ai", "local"]),
  model: z.string().optional(),
});
export type GenerateResponse = z.infer<typeof GenerateResponseSchema>;

/**
 * JSON Schema handed to Claude via `output_config.format`. Kept in sync with
 * PersonaCoreSchema by hand — structured outputs require every object to set
 * `additionalProperties: false` and list all properties in `required`.
 */
export const PERSONA_RESPONSE_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    personas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          archetype: {
            type: "string",
            description: 'A short archetype title, e.g. "The Pragmatic Optimizer".',
          },
          age: { type: "integer" },
          pronouns: { type: "string" },
          occupation: { type: "string" },
          company: {
            type: "string",
            description: "The kind of organization they work at.",
          },
          location: { type: "string" },
          bio: {
            type: "string",
            description: "Two or three sentences of narrative background.",
          },
          quote: {
            type: "string",
            description: "A first-person quote in the persona's voice.",
          },
          traits: { type: "array", items: { type: "string" } },
          goals: { type: "array", items: { type: "string" } },
          frustrations: { type: "array", items: { type: "string" } },
          motivations: { type: "array", items: { type: "string" } },
          behaviors: { type: "array", items: { type: "string" } },
          channels: {
            type: "array",
            items: { type: "string" },
            description: "Preferred discovery / communication channels.",
          },
          tools: {
            type: "array",
            items: { type: "string" },
            description: "Tools, apps, or brands they rely on.",
          },
          techProficiency: {
            type: "integer",
            description: "0 (novice) to 100 (expert).",
          },
          devices: {
            type: "array",
            items: { type: "string" },
            description: "Primary devices they use, e.g. iPhone, MacBook.",
          },
          buyingBehavior: {
            type: "string",
            description: "One sentence on how they research and decide to buy.",
          },
          accessibilityNeeds: {
            type: "array",
            items: { type: "string" },
            description:
              "Accessibility considerations, e.g. prefers larger text, reduced motion, or 'no specific needs'.",
          },
          meters: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                label: {
                  type: "string",
                  description: 'A spectrum label like "Introvert ↔ Extrovert".',
                },
                value: { type: "integer", description: "0 to 100." },
              },
              required: ["label", "value"],
            },
          },
          jtbd: {
            type: "array",
            items: { type: "string" },
            description:
              'Jobs-to-be-done in "When ___, I want to ___, so I can ___" form.',
          },
          journey: {
            type: "array",
            description:
              "The persona's journey with the product, from awareness to advocacy.",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                stage: {
                  type: "string",
                  description: 'e.g. "Awareness", "Onboarding", "Daily use".',
                },
                summary: {
                  type: "string",
                  description: "What happens and how they feel at this stage.",
                },
                sentiment: {
                  type: "integer",
                  description: "0 (frustrated) to 100 (delighted).",
                },
              },
              required: ["stage", "summary", "sentiment"],
            },
          },
          recommendations: {
            type: "array",
            items: { type: "string" },
            description:
              "Actionable product/marketing recommendations for winning this persona.",
          },
        },
        required: [
          "name",
          "archetype",
          "age",
          "pronouns",
          "occupation",
          "company",
          "location",
          "bio",
          "quote",
          "traits",
          "goals",
          "frustrations",
          "motivations",
          "behaviors",
          "channels",
          "tools",
          "techProficiency",
          "devices",
          "buyingBehavior",
          "accessibilityNeeds",
          "meters",
          "jtbd",
          "journey",
          "recommendations",
        ],
      },
    },
  },
  required: ["personas"],
} as const;
