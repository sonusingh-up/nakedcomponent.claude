# Deploying the Habit Tracker

The app deploys as its **own Vercel project**, separate from the main
`nakedcompound.in` site, at **app.nakedcompound.in**.

## 1. Supabase (one-time)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run, in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_storage.sql`
   - `supabase/seed.sql`
3. **Auth → URL Configuration**: add these redirect URLs:
   - `https://app.nakedcompound.in/confirm`
   - `http://localhost:3000/confirm`
4. Copy **Project URL** and the **anon public** key (Settings → API).

> Prefer the CLI? `supabase link` then `supabase db push` applies the
> migrations, and `supabase db seed` (or piping `seed.sql`) loads the catalog.

## 2. Vercel project

1. New Project → import the `nakedcomponent.claude` repo.
2. **Root Directory: `habit-tracker`** (critical — this is what keeps it
   independent from the static site).
3. Framework preset auto-detects **Nuxt**. Leave build/output defaults.
4. Environment variables:
   | Key | Value |
   |-----|-------|
   | `SUPABASE_URL` | `https://<ref>.supabase.co` |
   | `SUPABASE_KEY` | anon public key |
5. Deploy.

## 3. Domain

1. Vercel project → Settings → Domains → add `app.nakedcompound.in`.
2. At your DNS provider, add a CNAME:
   ```
   app  →  cname.vercel-dns.com
   ```
3. Wait for the certificate to issue.

## 4. Cross-link from the main site

Add a link to `https://app.nakedcompound.in` in the main site's nav/footer.
Habit cards that map to supplements (e.g. "Take creatine") can deep-link back
to the relevant ingredient page on the main site.

## Notes

- **Service worker / PWA** is generated at build time (`@vite-pwa/nuxt`,
  `registerType: autoUpdate`). It is disabled in dev (`devOptions.enabled:
  false`); test it against a production build (`npm run build && npm run
  preview`).
- **Reminders** currently fire client-side while the app is open (Notification
  API). For delivery when the app is closed, add a Supabase Edge Function +
  Web Push (VAPID) — see the roadmap.
- Re-run `node scripts/gen-icons.mjs` if you change the brand color or icon.
