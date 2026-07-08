import type { Persona } from "./types";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** System prompt that makes Claude embody the persona. */
export function buildPersonaSystemPrompt(persona: Persona): string {
  return [
    `You are ${persona.name}, a ${persona.age}-year-old ${persona.occupation} at ${persona.company} in ${persona.location}.`,
    `You are a real, specific person being interviewed by a product team. Stay fully in character and answer in the first person.`,
    ``,
    `About you:`,
    `- Archetype: ${persona.archetype}`,
    `- Bio: ${persona.bio}`,
    `- Goals: ${persona.goals.join("; ")}`,
    `- Pain points: ${persona.frustrations.join("; ")}`,
    `- Motivations: ${persona.motivations.join("; ")}`,
    `- Behaviors: ${persona.behaviors.join("; ")}`,
    `- Buying behavior: ${persona.buyingBehavior}`,
    `- Tech proficiency: ${persona.techProficiency}/100`,
    `- Tools you rely on: ${persona.tools.join(", ")}`,
    `- Devices: ${persona.devices.join(", ")}`,
    `- Traits: ${persona.traits.join(", ")}`,
    ``,
    `Rules:`,
    `- Answer as ${persona.name.split(" ")[0]} would — grounded in the details above.`,
    `- Be honest and realistic, including skepticism and objections. Do not be a cheerleader.`,
    `- Keep answers concise (2–5 sentences) and conversational.`,
    `- Never break character or mention that you are an AI or a persona.`,
  ].join("\n");
}

/**
 * A grounded local fallback used when no API key is configured. Produces a
 * plausible in-character reply based on the persona's attributes.
 */
export function replyLocally(persona: Persona, question: string): string {
  const q = question.toLowerCase();
  const first = persona.name.split(" ")[0];
  const goal = persona.goals[0]?.toLowerCase() ?? "get more done with less effort";
  const pain = persona.frustrations[0]?.toLowerCase() ?? "tools that waste my time";

  if (/(price|cost|pay|pricing|expensive|budget|afford)/.test(q)) {
    return `Honestly, ${persona.buyingBehavior.toLowerCase().replace(/\.$/, "")}. I'll happily pay once it's clearly earning its keep, but I won't commit the budget until I've seen it work on a real task. Show me the ROI, not a pricing table.`;
  }
  if (/(onboard|set ?up|get started|learning curve|first)/.test(q)) {
    return `If it takes me all afternoon to set up, I'm gone. I need a real win in the first ten minutes — ideally from a template so I'm not staring at a blank screen. Prove the value fast and you've got me.`;
  }
  if (/(competitor|compare|versus| vs |alternative|switch)/.test(q)) {
    return `I compare everything on one thing: does it save me time without adding friction? My frustration with what I use now is ${pain}. If you clearly beat that — fewer tabs, less busywork — I'll consider switching. Otherwise the switching cost isn't worth it.`;
  }
  if (/(feature|feature x|would.*use|reaction|react)/.test(q)) {
    return `It depends on whether it helps me ${goal}. I don't get excited about features for their own sake — I care about the outcome. If it removes a real step from my day, I'm interested; if it's just more surface area to learn, I'll skip it.`;
  }
  if (/(buy|purchase|sign ?up|convert|would you)/.test(q)) {
    return `Maybe — but not on day one. I'd start on a free plan, test it against a real task, and ask a couple of peers if they've used it. If it quietly delivers and helps me ${goal}, I'll upgrade. I'm loyal once a tool earns my trust.`;
  }
  if (/(marketing|message|positioning|headline|ad)/.test(q)) {
    return `Skip the hype. Tell me exactly what outcome I'll get and how fast. "${persona.quote}" — that's the mindset. Lead with time saved and fewer tabs, and back it up with someone like me who actually uses it.`;
  }
  return `As ${first}, here's my honest take: what matters to me is ${goal}, and my biggest frustration is ${pain}. So whatever you're proposing, I'll judge it on whether it moves that needle without adding friction to my day. Give me the outcome and I'll tell you if I'm in.`;
}
