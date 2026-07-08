import type { Brief, Persona } from "./types";

/** The brief behind the landing-page example — used to build the full
 * example research package when the Studio is opened with `?example=1`. */
export const SAMPLE_BRIEF: Brief = {
  product:
    "An ops reporting copilot that assembles weekly numbers, dashboards, and summaries automatically",
  audience: "operations leads at fast-growing DTC brands",
  industry: "Technology / SaaS",
  tone: "Friendly",
  count: 1,
};

/** A hand-tuned persona used for the landing-page preview. */
export const SAMPLE_PERSONA: Persona = {
  id: "sample-persona",
  source: "ai",
  model: "claude-opus-4-8",
  createdAt: "2026-01-01T00:00:00.000Z",
  favorite: true,
  avatar: {
    initials: "MK",
    hue: 268,
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  name: "Maya Kapoor",
  archetype: "The Pragmatic Optimizer",
  age: 34,
  pronouns: "she/her",
  occupation: "Operations Lead",
  company: "a fast-growing DTC brand",
  location: "Austin, TX",
  bio: "Maya keeps a lean ops team running as her company scales. She's allergic to busywork, lives in her calendar, and abandons any tool that can't prove its value in the first ten minutes.",
  quote:
    "I don't need more features — I need fewer tabs. Show me the outcome and I'm in.",
  traits: ["detail-oriented", "time-starved", "data-driven", "pragmatic"],
  goals: [
    "Cut hours of manual reporting each week",
    "Keep the team aligned without more meetings",
    "Make confident calls backed by real numbers",
  ],
  frustrations: [
    "Tools that promise the world but bury the useful bits",
    "Stitching five apps together to finish one task",
    "Onboarding that assumes you have all day",
  ],
  motivations: [
    "Being the reliable one who has it handled",
    "Protecting time for high-leverage work",
    "Reducing mental clutter",
  ],
  behaviors: [
    "Reads reviews and asks peers before committing",
    "Starts on the free plan, upgrades once trust is earned",
    "Bails on anything that isn't intuitive fast",
  ],
  channels: ["LinkedIn", "peer referrals", "industry newsletters", "podcasts"],
  tools: ["Notion", "Slack", "Linear", "Figma"],
  techProficiency: 82,
  devices: ["iPhone", "MacBook Pro", "iPad"],
  buyingBehavior:
    "Researches thoroughly, reads reviews, and starts on a free trial before committing the team.",
  accessibilityNeeds: [
    "Prefers larger text and high-contrast interfaces",
    "Relies on keyboard shortcuts over mouse navigation",
  ],
  meters: [
    { label: "Introvert ↔ Extrovert", value: 58 },
    { label: "Cautious ↔ Adventurous", value: 46 },
    { label: "Feeling ↔ Thinking", value: 74 },
    { label: "Deliberate ↔ Spontaneous", value: 38 },
  ],
  jtbd: [
    "When my week gets buried in reports, I want the numbers to assemble themselves, so I can spend time deciding, not collecting.",
    "When I evaluate a new tool, I want proof it works fast, so I don't gamble the team's time.",
    "When something breaks, I want a clear path forward, so I don't lose momentum.",
  ],
  journey: [
    {
      stage: "Awareness",
      summary: "A peer mentions it in a Slack community while she hunts for a lighter workflow.",
      sentiment: 55,
    },
    {
      stage: "Research",
      summary: "Skims reviews and a demo, weighing the switching cost against the payoff.",
      sentiment: 48,
    },
    {
      stage: "Onboarding",
      summary: "Wants a win in ten minutes — tests it against a live report before trusting it.",
      sentiment: 42,
    },
    {
      stage: "Daily use",
      summary: "Settles into a rhythm once it quietly saves an hour every morning.",
      sentiment: 78,
    },
    {
      stage: "Advocacy",
      summary: "Rolls it out to the team and defends it when other tools come up.",
      sentiment: 90,
    },
  ],
  recommendations: [
    "Lead with a 60-second 'aha' — show a real report before asking for signup",
    "Offer prebuilt templates so she never starts from a blank slate",
    "Surface peer social proof from other ops leaders",
  ],
  research: {
    empathyMap: {
      thinks: [
        '"Will this actually save time, or just add another tab?"',
        "Weighs the switching cost against the promised payoff.",
        "Wants proof before she commits the team.",
      ],
      feels: [
        "Time-pressured and allergic to busywork.",
        "Motivated by being the reliable one who has it handled.",
        "Relieved when a tool just works on the first try.",
      ],
      says: [
        '"I don\'t need more features — I need fewer tabs."',
        '"Show me the outcome and I\'m in."',
        'Asks peers "has anyone actually used this?"',
      ],
      does: [
        "Reads reviews and asks peers before committing.",
        "Starts on the free plan, upgrades once trust is earned.",
        "Lives in Notion and Slack all day.",
      ],
      pains: [
        "Tools that promise the world but bury the useful bits",
        "Stitching five apps together to finish one task",
        "Onboarding that assumes you have all day",
      ],
      gains: [
        "Cuts hours of manual reporting each week",
        "Looks competent and in control to her team",
        "Builds trust in a tool that quietly delivers",
      ],
    },
    journeyMap: [
      {
        stage: "Awareness",
        goal: "Find a lighter way to run ops",
        emotion: "Curious but skeptical",
        sentiment: 55,
        painPoint: "Not sure it's different from what she's tried",
        opportunity: "Lead with an outcome-first message",
      },
      {
        stage: "Research",
        goal: "Confirm it solves her problem",
        emotion: "Cautiously evaluating",
        sentiment: 48,
        painPoint: "Reviews are thin; value isn't obvious",
        opportunity: "Show demos, real numbers, peer proof",
      },
      {
        stage: "Decision",
        goal: "Justify the switch to her team",
        emotion: "Weighing risk",
        sentiment: 46,
        painPoint: "Switching cost anxiety",
        opportunity: "Low-risk trial + clear ROI story",
      },
      {
        stage: "Onboarding",
        goal: "Get a first win fast",
        emotion: "Impatient for value",
        sentiment: 42,
        painPoint: "Setup feels heavy",
        opportunity: "60-second first win with templates",
      },
      {
        stage: "Daily Usage",
        goal: "Fold it into her routine",
        emotion: "Settling into trust",
        sentiment: 78,
        painPoint: "Small frictions threaten the habit",
        opportunity: "Remove daily friction; surface wins",
      },
      {
        stage: "Retention",
        goal: "Keep the value and advocate internally",
        emotion: "Loyal, invested",
        sentiment: 90,
        painPoint: "Wonders if a competitor is better now",
        opportunity: "Celebrate milestones; make sharing easy",
      },
    ],
    jtbd: {
      functional: [
        "When my week gets buried in reports, I want the numbers to assemble themselves, so I can decide, not collect.",
        "When something breaks, I want a fast path to a fix, so I keep momentum.",
      ],
      social: [
        "When I present to leadership, I want to look organized and in control, so my team trusts me.",
      ],
      emotional: [
        "When my workload spikes, I want to feel in control, so I'm not anxious.",
      ],
      consumption: [
        "When I evaluate a tool, I want to try before I buy, so I don't gamble the team's time.",
      ],
    },
  },
};
