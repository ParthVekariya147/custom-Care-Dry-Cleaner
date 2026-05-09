# Project Documentation — Custom Care Dry Cleaner

This document summarizes the project structure, pages, components, API routes, libraries, data model, and the review-generation flow (Gemini integration and fallbacks).

**Overview**
- **Name:** custom-care-dry-cleaner
- **Purpose:** Local-service marketing site and review funnel for garment care with pickup/delivery, review drafting, and basic CRM workflows.
- **Stack:** Next.js (app router), React, Tailwind CSS, Supabase, Gemini integration via `@google/genai`.

**Quick start**
- Install: `npm install`
- Copy env file: `copy .env.example .env.local`
- Add secrets (see below) to `.env.local`.
- Run dev server: `npm run dev`

**Important environment variables**
- `GEMINI_API_KEY` or `GOOGLE_API_KEY` — required for Gemini / Google GenAI calls.
- `GEMINI_REVIEW_MODEL` — optional; defaults to `gemini-2.5-flash` in code.
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (client+server use).
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-only; required for DB writes in this sample).
- `NEXT_PUBLIC_GOOGLE_REVIEW_URL` / `NEXT_PUBLIC_GOOGLE_MAPS_URL` — optional overrides for public map/review links.

**Architecture overview**
- Frontend: Next.js app (app/) with React components in `components/`.
- Server routes: App route handlers under `app/api/*` implement booking, leads, feedback, and review-generation endpoints.
- Business logic and helpers: `lib/` (brand, content, review-generator, supabase helpers, types).
- Persistence: Supabase schema under `supabase/schema.sql`.
- AI: `lib/review-generator.ts` calls Gemini (via `@google/genai`) when API keys are present and falls back to curated templates when not.

**Site pages (high level)**
- [app/page.tsx](app/page.tsx): Home / marketing landing — CTAs to contact, schedule, and review funnel.
- [app/layout.tsx](app/layout.tsx): Root layout and page metadata.
- [app/services/page.tsx](app/services/page.tsx): Services index (lists service cards).
- [app/services/[slug]/page.tsx](app/services/[slug]/page.tsx): Service detail pages (generated from `lib/content.ts`).
- [app/reviews/page.tsx](app/reviews/page.tsx): Overview of the review funnel and funnel logic.
- [app/reviews/leave/page.tsx](app/reviews/leave/page.tsx): Review landing page — resolves invite token with `getReviewInvite` and renders `ReviewFunnel`.
- Other informational pages: [app/about/page.tsx](app/about/page.tsx), [app/contact/page.tsx](app/contact/page.tsx), [app/admin/page.tsx](app/admin/page.tsx), [app/loyalty/page.tsx](app/loyalty/page.tsx) (content pages and admin shell).

**Key UI components**
- [components/site-header.tsx](components/site-header.tsx): Top navigation and brand header.
- [components/site-footer.tsx](components/site-footer.tsx): Footer with contact, services, and areas.
- [components/lead-capture-form.tsx](components/lead-capture-form.tsx): Homepage lead capture POSTing to `/api/leads`.
- [components/booking-form.tsx](components/booking-form.tsx): Booking form POSTing to `/api/bookings`.
- [components/review-funnel.tsx](components/review-funnel.tsx): Client UI for rating, tone, keyword control, calling `/api/reviews/generate`, and handling private feedback flows.
- [components/promo-popup.tsx](components/promo-popup.tsx): Small promotional modal used site-wide.

**API routes**
- `POST /api/reviews/generate` — [app/api/reviews/generate/route.ts](app/api/reviews/generate/route.ts)
  - Accepts invite token, customer id, rating, serviceSlug, tone, locale, keywords, and options.
  - Calls `generateReviewOptions` from `lib/review-generator.ts`.
  - Persists generation to `review_generations` and emits a `review_draft_generated` marketing event (via `lib/supabase.ts`).

- `POST /api/bookings` — [app/api/bookings/route.ts](app/api/bookings/route.ts)
  - Accepts booking fields and persists to `booking_requests` via `lib/supabase.ts`.

- `POST /api/feedback` — [app/api/feedback/route.ts](app/api/feedback/route.ts)
  - Accepts private feedback (rating + notes) and persists to `private_feedback`.

- `POST /api/leads` — [app/api/leads/route.ts](app/api/leads/route.ts)
  - Accepts minimal lead info (email or phone) and persists to `lead_captures`.

