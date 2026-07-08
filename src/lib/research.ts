import { hashString } from "./persona-utils";
import type {
  Brief,
  EmpathyMap,
  JourneyMapStage,
  JtbdCategories,
  Persona,
  PersonaCore,
  PersonaResearch,
  ProjectArtifacts,
  UserStory,
} from "./types";
import { JOURNEY_STAGES } from "./types";

/* --------------------------- tiny seeded rng --------------------------- */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type Rng = () => number;
function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}
function intBetween(rng: Rng, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** A short, sentence-friendly label for the product. */
function productLabel(brief: Brief): string {
  const p = brief.product.trim();
  return p.length <= 32 ? p : "the product";
}
function productShort(brief: Brief): string {
  const p = brief.product.trim();
  const words = p.split(/\s+/).slice(0, 4).join(" ");
  return words.length ? words : "the product";
}

/* ------------------------------------------------------------------ */
/* Per-persona research                                                */
/* ------------------------------------------------------------------ */

function buildEmpathyMap(persona: PersonaCore): EmpathyMap {
  const first = persona.name.split(" ")[0];
  return {
    thinks: [
      `"Is this actually going to save me time, or just add another tab?"`,
      `${persona.goals[0]} — but not at the cost of a steep learning curve.`,
      `Weighs whether the switch is worth the disruption to their routine.`,
    ],
    feels: [
      `Time-pressured and wary of over-promising tools.`,
      persona.motivations[0]
        ? `Motivated by ${persona.motivations[0].toLowerCase()}.`
        : `Motivated to stay on top of things.`,
      `Relieved when something just works on the first try.`,
    ],
    says: [
      `"${persona.quote}"`,
      `"Show me the outcome, not a feature list."`,
      `Asks peers "has anyone actually used this?" before committing.`,
    ],
    does: [
      persona.behaviors[0] ?? "Reads reviews before committing.",
      persona.behaviors[1] ?? "Starts on the free plan first.",
      `Lives in ${persona.tools.slice(0, 2).join(" and ")} throughout the day.`,
    ],
    pains: persona.frustrations.slice(0, 3),
    gains: [
      persona.goals[0] ?? "Saves time each week.",
      `Looks competent and in control to their team.`,
      `${first} builds trust in a tool that quietly delivers.`,
    ],
  };
}

const STAGE_BLUEPRINT: Record<
  (typeof JOURNEY_STAGES)[number],
  {
    goal: (p: string) => string;
    emotion: string;
    sentiment: [number, number];
    pain: (p: string) => string;
    opp: (p: string) => string;
  }
> = {
  Awareness: {
    goal: () => "Find a better way to handle a nagging problem",
    emotion: "Curious but skeptical",
    sentiment: [48, 62],
    pain: () => "Not sure this is different from what they've already tried",
    opp: (p) => `Lead with a sharp, outcome-first message about ${p}`,
  },
  Research: {
    goal: () => "Figure out if it actually solves their problem",
    emotion: "Cautiously evaluating",
    sentiment: [44, 58],
    pain: () => "Reviews are thin and the value isn't obvious at a glance",
    opp: () => "Show concrete proof: demos, real numbers, peer testimonials",
  },
  Decision: {
    goal: () => "Justify the switch to themselves (and maybe their team)",
    emotion: "Hesitant, weighing risk",
    sentiment: [42, 56],
    pain: () => "Switching cost and 'what if it doesn't stick' anxiety",
    opp: () => "Offer a low-risk trial and a clear ROI story",
  },
  Onboarding: {
    goal: (p) => `Get a first win with ${p} fast`,
    emotion: "Impatient for value",
    sentiment: [38, 55],
    pain: () => "Setup feels heavy; the 'aha' takes too long to arrive",
    opp: () => "Design a 60-second first win with templates and guardrails",
  },
  "Daily Usage": {
    goal: () => "Fold it into their routine without friction",
    emotion: "Settling into trust",
    sentiment: [62, 82],
    pain: () => "Small frictions add up and threaten the habit",
    opp: () => "Remove daily friction; surface quiet, compounding wins",
  },
  Retention: {
    goal: () => "Keep getting value and advocate for it internally",
    emotion: "Loyal, invested",
    sentiment: [72, 92],
    pain: () => "Wonders if a competitor now does it better or cheaper",
    opp: () => "Celebrate milestones and make sharing/expanding effortless",
  },
};

function buildJourneyMap(brief: Brief, rng: Rng): JourneyMapStage[] {
  const p = productLabel(brief);
  return JOURNEY_STAGES.map((stage) => {
    const b = STAGE_BLUEPRINT[stage];
    return {
      stage,
      goal: b.goal(p),
      emotion: b.emotion,
      sentiment: intBetween(rng, b.sentiment[0], b.sentiment[1]),
      painPoint: b.pain(p),
      opportunity: b.opp(p),
    };
  });
}

function buildJtbd(persona: PersonaCore, brief: Brief): JtbdCategories {
  const p = productLabel(brief);
  return {
    functional: [
      `When I'm short on time, I want ${p} to handle the busywork, so I can focus on decisions.`,
      persona.jtbd[0] ??
        `When I start a task, I want a clear next step, so I don't stall.`,
      `When something breaks, I want a fast path to a fix, so I keep momentum.`,
    ],
    social: [
      `When I present my work, I want to look organized and on top of it, so my team trusts me.`,
      `When peers ask for a recommendation, I want to confidently vouch for my tools, so I look sharp.`,
    ],
    emotional: [
      `When my workload spikes, I want to feel in control, so I'm not anxious.`,
      `When I try something new, I want to feel it was worth it quickly, so I don't second-guess myself.`,
    ],
    consumption: [
      `When I evaluate a tool, I want to try before I buy, so I don't gamble my time.`,
      `When I renew, I want the value to be obvious, so the decision is easy.`,
    ],
  };
}

export function buildPersonaResearch(
  persona: PersonaCore,
  brief: Brief,
  seedKey: string,
): PersonaResearch {
  const rng = mulberry32(hashString(`${seedKey}|${persona.name}`));
  return {
    empathyMap: buildEmpathyMap(persona),
    journeyMap: buildJourneyMap(brief, rng),
    jtbd: buildJtbd(persona, brief),
  };
}

/* ------------------------------------------------------------------ */
/* Project-level artifacts                                             */
/* ------------------------------------------------------------------ */

function buildArtifacts(
  brief: Brief,
  personas: PersonaCore[],
): ProjectArtifacts {
  const rng = mulberry32(
    hashString(`${brief.product}|${brief.industry}|${brief.tone}|artifacts`),
  );
  const p = productLabel(brief);
  const short = productShort(brief);

  const opportunities = {
    ux: [
      `Collapse multi-step tasks into a single, obvious flow`,
      `Deliver a first win within the first session`,
      `Reduce context-switching by bringing key actions into one view`,
    ],
    business: [
      `Position ${short} against the "5 tools stitched together" status quo`,
      `Land-and-expand: start with one team, grow across the org`,
      `Turn power users into referral engines`,
    ],
    retention: [
      `Surface compounding value ("you saved 3 hours this week")`,
      `Re-engage lapsing users with milestone nudges`,
      `Make switching away feel like losing accumulated value`,
    ],
    monetization: [
      `Gate advanced automation and collaboration behind paid tiers`,
      `Usage-based upsell as teams scale`,
      `Annual plans with a clear savings story for committed users`,
    ],
    accessibility: [
      `Ship keyboard-first navigation and visible focus states`,
      `Offer high-contrast and reduced-motion modes`,
      `Ensure screen-reader labels across core flows`,
    ],
  };

  const features = {
    mustHave: [
      { feature: `Fast, guided onboarding`, why: `The persona abandons tools that don't prove value in minutes.` },
      { feature: `Core workflow that replaces a manual process`, why: `This is the primary job the product is hired for.` },
      { feature: `Clear activity/results dashboard`, why: `Users need to see the value they're getting at a glance.` },
    ],
    shouldHave: [
      { feature: `Templates & presets`, why: `Removes the blank-slate problem and speeds the first win.` },
      { feature: `Team collaboration & sharing`, why: `Drives land-and-expand and social proof internally.` },
      { feature: `Integrations with existing tools`, why: `The persona lives in ${personas[0]?.tools.slice(0, 2).join(" & ") ?? "existing tools"} and won't switch fully.` },
    ],
    couldHave: [
      { feature: `Automation & rules`, why: `Deepens value for power users and supports upsell.` },
      { feature: `Mobile companion`, why: `Nice for on-the-go checks, but not the core job.` },
    ],
    future: [
      { feature: `AI-assisted suggestions`, why: `A differentiator once the core loop is proven.` },
      { feature: `Public API & marketplace`, why: `Ecosystem play for a later stage of maturity.` },
    ],
  };

  const roles = personas.map((p) => p.occupation.toLowerCase());
  const roleFor = (i: number) => roles[i % Math.max(1, roles.length)] || "user";
  const storyTemplates: Omit<UserStory, "role">[] = [
    { want: `quickly get started without reading a manual`, soThat: `I see value on day one`, priority: "Must" },
    { want: `replace my current manual process`, soThat: `I stop wasting hours each week`, priority: "Must" },
    { want: `see my results in one dashboard`, soThat: `I always know where things stand`, priority: "Must" },
    { want: `start from a template`, soThat: `I don't face a blank screen`, priority: "Should" },
    { want: `invite my teammates`, soThat: `we can work from the same source of truth`, priority: "Should" },
    { want: `connect the tools I already use`, soThat: `I don't have to change everything`, priority: "Should" },
    { want: `get notified only when it matters`, soThat: `I'm not overwhelmed by noise`, priority: "Should" },
    { want: `try it free before paying`, soThat: `I can prove it works for me first`, priority: "Must" },
    { want: `export my data anytime`, soThat: `I never feel locked in`, priority: "Should" },
    { want: `customize the layout to my workflow`, soThat: `it fits how I actually work`, priority: "Could" },
    { want: `automate repetitive steps`, soThat: `I can focus on decisions`, priority: "Could" },
    { want: `access it on my phone`, soThat: `I can check in on the go`, priority: "Could" },
    { want: `use keyboard shortcuts`, soThat: `I can move fast without the mouse`, priority: "Could" },
    { want: `see clear pricing`, soThat: `I can make the case to my team`, priority: "Should" },
    { want: `get fast, human support`, soThat: `I'm unblocked when something breaks`, priority: "Must" },
    { want: `understand my impact over time`, soThat: `I can justify keeping the tool`, priority: "Should" },
    { want: `share a read-only view with stakeholders`, soThat: `they stay informed without accounts`, priority: "Could" },
  ];
  const userStories: UserStory[] = storyTemplates.map((s, i) => ({
    role: roleFor(i),
    ...s,
  }));

  const product = {
    topFeatures: [
      `Guided onboarding with a 60-second first win`,
      `Core workflow that automates the manual process`,
      `Results dashboard with clear, at-a-glance value`,
      `Templates and presets library`,
      `Team collaboration and sharing`,
      `Integrations with popular tools`,
      `Smart notifications (signal, not noise)`,
      `Data export and portability`,
      `Automation rules for power users`,
      `Fast, human in-app support`,
    ],
    mvpScope: [
      `Guided onboarding`,
      `The single core workflow that replaces a manual task`,
      `A basic results dashboard`,
      `Free trial with an obvious upgrade path`,
    ],
    niceToHave: [
      `Mobile companion app`,
      `Advanced automation and rules`,
      `AI-assisted suggestions`,
      `Public API`,
    ],
    uxRisks: [
      `Onboarding that's too heavy — the persona bails before the 'aha'`,
      `Feature bloat that buries the core value`,
      `Unclear pricing that stalls the team decision`,
      `Weak empty and error states that erode early trust`,
    ],
    metrics: {
      activation: `% of new users who complete their first "win" within 24 hours`,
      retention: `Week-4 retention of activated users`,
      northStar: `Weekly active users who complete the core workflow at least 3×`,
    },
  };

  const audience = brief.audience?.trim() || `${brief.industry} teams`;
  const marketing = {
    positioning: `For ${audience} who are tired of stitching tools together, ${short} is the ${brief.industry.toLowerCase()} workspace that turns a messy process into one calm, fast flow — unlike the bloated all-in-one suites.`,
    valueProposition: `Do your best work in fewer tabs. ${short} gives ${audience} results in minutes, not hours.`,
    headline: pick(rng, [
      `Fewer tabs. Better outcomes.`,
      `Your work, finally in one place.`,
      `From busywork to done — in minutes.`,
    ]),
    cta: pick(rng, [`Start free`, `Try it free`, `Get started free`]),
    emailSubject: pick(rng, [
      `You just got an hour back`,
      `The fastest way to ${short.toLowerCase()}`,
      `Stop stitching tools together`,
    ]),
    adCopy: `Still juggling five tools to get one thing done? ${short} brings it into a single flow so ${audience} can stop fighting their tools and start shipping. Try it free.`,
    socialAngle: `Show the "5 chaotic tabs → 1 calm flow" transformation with a 15-second before/after demo. Let power users tell the story.`,
  };

  const design = {
    navigation: `A slim left sidebar for top-level areas plus a command palette (⌘K) for power users. Keep it to 5–6 primary destinations.`,
    informationArchitecture: `Organize around the core job, not features: Overview → Work → Insights → Settings. Progressive disclosure keeps advanced options out of the way until needed.`,
    dashboardLayout: `Lead with the single most important outcome metric, then a prioritized activity feed. One primary action per screen.`,
    onboarding: `A 3-step guided setup that ends in a real first win. Use a checklist with visible progress; let users skip and return.`,
    emptyStates: `Turn empty states into momentum: a one-line value reminder, a primary "add your first…" action, and a template shortcut.`,
    errorStates: `Plain-language errors that say what happened and the exact next step. Never blame the user; always offer a recovery action.`,
    accessibility: `WCAG AA contrast, full keyboard navigation, visible focus rings, reduced-motion support, and screen-reader labels on every interactive element.`,
    visualHierarchy: `One clear focal point per view. Use size, weight, and a single accent color to guide the eye; keep secondary actions quiet.`,
  };

  void p;
  return { opportunities, features, userStories, product, marketing, design };
}

/**
 * Build the complete research package (per-persona research + project
 * artifacts) for a set of personas.
 */
export function buildProjectArtifacts(
  brief: Brief,
  personas: PersonaCore[],
): ProjectArtifacts {
  return buildArtifacts(brief, personas);
}

/** Attach per-persona research to already-enriched personas. */
export function attachResearch(personas: Persona[], brief: Brief): Persona[] {
  return personas.map((persona) => ({
    ...persona,
    research: buildPersonaResearch(persona, brief, persona.id),
  }));
}
