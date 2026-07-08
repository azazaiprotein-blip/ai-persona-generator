import type { Brief, Industry, PersonaCore, Tone } from "./types";
import { hashString } from "./persona-utils";

/** Small, fast, seedable PRNG (mulberry32). */
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

function sample<T>(rng: Rng, arr: readonly T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  const take = Math.min(n, pool.length);
  for (let i = 0; i < take; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function intBetween(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

const FIRST_NAMES = [
  "Maya", "Daniel", "Priya", "Marcus", "Sofia", "Liam", "Amara", "Noah",
  "Elena", "Kai", "Zoe", "Omar", "Hana", "Diego", "Ruth", "Ade", "Ingrid",
  "Theo", "Nadia", "Felix", "Yuki", "Grace", "Mateo", "Leila", "Jonah",
];

const LAST_NAMES = [
  "Okafor", "Nguyen", "Patel", "Reyes", "Andersson", "Cohen", "Silva",
  "Kimura", "Rossi", "Haddad", "Novak", "Mbeki", "Fischer", "Kowalski",
  "Santos", "Bergström", "Ali", "Delgado", "Whitfield", "Castellano",
];

const CITIES = [
  "Austin, TX", "Berlin, DE", "Toronto, CA", "Singapore", "Lisbon, PT",
  "Nairobi, KE", "Amsterdam, NL", "Melbourne, AU", "Denver, CO", "Bengaluru, IN",
  "Copenhagen, DK", "Mexico City, MX", "Seoul, KR", "Manchester, UK", "Chicago, IL",
];

const PRONOUNS = ["she/her", "he/him", "they/them"] as const;

const ARCHETYPE_ADJ = [
  "Pragmatic", "Ambitious", "Cautious", "Curious", "Time-Starved", "Data-Driven",
  "Skeptical", "Optimistic", "Resourceful", "Overwhelmed", "Discerning", "Hands-On",
];
const ARCHETYPE_NOUN = [
  "Optimizer", "Explorer", "Builder", "Skeptic", "Champion", "Newcomer",
  "Veteran", "Multitasker", "Strategist", "Doer", "Researcher", "Connector",
];

const TRAITS = [
  "detail-oriented", "impatient with friction", "loyal once earned", "budget-conscious",
  "early adopter", "risk-averse", "collaborative", "independent", "outcome-focused",
  "socially motivated", "quietly persistent", "highly analytical", "creative",
  "pragmatic", "quality-obsessed",
];

const CHANNELS = [
  "LinkedIn", "Instagram", "YouTube tutorials", "peer referrals", "industry newsletters",
  "Reddit communities", "podcasts", "Google search", "TikTok", "Slack communities",
  "trade conferences", "email digests",
];

const GENERIC_TOOLS = [
  "Notion", "Slack", "Google Workspace", "Figma", "Zoom", "Trello",
  "WhatsApp", "Spotify", "Chrome", "iPhone",
];

const INDUSTRY_PROFILE: Record<
  Industry,
  { roles: string[]; orgs: string[]; tools: string[] }
> = {
  "Technology / SaaS": {
    roles: ["Product Manager", "Frontend Engineer", "DevOps Lead", "Founder", "UX Designer"],
    orgs: ["a Series-B startup", "a mid-market SaaS company", "a scale-up", "an indie studio"],
    tools: ["GitHub", "Linear", "Datadog", "Vercel", "Postman"],
  },
  "E-commerce / Retail": {
    roles: ["Store Owner", "Merchandising Lead", "Growth Marketer", "Operations Manager"],
    orgs: ["a DTC brand", "a boutique retailer", "an online marketplace", "a franchise chain"],
    tools: ["Shopify", "Klaviyo", "Meta Ads", "Stripe", "Canva"],
  },
  "Finance / Fintech": {
    roles: ["Financial Analyst", "Compliance Officer", "Product Lead", "Small Business Owner"],
    orgs: ["a challenger bank", "a wealth-management firm", "a fintech startup", "a credit union"],
    tools: ["Excel", "Bloomberg Terminal", "QuickBooks", "Plaid", "Tableau"],
  },
  Healthcare: {
    roles: ["Clinic Manager", "Registered Nurse", "Health-Tech PM", "Practice Owner"],
    orgs: ["a regional hospital", "a private clinic", "a telehealth startup", "a care network"],
    tools: ["Epic", "Slack", "Zoom", "Google Calendar", "MyChart"],
  },
  Education: {
    roles: ["Instructional Designer", "High-School Teacher", "L&D Manager", "Program Director"],
    orgs: ["a public school district", "an edtech company", "a university", "a bootcamp"],
    tools: ["Canvas", "Google Classroom", "Zoom", "Kahoot", "Notion"],
  },
  "Media / Entertainment": {
    roles: ["Content Creator", "Editorial Lead", "Social Media Manager", "Podcast Producer"],
    orgs: ["a streaming platform", "a digital magazine", "a creator collective", "a studio"],
    tools: ["Adobe Premiere", "CapCut", "Buffer", "Descript", "YouTube Studio"],
  },
  "Travel / Hospitality": {
    roles: ["Travel Planner", "Hotel GM", "Experience Designer", "Frequent Business Traveler"],
    orgs: ["a boutique hotel group", "an OTA", "a tour operator", "a vacation-rental brand"],
    tools: ["Google Maps", "Booking.com", "TripIt", "Airtable", "WhatsApp"],
  },
  "Real Estate": {
    roles: ["Real-Estate Agent", "Property Manager", "First-Time Buyer", "Investor"],
    orgs: ["a brokerage", "a property-management firm", "a proptech startup", "a REIT"],
    tools: ["Zillow", "DocuSign", "Excel", "MLS", "Instagram"],
  },
  "Food & Beverage": {
    roles: ["Café Owner", "Head Chef", "Brand Manager", "Franchise Operator"],
    orgs: ["an independent café", "a fast-casual chain", "a CPG brand", "a ghost kitchen"],
    tools: ["Square", "Toast", "Instagram", "DoorDash", "Google Business"],
  },
  Gaming: {
    roles: ["Indie Developer", "Community Manager", "Esports Coach", "Streamer"],
    orgs: ["an indie game studio", "a AAA publisher", "an esports org", "a mobile-games startup"],
    tools: ["Unity", "Discord", "Twitch", "Steam", "OBS"],
  },
  Nonprofit: {
    roles: ["Program Coordinator", "Development Director", "Volunteer Lead", "Executive Director"],
    orgs: ["a grassroots nonprofit", "an international NGO", "a community foundation", "a charity"],
    tools: ["Salesforce", "Mailchimp", "Google Sheets", "Zoom", "Canva"],
  },
  Other: {
    roles: ["Team Lead", "Consultant", "Operations Manager", "Small Business Owner"],
    orgs: ["a mid-sized company", "a consultancy", "an independent practice", "an agency"],
    tools: GENERIC_TOOLS,
  },
};

const METER_LABELS = [
  "Introvert ↔ Extrovert",
  "Cautious ↔ Adventurous",
  "Feeling ↔ Thinking",
  "Loyal ↔ Exploratory",
  "Deliberate ↔ Spontaneous",
];

const DEVICES = [
  "iPhone",
  "Android phone",
  "MacBook Pro",
  "Windows laptop",
  "iPad",
  "Apple Watch",
  "desktop workstation",
  "dual-monitor setup",
];

const BUYING_BEHAVIORS = [
  "Researches thoroughly, reads reviews, and starts on a free trial before committing.",
  "Decides fast when the value is obvious, but churns just as quickly if it disappoints.",
  "Needs buy-in from the team and a clear ROI story before approving a purchase.",
  "Loyal to tools that earn trust; reluctant to switch once something works.",
  "Price-sensitive early on, but will pay up once a tool becomes essential.",
];

const ACCESSIBILITY_NEEDS = [
  "Prefers larger text and high-contrast interfaces",
  "Relies on keyboard shortcuts over mouse navigation",
  "Sensitive to motion — appreciates reduced-motion options",
  "Needs clear focus states and screen-reader-friendly labels",
  "Works in noisy environments — values captions and visual cues",
  "No specific accessibility needs",
];

function quoteFor(tone: Tone, product: string, rng: Rng): string {
  // Long product descriptions read awkwardly inside a first-person quote, so
  // fall back to a generic reference when the brief isn't a short name.
  const trimmed = product.trim();
  const p = trimmed && trimmed.length <= 28 ? trimmed : "a tool like this";
  const options: Record<Tone, string[]> = {
    Professional: [
      `I need ${p} to just work — my time is my most valuable asset.`,
      `Show me the outcomes and I'll make the case to my team.`,
    ],
    Friendly: [
      `Honestly? If ${p} makes my day a little easier, I'm sold.`,
      `I love when something just gets me — that's when I stick around.`,
    ],
    Witty: [
      `I've tried every ${p} out there. Most of them ghosted me.`,
      `If it takes a manual to save me time, it's already failed.`,
    ],
    Inspirational: [
      `The right ${p} doesn't just save time — it gives me room to do my best work.`,
      `I'm not chasing features. I'm chasing momentum.`,
    ],
    Analytical: [
      `Before I commit to ${p}, I want the data to back it up.`,
      `I measure everything. If it doesn't move a metric, it doesn't stay.`,
    ],
  };
  return pick(rng, options[tone]);
}

function bioFor(
  name: string,
  role: string,
  org: string,
  city: string,
  audience: string | undefined,
  rng: Rng,
): string {
  const first = name.split(" ")[0];
  const aud = audience?.trim();
  const audienceLine = aud
    ? ` As part of ${aud}, ${first} feels the pain point acutely.`
    : "";
  const openers = [
    `${first} is a ${role.toLowerCase()} at ${org}, based in ${city}.`,
    `Working as a ${role.toLowerCase()} at ${org}, ${first} splits time between deep work and putting out fires.`,
    `${first} keeps ${org} running as its ${role.toLowerCase()} — and rarely has a spare minute.`,
  ];
  const middles = [
    `They juggle competing priorities and have little patience for tools that add friction.`,
    `Every new tool has to prove its worth in the first ten minutes or it gets abandoned.`,
    `They value clarity over cleverness and reach for whatever gets the job done.`,
  ];
  return `${pick(rng, openers)} ${pick(rng, middles)}${audienceLine}`;
}

const GOAL_TEMPLATES = [
  (p: string) => `Get real value from ${p} without a steep learning curve`,
  () => `Save a few hours every week on repetitive work`,
  () => `Look competent and in-control in front of their team`,
  () => `Make confident decisions backed by clear information`,
  () => `Grow without adding headcount or complexity`,
];

const FRUSTRATION_TEMPLATES = [
  () => `Tools that promise the world but bury the useful bits`,
  () => `Having to stitch five apps together to finish one task`,
  () => `Onboarding flows that assume you have all day`,
  (p: string) => `Paying for ${p} and only using 10% of it`,
  () => `Slow, generic support when something breaks`,
];

const MOTIVATION_TEMPLATES = [
  () => `Being seen as reliable and on top of things`,
  () => `Protecting time for the work that actually matters`,
  () => `Reducing stress and mental clutter`,
  () => `Hitting goals without cutting corners`,
];

const BEHAVIOR_TEMPLATES = [
  () => `Reads reviews and asks peers before committing`,
  () => `Starts with the free plan and upgrades once trust is earned`,
  () => `Abandons anything that isn't intuitive within minutes`,
  () => `Prefers to learn by doing rather than reading docs`,
];

const JTBD_TEMPLATES = [
  (p: string) =>
    `When I'm short on time, I want ${p} to do the heavy lifting, so I can focus on what matters`,
  () =>
    `When I try something new, I want to see value fast, so I don't second-guess the switch`,
  () => `When I hit a snag, I want a clear path forward, so I don't lose momentum`,
  (p: string) =>
    `When my workload spikes, I want ${p} to scale with me, so nothing slips through`,
];

const JOURNEY_BLUEPRINT: {
  stage: string;
  summaries: string[];
  sentiment: [number, number];
}[] = [
  {
    stage: "Awareness",
    summaries: [
      "Hears about it from a peer or a post while looking for a better way.",
      "Stumbles on it mid-search, cautiously curious but not convinced.",
    ],
    sentiment: [45, 62],
  },
  {
    stage: "Research",
    summaries: [
      "Compares options, reads reviews, and looks for proof it actually works.",
      "Weighs the switching cost against the promised payoff.",
    ],
    sentiment: [40, 58],
  },
  {
    stage: "Onboarding",
    summaries: [
      "Wants a fast win — abandons if setup feels heavy or unclear.",
      "Tests it against a real task to see if it earns a spot in the workflow.",
    ],
    sentiment: [35, 55],
  },
  {
    stage: "Daily use",
    summaries: [
      "Settles into a rhythm once it quietly saves time each day.",
      "Starts trusting it with the work that matters most.",
    ],
    sentiment: [62, 82],
  },
  {
    stage: "Advocacy",
    summaries: [
      "Recommends it to peers and defends it when alternatives come up.",
      "Becomes a quiet champion, nudging the team to adopt it too.",
    ],
    sentiment: [78, 94],
  },
];

const RECOMMENDATION_TEMPLATES = [
  () => `Lead with a 60-second "aha" — show real value before asking for signup`,
  () => `Offer templates or presets so they never start from a blank slate`,
  (p: string) => `Surface social proof from peers who already trust ${p}`,
  () => `Keep the free tier generous; let trust build before the upgrade ask`,
  () => `Provide fast, human support at the first sign of friction`,
  () => `Send lifecycle nudges that celebrate small wins, not just features`,
];

export function generatePersonaCore(
  brief: Brief,
  index: number,
): PersonaCore {
  const seedInput = `${brief.product}|${brief.audience ?? ""}|${brief.industry}|${brief.tone}|${index}`;
  const rng = mulberry32(hashString(seedInput));

  const profile = INDUSTRY_PROFILE[brief.industry];
  const first = pick(rng, FIRST_NAMES);
  const last = pick(rng, LAST_NAMES);
  const name = `${first} ${last}`;
  const role = pick(rng, profile.roles);
  const org = pick(rng, profile.orgs);
  const city = pick(rng, CITIES);
  const archetype = `The ${pick(rng, ARCHETYPE_ADJ)} ${pick(rng, ARCHETYPE_NOUN)}`;

  // A short, quote-friendly reference for the product (full descriptions read
  // awkwardly when injected mid-sentence).
  const trimmedProduct = brief.product.trim();
  const productLabel =
    trimmedProduct && trimmedProduct.length <= 28 ? trimmedProduct : "the product";

  const meters = sample(rng, METER_LABELS, 4).map((label) => ({
    label,
    value: intBetween(rng, 15, 85),
  }));

  const tools = Array.from(
    new Set([...sample(rng, profile.tools, 3), ...sample(rng, GENERIC_TOOLS, 1)]),
  ).slice(0, 4);

  return {
    name,
    archetype,
    age: intBetween(rng, 24, 58),
    pronouns: pick(rng, PRONOUNS),
    occupation: role,
    company: org,
    location: city,
    bio: bioFor(name, role, org, city, brief.audience || undefined, rng),
    quote: quoteFor(brief.tone, brief.product, rng),
    traits: sample(rng, TRAITS, 4),
    goals: sample(rng, GOAL_TEMPLATES, 3).map((t) => t(productLabel)),
    frustrations: sample(rng, FRUSTRATION_TEMPLATES, 3).map((t) => t(productLabel)),
    motivations: sample(rng, MOTIVATION_TEMPLATES, 3).map((t) => t()),
    behaviors: sample(rng, BEHAVIOR_TEMPLATES, 3).map((t) => t()),
    channels: sample(rng, CHANNELS, 4),
    tools,
    techProficiency: intBetween(rng, 30, 95),
    devices: sample(rng, DEVICES, intBetween(rng, 2, 3)),
    buyingBehavior: pick(rng, BUYING_BEHAVIORS),
    accessibilityNeeds: sample(rng, ACCESSIBILITY_NEEDS, intBetween(rng, 1, 2)),
    meters,
    jtbd: sample(rng, JTBD_TEMPLATES, 3).map((t) => t(productLabel)),
    journey: JOURNEY_BLUEPRINT.map((s) => ({
      stage: s.stage,
      summary: pick(rng, s.summaries),
      sentiment: intBetween(rng, s.sentiment[0], s.sentiment[1]),
    })),
    recommendations: sample(rng, RECOMMENDATION_TEMPLATES, 3).map((t) =>
      t(productLabel),
    ),
  };
}

export function generatePersonas(brief: Brief): PersonaCore[] {
  return Array.from({ length: brief.count }, (_, i) => generatePersonaCore(brief, i));
}
