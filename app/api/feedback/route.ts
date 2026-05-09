import { NextResponse } from "next/server";

import { captureEvent, savePrivateFeedback } from "@/lib/supabase";

type Payload = {
  inviteToken?: string;
  customerId?: string;
  rating?: number;
  serviceSlug?: string;
  notes?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as Payload;

  if (!payload.rating || !payload.notes || !payload.serviceSlug) {
    return NextResponse.json({ error: "Missing required feedback inputs." }, { status: 400 });
  }

  const feedbackId = crypto.randomUUID();

  await Promise.all([
    savePrivateFeedback({
      id: feedbackId,
      invite_token: payload.inviteToken ?? null,
      customer_id: payload.customerId ?? null,
      rating: payload.rating,
      service_slug: payload.serviceSlug,
      notes: payload.notes,
      status: "open",
      created_at: new Date().toISOString(),
    }),
    captureEvent({
      id: crypto.randomUUID(),
      event_name: "private_feedback_submitted",
      invite_token: payload.inviteToken ?? null,
      customer_id: payload.customerId ?? null,
      metadata: {
        rating: payload.rating,
        service_slug: payload.serviceSlug,
      },
      created_at: new Date().toISOString(),
    }),
  ]);

  return NextResponse.json({ saved: true, feedbackId });
}
