# Launch on X — AgencyDesk AI

Use this checklist to go from local dev to a live URL you can post on X with a rich link preview.

## 1. Configure environment

```bash
cp .env.example .env.local
```

Set these before your first production build:

| Variable | Example | Why |
|----------|---------|-----|
| `VITE_SITE_URL` | `https://agencydesk.ai` | Canonical URL, sitemap, X card image URL |
| `VITE_X_HANDLE` | `agencydeskai` | Footer link + optional analytics |
| `VITE_CONTACT_EMAIL` | `liber1821@gmail.com` | Footer + privacy page |
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Store waitlist signups |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Public insert-only key |
| `VITE_PLAUSIBLE_DOMAIN` | `agencydesk.ai` | Optional traffic analytics |

See [supabase-setup.md](./supabase-setup.md) for the database.

## 2. Social preview image (required for X)

X works best with a **1200×630 PNG** at `public/og-image.png`.

Source art lives in `public/og-image.svg`. Regenerate PNG after edits:

```bash
npx @resvg/resvg-js-cli public/og-image.svg -o public/og-image.png -w 1200 -h 630
```

## 3. Deploy

### Option A — Vercel (recommended)

1. Push this repo to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Vite**.
4. Add all `VITE_*` variables from `.env.example` for **Production**.
5. Deploy. Set your custom domain under **Settings → Domains**.
6. Update `VITE_SITE_URL` to the final domain and redeploy once.

`vercel.json` is already configured for SPA routing.

### Option B — Netlify

1. Connect the repo at [app.netlify.com](https://app.netlify.com).
2. Build command: `npm run build`, publish directory: `dist`.
3. Add `VITE_*` env vars in **Site configuration → Environment variables**.
4. Netlify Forms will pick up the hidden `waitlist` form in `index.html`.

`netlify.toml` and `public/_redirects` handle SPA routing.

## 4. Verify before you post on X

- [ ] Site loads at your production URL
- [ ] Hero animation plays (or static frame with reduced motion)
- [ ] Submit the waitlist form → row appears in Supabase `waitlist_signups`
- [ ] `/privacy` loads
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator) or X post composer shows **large image** + title + description
- [ ] `https://YOUR_DOMAIN/robots.txt` and `/sitemap.xml` resolve

## 5. Post on X

**Suggested first post** (edit handle/URL):

> We're opening a private beta for AgencyDesk AI — an AI back office for insurance agencies.
>
> Intake PDFs → summarize the file → stage CRM fields → flag missing forms.
> Human approval before anything hits your AMS.
>
> Join the waitlist: https://YOUR_DOMAIN

On the site, visitors can also tap **Share on X** under the hero form (pre-filled intent tweet).

**Pin the post** after publishing so profile visitors see the CTA.

## 6. After launch

- Export waitlist from Supabase Table Editor → CSV for outreach
- Turn on Plausible (or add `VITE_PLAUSIBLE_DOMAIN`) to track visits and “Waitlist signup” events
- Reply to agency owners who engage — ask one question: “What packet slows your team down most?”

## Troubleshooting

| Issue | Fix |
|-------|-----|
| X card has no image | Ensure `public/og-image.png` exists and `VITE_SITE_URL` matches live domain; redeploy |
| Form saves locally only | Set Supabase env vars; run `supabase db push` |
| Supabase insert fails | Check RLS policy and email format; see browser Network tab |
| 404 on `/privacy` | Redeploy with Vercel/Netlify SPA redirect config |
