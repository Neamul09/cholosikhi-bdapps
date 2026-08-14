# py.cholosikhi

Interactive, gamified lessons for **Python** and **C++**, delivered as a
single-page React app with a Supabase backend. Live at
[py.cholosikhi.com](https://py.cholosikhi.com).

> Sister site & marketing: [cholosikhi.com](https://cholosikhi.com)
> (the [`cholosikhi`](../cholosikhi) repo).

## Features

- **Two full curricula** — Python (bangla-first) and C++, organized into
  gamified sections, lessons, and exercises.
- **Five exercise types** — MCQ, fill-in-the-blank, output prediction, bug
  hunt, and code-arrange, plus a mini-challenge playground.
- **DSA visualizer** — live sorting (bubble / selection / insertion) and
  BST visualizations powered by framer-motion.
- **Auth + progress sync** via Supabase (email/Google). All progress
  survives logout/login.
- **Bilingual** — full bangla (বাংলা) translations for every lesson and
  exercise.
- **Streak / XP / league / shop** loop with gems, hearts, streak shields,
  XP boost, and an achievements panel.
- **Strict security** — CSP, HSTS, frame-ancestors, no exposed secrets,
  RLS-guarded DB.

## Tech

- **React 19** + **TypeScript (strict)** + **Vite 8**
- **Tailwind CSS 4** + **framer-motion**
- **Zustand** for client state (`auth`, `progress`, `user`, `quest`, `settings`)
- **Supabase** (Postgres + Auth) — RLS-guarded, anon JWT only
- **lucide-react** icons

## Quick start

```bash
git clone https://github.com/Neamul09/py.cholosikhi.git
cd py.cholosikhi
cp .env.example .env.local      # fill in VITE_SUPABASE_* values
npm install
npm run dev                     # http://localhost:5173
```

A fresh Supabase project is required. Run the SQL from `sql/avatars_bucket.sql`
in your Supabase SQL editor to provision the avatar storage bucket + RLS
policies (additional schema migrations live alongside it in `sql/`).

## Scripts

```bash
npm run dev          # Vite dev server with HMR
npm run lint         # ESLint (strict react-hooks + react-refresh)
npm run typecheck    # tsc --noEmit
npm run build        # type-check + production bundle into dist/
npm run preview      # serve the production build
npm run test         # Vitest unit tests  (when added)
npm run test:e2e     # Playwright e2e  (when added)
```

## Project layout

```
py.cholosikhi/
├── index.html              # CSP + OG meta
├── vercel.json             # security headers (HSTS, frame-options, …)
├── src/
│   ├── components/         # UI shells, exercises, visualizers, modals
│   ├── content/            # hand-authored lessons + curriculum schema
│   │   ├── schema.ts       # LocalizedString, Exercise, Lesson, Course
│   │   ├── python/         # python lessons + metadata
│   │   └── cpp/            # cpp lessons + metadata
│   ├── lib/supabase.ts     # single client + isSupabaseConfigured guard
│   ├── pages/              # route components
│   ├── store/              # Zustand stores
│   ├── utils/              # helpers (confetti, etc.)
│   ├── App.tsx
│   └── main.tsx
├── eslint.config.js        # strict: react-hooks + react-refresh
├── postcss.config.js       # Tailwind 4 plugin
├── tsconfig.json           # strict TS
├── LICENSE                 # MIT
└── SECURITY.md             # private disclosure policy
```

## Security

- Never commit `.env.local`. Use `.env.example` only as a template.
- All secrets come from `VITE_*` env vars; the anon JWT is the only one
  that ships to the client. Service role keys are server-side only.
- See [SECURITY.md](./SECURITY.md) for how to report vulnerabilities.

## License

[MIT](./LICENSE) © 2025–2026 Neamul09.
