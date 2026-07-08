<div align="center">

# 🍃 Folium

**Your AI UX research copilot — turn a product idea into a complete research package in minutes.**

Personas · Empathy maps · Journey maps · JTBD · Opportunities · Feature priorities · User stories · Product / Marketing / Design recs · Chat with your persona

Built with Next.js 16 · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer Motion · Claude

</div>

---

## Overview

Folium is a production-grade UX research workspace. From a single line of product
context it generates a full, exportable research package and lets you explore it in a clean,
modern SaaS dashboard — then interview your personas in character.

- **Landing page** (`/`) — hero, stats, features, how-it-works, live example, testimonials, FAQ, CTA.
- **Studio** (`/studio`) — generate a package, explore the 11-tab research workspace, chat with
  personas, and manage saved projects.

Everything is stored locally in the browser — **no accounts, no database, no tracking.**

## What it generates

Every project produces a complete research package:

| # | Artifact | Details |
|---|----------|---------|
| 1 | **Persona profiles** | Bio, goals, pain points, motivations, behaviors, tech level, devices, preferred apps, buying behavior, personality radar, accessibility needs |
| 2 | **Empathy maps** | Thinks · Feels · Says · Does · Pains · Gains |
| 3 | **User journey maps** | Awareness → Research → Decision → Onboarding → Daily Usage → Retention, each with goal, emotion, pain point, and opportunity |
| 4 | **Jobs to be done** | Functional · Social · Emotional · Consumption |
| 5 | **Opportunity areas** | UX · Business · Retention · Monetization · Accessibility |
| 6 | **Feature prioritization** | MoSCoW board (Must / Should / Could / Future) with reasoning |
| 7 | **User stories** | 15+ backlog-ready stories with priorities |
| 8 | **Product recommendations** | Top 10 features, MVP scope, nice-to-haves, UX risks, activation / retention / North-Star metrics |
| 9 | **Marketing recommendations** | Positioning, value prop, headline, CTA, email subject, ad copy, social angle |
| 10 | **Design recommendations** | Navigation, IA, dashboard layout, onboarding, empty/error states, accessibility, visual hierarchy |
| 11 | **Chat with persona** | Interview any persona in character — pricing, features, onboarding, objections |

## Features

- 🧠 **AI + graceful fallback** — Claude (`claude-opus-4-8`) when `ANTHROPIC_API_KEY` is set;
  a deterministic engine (and a grounded local chat) otherwise. Nothing ever fails.
- 📤 **Export the whole package** — PDF, PNG, JPEG, Markdown, JSON, or copy to clipboard.
- 💾 **Project workspace** — save, duplicate, favorite, search, and delete research projects.
- 🎨 **Clean, modern SaaS UI** — light-first design with an electric-lime accent, glass cards, a scroll-driven story, plus full dark mode.
- ✨ **Motion & micro-interactions** — animated radar, journey chart, tabs, and skeleton loading.
- ♿ **Accessible & responsive** — keyboard-navigable, tooltips, mobile-first.

## Tech stack

| Layer      | Choice                                                    |
| ---------- | -------------------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language   | TypeScript                                                |
| Styling    | Tailwind CSS v4 + OKLCH design tokens                     |
| Components | shadcn/ui (Radix) + lucide-react                          |
| Animation  | Framer Motion                                             |
| Validation | Zod (shared client + server schemas)                      |
| AI         | `@anthropic-ai/sdk` (structured outputs + persona chat)   |
| Export     | html-to-image + jspdf                                     |
| Storage    | `localStorage` (typed hooks)                              |

## Getting started

**Requirements:** Node.js ≥ 20.9.

```bash
npm install

# Optional: enable Claude-powered generation & chat
cp .env.example .env.local        # then set ANTHROPIC_API_KEY

npm run dev                       # http://localhost:3000
```

> Without an API key the app runs fully — every artifact and the persona chat have a grounded
> local fallback. Add a key from the [Anthropic Console](https://console.anthropic.com/) for
> richer, AI-crafted output.

### Scripts

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start the dev server           |
| `npm run build`     | Production build               |
| `npm run start`     | Serve the production build     |
| `npm run lint`      | Lint with ESLint               |
| `npm run typecheck` | Type-check with `tsc --noEmit` |

## Configuration

| Variable               | Required | Default                 | Description                             |
| ---------------------- | -------- | ----------------------- | --------------------------------------- |
| `ANTHROPIC_API_KEY`    | No       | —                       | Enables Claude generation + chat.       |
| `ANTHROPIC_MODEL`      | No       | `claude-opus-4-8`       | Override the Claude model.              |
| `NEXT_PUBLIC_SITE_URL` | No       | `http://localhost:3000` | Canonical URL for metadata / sitemap.   |

## Architecture

```
src/
├─ app/
│  ├─ page.tsx                 # Landing page (/)
│  ├─ studio/page.tsx          # Research workspace (/studio)
│  ├─ api/generate/route.ts    # Personas (Claude/local) + full research package
│  ├─ api/chat/route.ts        # Chat-with-persona (Claude/local)
│  ├─ layout · error · not-found · icon.svg · robots · sitemap
│  └─ globals.css              # Design tokens, dark mode, utilities
├─ components/
│  ├─ persona/                 # Landing, persona card, radar, form, header, states
│  ├─ workspace/               # Research dashboard: sections, chat, projects, primitives
│  └─ ui/                      # shadcn/ui primitives
└─ lib/
   ├─ types.ts                 # Zod schemas (persona, artifacts, project) + shared types
   ├─ generator.ts             # Deterministic persona engine (seeded)
   ├─ research.ts              # Deterministic research-artifact generator
   ├─ anthropic.ts             # Claude persona generation (structured outputs)
   ├─ chat.ts                  # Persona chat prompt + local fallback
   ├─ storage.ts               # Projects / saved / history hooks (localStorage)
   ├─ export.ts                # JSON / Markdown / PNG / JPEG / PDF exporters
   └─ sample.ts                # Curated project for the landing preview
```

**Reliability by design:** personas come from Claude when configured and a deterministic engine
otherwise; the **research artifacts and persona chat are always available** via grounded local
generation. So a request never fails — the AI path simply makes the output richer.

## Deployment

Deploys anywhere Next.js runs. On **Vercel**: import the repo, optionally set `ANTHROPIC_API_KEY`
and `NEXT_PUBLIC_SITE_URL`, and deploy — Next.js is auto-detected. Self-host with
`npm run build && npm run start`.

## License

MIT — free to use, modify, and ship.
