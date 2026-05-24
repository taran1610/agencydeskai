# AgencyDesk AI

Marketing site and private-beta waitlist for **AgencyDesk AI** — an AI back office for insurance agencies.

**Live stack:** React 19 · TypeScript · Vite · Remotion (hero animation) · Supabase (waitlist) · deploy to Vercel or Netlify.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in VITE_SITE_URL + Supabase keys
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Launch on X

Full checklist: **[docs/LAUNCH.md](docs/LAUNCH.md)**

Minimum for production:

1. Set `VITE_SITE_URL` to your real domain (no trailing slash).
2. Connect Supabase — **[docs/supabase-setup.md](docs/supabase-setup.md)**.
3. Generate `public/og-image.png` from `public/og-image.svg` (see LAUNCH.md).
4. Deploy to Vercel or Netlify with env vars.
5. Validate your X card, then post your waitlist link.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Typecheck + production build (`prebuild` writes sitemap/robots) |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## Waitlist data flow

1. **Supabase** (preferred) — `waitlist_signups` table when `VITE_SUPABASE_*` is set.
2. **localStorage** — backup key `agencydesk-waitlist`.
3. **Netlify Forms** — best-effort POST when hosted on Netlify.

## Project structure

```text
src/
  components/     HeroAnimation, WaitlistForm, ShareOnX, …
  pages/          LandingPage, PrivacyPage
  lib/            supabase.ts, waitlist.ts
  config/         site.ts (URL, X handle, contact)
public/
  og-image.svg    Source social card art → export to og-image.png
docs/
  LAUNCH.md       X + deploy checklist
  supabase-setup.md
```

## License

Private — AgencyDesk AI.
