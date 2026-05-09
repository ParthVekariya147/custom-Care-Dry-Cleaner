# Supabase Setup

## Core idea

The review system should not ask the customer to re-enter personal details. Instead, every QR code or SMS review link contains an invite token such as:

`/reviews/leave?invite=demo-atlanta`

That token maps to a known `review_invitations` row, which already references the customer record and service context.

## Tables used

- `customers`: known customer profile data
- `review_invitations`: tokenized review-entry records
- `review_generations`: public-review drafts created by the AI flow
- `private_feedback`: low-rating internal recovery submissions
- `lead_captures`: email and SMS capture from marketing sections
- `booking_requests`: web pickup requests
- `service_orders`: revenue and order reporting
- `pickup_routes`: route and delivery operations
- `marketing_events`: funnel tracking and attribution

## Suggested invite workflow

1. Create customer when booking is placed.
2. Create service order after pickup or checkout.
3. Issue `review_invitations.token` after delivery completes.
4. Send tokenized link by SMS, email, or QR.
5. Let the landing page fetch the linked customer silently.
6. Save every action for retention, recovery, and campaign reporting.

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `GOOGLE_API_KEY`
- `GEMINI_REVIEW_MODEL`
- `NEXT_PUBLIC_GOOGLE_REVIEW_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_URL`
