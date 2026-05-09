# Custom Care Dry Cleaner

Local-service growth site and review funnel built with `Next.js`, `Tailwind CSS`, `Supabase`, and the `Gemini API`.

## What is included

- Investor-grade marketing site for Atlanta dry-cleaning growth
- Review funnel with 5-star public routing and 1-3 star private recovery
- Real-time Gemini review drafting with tone-aware SEO keywords and live user keyword input
- Automatic customer association through invite tokens instead of asking customers to re-enter email or phone
- Supabase-ready CRM schema for bookings, reviews, loyalty, and marketing events
- Admin dashboard shell for core operating metrics

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Create local environment variables:

```bash
copy .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

## Automatic customer capture

The review landing page expects a known invite token such as:

`/reviews/leave?invite=demo-atlanta`

In production, that token maps to a `review_invitations` row which already knows the customer, email, phone, preferred service, and campaign source. The customer sees a clean review flow, while the database keeps attribution and follow-up data in the background.

## Gemini setup

Set either `GEMINI_API_KEY` or `GOOGLE_API_KEY` in `.env.local`.

The review route streams text back to the client so the customer sees the review appear live instead of waiting for a single final response.

## Brand placeholders to replace next

- Logo
- Final brand colors
- Live pricing
- Google review deep link
- Domain
