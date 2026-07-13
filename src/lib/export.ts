import type { Persona } from "./types";

/** The persona fields worth exporting (drops internal render helpers). */
function toExport(persona: Persona) {
  const { id, source, model, createdAt, avatar, ...rest } = persona;
  void id;
  void avatar;
  return { ...rest, source, model, createdAt };
}

export function personaToJson(persona: Persona): string {
  return JSON.stringify(toExport(persona), null, 2);
}

function list(items: string[]): string {
  return items.map((i) => `- ${i}`).join("\n");
}

export function personaToMarkdown(persona: Persona): string {
  const p = persona;
  return [
    `# ${p.name} — ${p.archetype}`,
    "",
    `> “${p.quote}”`,
    "",
    `**${p.occupation}, ${p.company}** · ${p.location} · ${p.age} · ${p.pronouns}`,
    "",
    p.bio,
    "",
    `## Personality`,
    list(p.meters.map((m) => `${m.label}: ${m.value}/100`)),
    `- Tech proficiency: ${Math.round(p.techProficiency)}/100`,
    "",
    `## Goals`,
    list(p.goals),
    "",
    `## Pain points`,
    list(p.frustrations),
    "",
    `## Jobs to be done`,
    list(p.jtbd),
    "",
    `## Journey`,
    p.journey
      .map((s) => `- **${s.stage}** (${s.sentiment}/100): ${s.summary}`)
      .join("\n"),
    "",
    `## Motivations`,
    list(p.motivations),
    "",
    `## Behaviors`,
    list(p.behaviors),
    "",
    `## Recommendations`,
    list(p.recommendations),
    "",
    `## Traits`,
    p.traits.join(", "),
    "",
    `## Channels`,
    p.channels.join(", "),
    "",
    `## Tools`,
    p.tools.join(", "),
    "",
    `---`,
    `_Generated with Theaix${p.source === "ai" ? ` (${p.model ?? "Claude"})` : ""}._`,
    "",
  ].join("\n");
}

export function personasToJson(personas: Persona[]): string {
  return JSON.stringify(personas.map(toExport), null, 2);
}

