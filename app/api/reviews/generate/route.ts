import { NextResponse } from "next/server";

import { generateReviewOptions } from "@/lib/review-generator";
import { captureEvent, saveReviewGeneration } from "@/lib/supabase";
import type { ReviewLocale, ReviewTone } from "@/lib/types";

type Payload = {
  inviteToken?: string;
  customerId?: string;
  businessName?: string;
  rating?: number;
  serviceSlug?: string;
  tone?: ReviewTone;
  locale?: ReviewLocale;
  keywords?: string[];
  liveKeywords?: string[];
  toneKeywords?: string[];
  excludeReviews?: string[];
  batchSeed?: string;
  reviewFocus?:
    | "overall-shop"
    | "customer-service"
    | "quality-results"
    | "pickup-delivery"
    | "location-convenience";
};

export async function POST(request: Request) {
  const payload = (await request.json()) as Payload;

  if (!payload.businessName || !payload.rating || !payload.serviceSlug || !payload.tone) {
    return NextResponse.json({ error: "Missing required review inputs." }, { status: 400 });
  }

  const reviewId = crypto.randomUUID();
  const reviews = await generateReviewOptions({
    businessName: payload.businessName!,
    rating: payload.rating!,
    serviceSlug: payload.serviceSlug!,
    tone: payload.tone!,
    locale: payload.locale ?? "en-US",
    keywords: payload.keywords ?? [],
    liveKeywords: payload.liveKeywords ?? [],
    toneKeywords: payload.toneKeywords ?? [],
    excludeReviews: payload.excludeReviews ?? [],
    batchSeed: payload.batchSeed,
    reviewFocus: payload.reviewFocus ?? "overall-shop",
  });

  await Promise.all([
    saveReviewGeneration({
      id: reviewId,
      invite_token: payload.inviteToken ?? null,
      customer_id: payload.customerId ?? null,
      rating: payload.rating,
      service_slug: payload.serviceSlug,
      tone: payload.tone,
      locale: payload.locale ?? "en-US",
      keywords: payload.keywords ?? [],
      review_text: reviews.join("\n\n---\n\n"),
      created_at: new Date().toISOString(),
    }),
    captureEvent({
      id: crypto.randomUUID(),
      event_name: "review_draft_generated",
      invite_token: payload.inviteToken ?? null,
      customer_id: payload.customerId ?? null,
      metadata: {
        rating: payload.rating,
        service_slug: payload.serviceSlug,
        tone: payload.tone,
        locale: payload.locale ?? "en-US",
        live_keywords: payload.liveKeywords ?? [],
        tone_keywords: payload.toneKeywords ?? [],
        review_focus: payload.reviewFocus ?? "overall-shop",
        review_count: reviews.length,
      },
      created_at: new Date().toISOString(),
    }),
  ]);

  return NextResponse.json({ reviewId, reviews });
}
