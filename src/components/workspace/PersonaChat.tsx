"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { AvatarBlob } from "@/components/persona/AvatarBlob";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/chat";
import type { Persona } from "@/lib/types";

const SUGGESTIONS = [
  "Would you buy this product?",
  "How would you react to an AI assistant feature?",
  "What pricing would you prefer?",
  "What onboarding would work best for you?",
  "How do we compare to competitors?",
];

export function PersonaChat({ persona }: { persona: Persona }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, messages: next }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as { reply: string };
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      toast.error("Couldn't reach the persona", {
        description: "Please try again.",
      });
      setMessages((m) => m.slice(0, -1));
      setInput(content);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card mx-auto flex h-[min(620px,70vh)] max-w-3xl flex-col overflow-hidden rounded-2xl border shadow-sm">
      {/* Header */}
      <div className="glass flex items-center gap-3 border-b px-4 py-3">
        <AvatarBlob src={persona.avatar.photo} initials={persona.avatar.initials} hue={persona.avatar.hue} className="size-9" />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">
            Chat with {persona.name}
          </div>
          <div className="text-muted-foreground truncate text-xs">
            {persona.occupation} · stays in character
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <AvatarBlob src={persona.avatar.photo} initials={persona.avatar.initials} hue={persona.avatar.hue} className="size-14" />
            <p className="mt-4 text-sm font-medium">
              Interview {persona.name.split(" ")[0]}
            </p>
            <p className="text-muted-foreground mt-1 max-w-xs text-sm text-balance">
              Ask anything — they&apos;ll answer in character, grounded in their
              goals, frustrations, and buying behavior.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-muted-foreground hover:border-brand/40 hover:text-foreground rounded-full border px-3 py-1.5 text-xs transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-2.5",
                m.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {m.role === "assistant" && (
                <AvatarBlob
                  src={persona.avatar.photo} initials={persona.avatar.initials}
                  hue={persona.avatar.hue}
                  className="mt-0.5 size-7 shrink-0"
                />
              )}
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-brand text-brand-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm",
                )}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center gap-2.5">
            <AvatarBlob
              src={persona.avatar.photo} initials={persona.avatar.initials}
              hue={persona.avatar.hue}
              className="size-7 shrink-0"
            />
            <div className="bg-muted flex items-center gap-1 rounded-2xl rounded-bl-sm px-3.5 py-3">
              <span className="bg-muted-foreground/60 size-1.5 animate-bounce rounded-full [animation-delay:-0.2s]" />
              <span className="bg-muted-foreground/60 size-1.5 animate-bounce rounded-full [animation-delay:-0.1s]" />
              <span className="bg-muted-foreground/60 size-1.5 animate-bounce rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t p-3"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${persona.name.split(" ")[0]} a question…`}
          disabled={loading}
        />
        <Button type="submit" variant="brand" size="icon" disabled={loading || !input.trim()}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </form>
    </div>
  );
}