export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for non-secure contexts.
  const el = document.createElement("textarea");
  el.value = text;
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export function downloadJson(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------------------------- project export ---------------------------- */

import type { Project } from "./types";

export function projectToJson(project: Project): string {
  return JSON.stringify(project, null, 2);
}

export function projectToMarkdown(project: Project): string {
  const a = project.artifacts;
  const out: string[] = [];
  out.push(`# ${project.name}`, "");
  out.push(`**Product:** ${project.brief.product}`);
  if (project.brief.audience) out.push(`**Audience:** ${project.brief.audience}`);
  out.push(
    `**Industry:** ${project.brief.industry} · **Tone:** ${project.brief.tone}`,
    "",
  );

  out.push(`## Personas`, "");
  for (const p of project.personas) {
    out.push(personaToMarkdown(p), "");
    out.push(`### Empathy map — ${p.name}`);
    const em = p.research.empathyMap;
    out.push(`**Thinks**`, list(em.thinks));
    out.push(`**Feels**`, list(em.feels));
    out.push(`**Says**`, list(em.says));
    out.push(`**Does**`, list(em.does));
    out.push(`**Pains**`, list(em.pains));
    out.push(`**Gains**`, list(em.gains), "");
    out.push(`### Journey map — ${p.name}`);
    for (const s of p.research.journeyMap) {
      out.push(
        `- **${s.stage}** (${s.sentiment}/100, ${s.emotion}) — Goal: ${s.goal}; Pain: ${s.painPoint}; Opportunity: ${s.opportunity}`,
      );
    }
    out.push("");
    out.push(`### Jobs to be done — ${p.name}`);
    out.push(`**Functional**`, list(p.research.jtbd.functional));
    out.push(`**Social**`, list(p.research.jtbd.social));
    out.push(`**Emotional**`, list(p.research.jtbd.emotional));
    out.push(`**Consumption**`, list(p.research.jtbd.consumption), "");
  }

  out.push(`## Opportunity areas`);
  out.push(`**UX**`, list(a.opportunities.ux));
  out.push(`**Business**`, list(a.opportunities.business));
  out.push(`**Retention**`, list(a.opportunities.retention));
  out.push(`**Monetization**`, list(a.opportunities.monetization));
  out.push(`**Accessibility**`, list(a.opportunities.accessibility), "");

  out.push(`## Feature prioritization`);
  const feat = (title: string, items: { feature: string; why: string }[]) => {
    out.push(`### ${title}`);
    items.forEach((f) => out.push(`- **${f.feature}** — ${f.why}`));
  };
  feat("Must have", a.features.mustHave);
  feat("Should have", a.features.shouldHave);
  feat("Could have", a.features.couldHave);
  feat("Future ideas", a.features.future);
  out.push("");

  out.push(`## User stories`);
  a.userStories.forEach((s) =>
    out.push(`- _As a ${s.role}, I want to ${s.want}, so that ${s.soThat}._ (${s.priority})`),
  );
  out.push("");

  out.push(`## Product recommendations`);
  out.push(`**Top features**`, list(a.product.topFeatures));
  out.push(`**MVP scope**`, list(a.product.mvpScope));
  out.push(`**Nice to have**`, list(a.product.niceToHave));
  out.push(`**Biggest UX risks**`, list(a.product.uxRisks));
  out.push(`**Metrics**`);
  out.push(`- Activation: ${a.product.metrics.activation}`);
  out.push(`- Retention: ${a.product.metrics.retention}`);
  out.push(`- North Star: ${a.product.metrics.northStar}`, "");

  out.push(`## Marketing recommendations`);
  out.push(`- **Positioning:** ${a.marketing.positioning}`);
  out.push(`- **Value proposition:** ${a.marketing.valueProposition}`);
  out.push(`- **Headline:** ${a.marketing.headline}`);
  out.push(`- **CTA:** ${a.marketing.cta}`);
  out.push(`- **Email subject:** ${a.marketing.emailSubject}`);
  out.push(`- **Ad copy:** ${a.marketing.adCopy}`);
  out.push(`- **Social angle:** ${a.marketing.socialAngle}`, "");

  out.push(`## Design recommendations`);
  out.push(`- **Navigation:** ${a.design.navigation}`);
  out.push(`- **Information architecture:** ${a.design.informationArchitecture}`);
  out.push(`- **Dashboard layout:** ${a.design.dashboardLayout}`);
  out.push(`- **Onboarding:** ${a.design.onboarding}`);
  out.push(`- **Empty states:** ${a.design.emptyStates}`);
  out.push(`- **Error states:** ${a.design.errorStates}`);
  out.push(`- **Accessibility:** ${a.design.accessibility}`);
  out.push(`- **Visual hierarchy:** ${a.design.visualHierarchy}`, "");

  out.push(`---`, `_Generated with Theaix._`, "");
  return out.join("\n");
}

export function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Resolve the effective background color of the current theme surface. */
function surfaceColor(node: HTMLElement): string {
  const bg = getComputedStyle(node).backgroundColor;
  if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
  return getComputedStyle(document.body).backgroundColor || "#ffffff";
}

/** Skip elements flagged with data-noexport (e.g. action buttons). */
function exportFilter(node: HTMLElement): boolean {
  return !(node.dataset && node.dataset.noexport === "true");
}

export async function exportNodeAsImage(
  node: HTMLElement,
  filename: string,
  format: "png" | "jpeg" = "png",
) {
  const { toPng, toJpeg } = await import("html-to-image");
  const options = {
    pixelRatio: 2,
    backgroundColor: surfaceColor(node),
    cacheBust: true,
    filter: exportFilter,
  };
  const dataUrl =
    format === "png" ? await toPng(node, options) : await toJpeg(node, { ...options, quality: 0.95 });
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function exportNodeAsPdf(node: HTMLElement, filename: string) {
  const [{ toPng }, jspdfModule] = await Promise.all([
    import("html-to-image"),
    import("jspdf"),
  ]);
  const JsPDF = jspdfModule.jsPDF;
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    backgroundColor: surfaceColor(node),
    cacheBust: true,
    filter: exportFilter,
  });

  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const pxToMm = 0.2645833333;
  const wMm = img.width * pxToMm * 0.5; // /2 for the 2x pixelRatio
  const hMm = img.height * pxToMm * 0.5;
  const orientation = wMm > hMm ? "l" : "p";
  const pdf = new JsPDF({ orientation, unit: "mm", format: [wMm, hMm] });
  pdf.addImage(dataUrl, "PNG", 0, 0, wMm, hMm);
  pdf.save(filename);
}

/** A filesystem-safe slug from a persona name, e.g. "maya-kimura". */
export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "persona"
  );
}