**Libraries / helpers**
- [lib/review-generator.ts](lib/review-generator.ts)
  - Core logic to generate review drafts:
    - Builds a batch prompt including brand, tone, keyword plan, and focus.
    - If `GEMINI_API_KEY` or `GOOGLE_API_KEY` is present, uses `@google/genai` (GoogleGenAI) to call the model and parse output.
    - Includes robust fallback templates and heuristics (dedupe, similarity checks, balanced length) if the model is not available or output is unsuitable.
    - Public function: `generateReviewOptions(input)` returns an array of review text options.

- [lib/supabase.ts](lib/supabase.ts)
  - Server-only Supabase helpers. Uses `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
  - Exposed helpers: `getReviewInvite(token)`, `captureEvent(payload)`, `saveReviewGeneration(payload)`, `savePrivateFeedback(payload)`, `saveLead(payload)`, `saveBooking(payload)`, `getDashboardMetrics()`.
  - Includes demo fallback data when environment variables are not configured (safe local dev experience).

- [lib/content.ts](lib/content.ts) — Service definitions, featured services, testimonials, and dashboard preview sample data.
- [lib/brand.ts](lib/brand.ts) — Brand constants (name, address, phone, review links, service areas, theme colors).
- [lib/types.ts](lib/types.ts) — Shared TypeScript types (ReviewTone, ReviewLocale, ReviewInvite, CustomerProfile).

**Data model (Supabase)**
- Schema: [supabase/schema.sql](supabase/schema.sql)
- Key tables:
  - `customers` — customer profiles.
  - `review_invitations` — invite tokens that map to customers and drive the review landing flow.
  - `review_generations` — stores generated review drafts and metadata.
  - `private_feedback` — captures negative ratings and notes for recovery.
  - `lead_captures` — marketing leads.
  - `booking_requests` — incoming booking requests.
  - `marketing_events` — lightweight event log for analytics and automation.

**Review generation flow (end-to-end)**
1. Customer scans QR or visits invite link `/r/<invite-token>`.
2. The page (`[app/reviews/leave/page.tsx](app/reviews/leave/page.tsx)`) calls `getReviewInvite()` which reads from Supabase (or returns demo data if not configured).
3. `ReviewFunnel` UI collects rating, service, and optional keywords.
4. Client calls `POST /api/reviews/generate` with inputs.
5. Server route uses `lib/review-generator.ts::generateReviewOptions` to produce 1–3 review drafts. If a Gemini API key is present, it calls the model; otherwise it uses curated fallback templates.
6. The route saves the generation to `review_generations` and captures an analytics event in `marketing_events`.
7. If rating >= 4, UI allows copying the draft and redirecting to a public review URL; if rating <= 3, the UI offers private feedback which POSTs to `/api/feedback`.

**Fallbacks & dev experience**
- `lib/supabase.ts` provides a `demoInvite` and returns demo results when Supabase keys are missing so the UI and review flow remain testable locally.
- `lib/review-generator.ts` returns a curated fallback batch of review options if the Gemini client is not configured or model output is unsuitable.

**Testing / smoke checks**
- Manual QA: start dev server and visit the demo invite: `/r/demo-atlanta` — the invite resolves to demo customer data if Supabase is not configured.
- API test: `POST /api/reviews/generate` with a JSON payload that includes `businessName`, `rating`, `serviceSlug`, and `tone` to verify server behavior.

Example test payload (curl):

```bash
curl -X POST http://localhost:3000/api/reviews/generate \
  -H "Content-Type: application/json" \
  -d '{"businessName":"Custom Care Dry Cleaner","rating":5,"serviceSlug":"dry-cleaning","tone":"auto"}'
```

**Secrets & safety**
- Never commit `.env.local` or any secrets. Use environment management or secret stores for production.
- `SUPABASE_SERVICE_ROLE_KEY` is a privileged key — keep it server-only.

**Maintenance & next steps**
- Replace placeholder brand assets and final brand colors found in `lib/brand.ts`.
- Connect a real Supabase project and run `supabase/schema.sql` to create required tables.
- Confirm production Gemini model and quota, then set `GEMINI_API_KEY` and `GEMINI_REVIEW_MODEL` as needed.
- Add server-side rate limits and monitoring for review-generation endpoints to avoid model quota spikes.

**Files referenced**
- Home: [app/page.tsx](app/page.tsx)
- Review funnel: [components/review-funnel.tsx](components/review-funnel.tsx)
- Review generator: [lib/review-generator.ts](lib/review-generator.ts)
- Supabase helpers: [lib/supabase.ts](lib/supabase.ts)
- Schema: [supabase/schema.sql](supabase/schema.sql)

----

Prepared: 2026-04-28
