# Project Summary — Custom Care Dry Cleaner

Project metadata
- Name: custom-care-dry-cleaner
- Version: 0.1.0
- Private: true

Short description
Local-service growth site and review funnel built with Next.js, Tailwind CSS, Supabase, and the Gemini API.

What's included
- Investor-grade marketing site for Atlanta dry-cleaning growth
- Review funnel with 5-star public routing and 1-3 star private recovery
- Real-time Gemini review drafting (tone-aware SEO keywords and live user keyword input)
- Automatic customer association through invite tokens
- Supabase-ready CRM schema for bookings, reviews, loyalty, and marketing events
- Admin dashboard shell for core operating metrics

Tech stack & key dependencies
- Next.js (app router)
- React
- Tailwind CSS + PostCSS
- Supabase (server/client via `@supabase/supabase-js`)
- Gemini integration via `@google/genai`

Repository overview
- `app/` — Next.js application (pages and route handlers)
- `components/` — UI components (booking forms, review funnel, header/footer, etc.)
- `lib/` — helpers and services (`brand.ts`, `content.ts`, `review-generator.ts`, `supabase.ts`, `types.ts`)
- `public/` — static assets
- `supabase/schema.sql` — database schema for CRM and review flows

How to run (quick)
1. Install dependencies: `npm install`
2. Copy env example: `copy .env.example .env.local`
3. Set keys: `GEMINI_API_KEY` or `GOOGLE_API_KEY` in `.env.local` (do not commit)
4. Start dev server: `npm run dev`

Gemini / Review generator notes
- `lib/review-generator.ts` uses `@google/genai` (GoogleGenAI) and reads `process.env.GEMINI_API_KEY` or `process.env.GOOGLE_API_KEY`.
- The code defaults to `gemini-2.5-flash` unless `GEMINI_REVIEW_MODEL` is set.
- If no API key is present the code falls back to locally-defined review templates.

Current status (2026-04-28)
- Initial scaffolding and review-generator integration present.
- Daily report for today saved at `reports/daily-report-2026-04-28.md`.

Recommended next steps
- Replace brand placeholders (logo, colors, live pricing, domain).
- Verify and seed Supabase schema; test invite-token flows end-to-end.
- Confirm Gemini production model, set appropriate API quotas and secrets management.
- Build out admin dashboard metrics and end-to-end monitoring for review funnel.

Prepared on: 2026-04-28
