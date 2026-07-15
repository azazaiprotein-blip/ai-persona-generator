"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Clapperboard,
  Radar,
  MessageCircle,
  Activity,
  Target,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * "See it in action" — a dark stage where each feature is explained by a short
 * demo film. Tabs switch the film; neighbours peek in behind the active card.
 *
 * Drop the clips in `public/videos/` using the `video` filenames below (and an
 * optional matching poster image). Until a clip exists the card falls back to a
 * branded placeholder, so the section always renders.
 */

type Film = {
  id: string;
  tab: string;
  icon: typeof Radar;
  title: string;
  caption: string;
  video: string;
  poster: string;
};

const FILMS: Film[] = [
  {
    id: "overview",
    tab: "Overview",
    icon: Clapperboard,
    title: "Fouxium, in one take",
    caption: "One click from a product idea to a complete UX research pack.",
    video: "/videos/fouxium-overview.mp4",
    poster: "/videos/overview-thumb.png",
  },
  {
    id: "personas",
    tab: "Personas",
    icon: Radar,
    title: "One line becomes a cast of real people",
    caption: "Describe the product — watch personas, traits, and empathy maps appear.",
    video: "/videos/personas.mp4",
    poster: "/videos/personas.jpg",
  },
  {
    id: "chat",
    tab: "Persona chat",
    icon: MessageCircle,
    title: "Interview your persona, in character",
    caption: "Pressure-test pricing, features, and objections before you build.",
    video: "/videos/persona-chat.mp4",
    poster: "/videos/persona-chat.jpg",
  },
  {
    id: "journey",
    tab: "Journeys & JTBD",
    icon: Activity,
    title: "Their whole world, mapped",
    caption: "Six-stage journeys with emotion, friction, and the jobs behind them.",
    video: "/videos/journeys.mp4",
    poster: "/videos/journeys.jpg",
  },
  {
    id: "strategy",
    tab: "Product strategy",
    icon: Target,
    title: "Leave with Monday's plan",
    caption: "MoSCoW board, user stories, MVP scope, and success metrics.",
    video: "/videos/strategy.mp4",
    poster: "/videos/strategy.jpg",
  },
];

/** The active film card — poster + play, swapping to a real player on click. */
function FilmCard({ film }: { film: Film }) {
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function play() {
    setPlaying(true);
    // let the element mount/unhide before requesting playback
    requestAnimationFrame(() => void videoRef.current?.play().catch(() => {}));
  }

  return (
    <div className="bg-ink relative aspect-video w-full overflow-hidden rounded-3xl shadow-2xl shadow-black/50 ring-1 ring-white/10">
      {!missing && (
        <video
          ref={videoRef}
          src={film.video}
          poster={film.poster}
          playsInline
          controls={playing}
          onError={() => setMissing(true)}
          className={cn(
            "h-full w-full object-cover",
            !playing && "pointer-events-none",
          )}
        />
      )}

      {/* Branded fallback while the clip isn't in place yet */}
      {missing && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{
            background:
              "radial-gradient(90% 120% at 50% 0%, color-mix(in srgb, var(--brand) 70%, var(--ink)) 0%, color-mix(in srgb, var(--brand) 18%, var(--ink)) 55%, var(--ink) 100%)",
          }}
        >
          <film.icon className="size-8 text-white/70" />
          <p className="px-6 text-center text-sm text-white/70">
            Demo film coming soon
          </p>
        </div>
      )}

      {/* Title + play overlay (hidden once the clip is running) */}
      {!playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/70 via-black/10 to-transparent">
          {!missing && (
            <button
              onClick={play}
              aria-label={`Play: ${film.title}`}
              className="text-ink flex size-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-105"
            >
              <Play className="ml-0.5 size-6 fill-current" />
            </button>
          )}
          <div className="absolute right-0 bottom-0 left-0 px-6 pb-6 text-center">
            <h3 className="text-xl font-bold text-white text-balance sm:text-2xl">
              {film.title}
            </h3>
            <p className="mt-1 text-xs text-white/60">{film.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/** A dimmed still peeking in behind the active card. */
function PeekCard({ film, side }: { film: Film; side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute top-1/2 hidden w-[46%] -translate-y-1/2 md:block",
        side === "left" ? "-left-2" : "-right-2",
      )}
    >
      <div
        className="relative aspect-video overflow-hidden rounded-2xl opacity-40 ring-1 ring-white/10"
        style={{
          background:
            "radial-gradient(90% 120% at 50% 0%, color-mix(in srgb, var(--brand) 55%, var(--ink)) 0%, color-mix(in srgb, var(--brand) 14%, var(--ink)) 60%, var(--ink) 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative still, gradient behind as fallback */}
        <img
          src={side === "left" ? "/videos/peek-left.png" : "/videos/peek-right.png"}
          alt=""
          onError={(e) => e.currentTarget.remove()}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <film.icon className="size-6 text-white/50" />
        </div>
      </div>
    </div>
  );
}

export function FeatureFilms() {
  const [active, setActive] = useState(0);
  const film = FILMS[active];
  const prev = FILMS[(active - 1 + FILMS.length) % FILMS.length];
  const next = FILMS[(active + 1) % FILMS.length];

  return (
    <section className="bg-ink relative overflow-hidden py-20">
      {/* brand dome bleeding from the top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{
          background:
            "radial-gradient(55% 100% at 50% 0%, color-mix(in srgb, var(--brand) 22%, transparent) 0%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <span className="text-sm font-semibold tracking-widest uppercase [color:var(--brand-2)]">
            See it in action
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance text-white sm:text-5xl">
            Every feature, in under a minute
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-white/60">
            Fouxium turns a single line of product context into research you can
            act on. Pick a feature and watch exactly how it works — no signup, no
            sales call.
          </p>
        </motion.div>

        {/* Tab pills */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="mt-9 flex justify-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-white/12 bg-white/5 p-1.5">
            {FILMS.map((f, i) => {
              const on = i === active;
              return (
                <button
                  key={f.id}
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    on ? "text-white" : "text-white/55 hover:text-white/80",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="film-tab"
                      className="absolute inset-0 rounded-full bg-white/12 ring-1 ring-white/15"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">{f.tab}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Stage */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.14 }}
          className="relative mt-10 flex justify-center"
        >
          <PeekCard film={prev} side="left" />
          <PeekCard film={next} side="right" />
          <div className="relative z-10 w-full md:w-[74%]">
            {/* Keyed remount fades the new film in. Deliberately not using
                AnimatePresence — `mode="wait"` stalls on exit here and holds
                the previous card forever. */}
            <motion.div
              key={film.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <FilmCard film={film} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
