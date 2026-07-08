import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

import { buildPersonaSystemPrompt, replyLocally } from "@/lib/chat";
import { isAiConfigured } from "@/lib/anthropic";
import { PersonaSchema } from "@/lib/types";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

const ChatRequestSchema = z.object({
  persona: PersonaSchema,
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(40),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { persona, messages } = parsed.data;
  const lastUser = [...messages].reverse().find((m) => m.role === "user");

  if (isAiConfigured()) {
    try {
      const client = new Anthropic();
      const message = await client.messages.create({
        model: MODEL,
        max_tokens: 512,
        system: buildPersonaSystemPrompt(persona),
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      });
      const reply = message.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      if (reply) {
        return NextResponse.json({ reply, source: "ai" });
      }
    } catch (error) {
      console.error("Chat AI failed, falling back to local:", error);
    }
  }

  return NextResponse.json({
    reply: replyLocally(persona, lastUser?.content ?? ""),
    source: "local",
  });
}
