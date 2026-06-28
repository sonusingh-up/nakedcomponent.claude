# Habit Tracker — Naked Compound

A mobile-first habit tracker (Rootinely-inspired): build habits, track streaks,
set reminders, and journal your progress.

Deployed separately from the main marketing site at **app.nakedcompound.in**.

## Stack

- **Nuxt 4** (Vite) + **Nuxt UI 4** (Tailwind CSS v4, bundled `@nuxt/fonts` + `@nuxt/icon`)
- **Supabase** — Postgres, Auth, Storage
- PWA (added in a later phase)

## Getting started

```bash
cd habit-tracker
cp .env.example .env        # then fill in your Supabase URL + anon key
npm install
npm run dev                 # http://localhost:3000
```

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run the schema migration in the SQL editor (or via the Supabase CLI):
   - `supabase/migrations/0001_init.sql` — tables, RLS, streak trigger
   - `supabase/seed.sql` — predefined habit catalog
3. Copy your **Project URL** and **anon public key** into `.env`:
   ```
   SUPABASE_URL=https://<ref>.supabase.co
   SUPABASE_KEY=<anon-key>
   ```
4. (Optional) In Auth settings, enable email confirmations and add
   `https://app.nakedcompound.in/confirm` + `http://localhost:3000/confirm`
   to the redirect allow-list.

## Project layout

```
app/
  assets/css/main.css     # brand theme (terracotta scale, fonts, tokens)
  components/
    app/                  # AppBottomNav, AppEmptyState …
    habit/                # HabitCard …
  composables/            # useHabits, useHabitLogs …
  layouts/                # default (bottom nav), minimal (auth)
  pages/                  # index, discover, journal, settings, login, signup, confirm
  types/                  # shared domain types
supabase/
  migrations/0001_init.sql
  seed.sql
```

## Roadmap

- [x] Phase 1 — Scaffold, theme, layouts, navigation
- [x] Phase 2 — Supabase schema + auth (email/password + magic link)
- [x] Phase 3 — Swipe-based habit discovery
- [x] Phase 4 — Tracking + streaks (single-habit view, 28-day history)
- [x] Phase 5 — Reminders (client + PWA notifications)
- [x] Phase 6 — Journal + audio notes
- [x] Phase 7 — PWA (installable, offline asset cache) + deploy config

### Future
- Web Push reminders (Supabase Edge Function + VAPID) for delivery when closed
- Generated TypeScript DB types (`supabase gen types`) for end-to-end typing
- Data export / account deletion in Settings

## Deploy

Separate Vercel project, **Root Directory = `habit-tracker/`**. Vercel
auto-detects Nuxt. Set `SUPABASE_URL` and `SUPABASE_KEY` env vars in the
project settings, and point the `app` subdomain at Vercel.
