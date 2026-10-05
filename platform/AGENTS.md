<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Local development

Cloud Agents boot a local Supabase stack (Postgres, Auth, Storage, REST) and both dev servers. Studio, Realtime, and analytics containers are left stopped.

| Service | URL |
| --- | --- |
| Marketing site | http://localhost:5173 |
| Operations console | http://localhost:3000 |
| Supabase API | http://127.0.0.1:54321 |

`.env.local` and `platform/.env.local` are generated on boot from `supabase status`. Signup, client accounts, and waitlist signups work against that local API. Document processing still needs `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` in `platform/.env.local`.

Manual equivalents, from the repo root:

```bash
supabase start -x realtime,imgproxy,studio,edge-runtime,logflare,vector,supavisor,postgres-meta
npm run dev -- --host 0.0.0.0 --port 5173
npm run dev --prefix platform -- --hostname 0.0.0.0 --port 3000
```
