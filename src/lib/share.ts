import { ProjectSchema, type Project } from "./types";

/**
 * Public share links encode the whole project into the URL fragment —
 * `/studio#share=<flag>.<base64url>` — so nothing ever touches a server and
 * the link works for anyone, matching the app's local-first storage story.
 * Flag "1" = gzip via CompressionStream, "0" = plain (older browsers).
 */

const SHARE_PREFIX = "#share=";

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replaceAll("-", "+").replaceAll("_", "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function projectToShareUrl(project: Project): Promise<string> {
  const raw = new TextEncoder().encode(JSON.stringify(project));
  let payload = raw;
  let flag = "0";
  if (typeof CompressionStream !== "undefined") {
    const stream = new Blob([raw as BlobPart])
      .stream()
      .pipeThrough(new CompressionStream("gzip"));
    payload = new Uint8Array(await new Response(stream).arrayBuffer());
    flag = "1";
  }
  return `${window.location.origin}/studio${SHARE_PREFIX}${flag}.${toBase64Url(payload)}`;
}

/** Decode `location.hash` into a Project, or null if it isn't a share link. */
export async function decodeShareHash(hash: string): Promise<Project | null> {
  if (!hash.startsWith(SHARE_PREFIX)) return null;
  try {
    const [flag, data] = hash.slice(SHARE_PREFIX.length).split(".", 2);
    if (!data) return null;
    let bytes = fromBase64Url(data);
    if (flag === "1") {
      const stream = new Blob([bytes as BlobPart])
        .stream()
        .pipeThrough(new DecompressionStream("gzip"));
      bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    }
    const json = new TextDecoder().decode(bytes);
    return ProjectSchema.parse(JSON.parse(json));
  } catch {
    return null;
  }
}

/** A compact plain-text summary that fits inside a mailto: body. */
export function projectToEmailBody(project: Project): string {
  const lines = [
    `${project.name} — UX research package`,
    "",
    `Personas (${project.personas.length}):`,
    ...project.personas.map(
      (p) => `• ${p.name}, ${p.age} — ${p.archetype}. "${p.quote}"`,
    ),
    "",
    "Top opportunities:",
    ...project.artifacts.opportunities.ux.slice(0, 3).map((o) => `• ${o}`),
    "",
    `North star metric: ${project.artifacts.product.metrics.northStar}`,
    "",
    "Generated with Fouxium — fouxium.com",
  ];
  // mailto: bodies get flaky past ~1800 chars; trim gracefully.
  let body = lines.join("\n");
  if (body.length > 1600) body = `${body.slice(0, 1590)}…`;
  return body;
}
