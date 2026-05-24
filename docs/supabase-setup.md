# Supabase Setup

This project uses Supabase as the backend for beta waitlist submissions.

## 1. Add environment variables

Create a local env file:

```bash
cp .env.example .env.local
```

Fill in:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

Find both values in Supabase:

- Project Settings
- API
- Project URL
- Project API keys

Only use the anon public key in the frontend. Do not put the service role key in this Vite app.

## 2. Link the Supabase project

```bash
supabase login
supabase init
supabase link --project-ref YOUR_PROJECT_REF
```

## 3. Apply the migration

```bash
supabase db push
```

This creates `public.waitlist_signups` with Row Level Security enabled and an insert-only policy for public beta signups.

## 4. Test the form

```bash
npm run dev
```

Open the site, submit an email, then check Supabase Table Editor:

```text
public.waitlist_signups
```

If Supabase env vars are missing or Supabase rejects the insert, the form still falls back to localStorage and the existing Netlify form POST.
