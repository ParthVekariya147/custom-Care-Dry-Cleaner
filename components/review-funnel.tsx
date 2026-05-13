"use client";

import { useEffect, useMemo, useState } from "react";

import { services } from "@/lib/content";
import type { ReviewInvite, ReviewLocale, ReviewTone } from "@/lib/types";

type Props = {
  businessName: string;
  publicReviewUrl: string;
  invite: ReviewInvite;
};

type ReviewFocus =
  | "overall-shop"
  | "customer-service"
  | "quality-results"
  | "pickup-delivery"
  | "location-convenience";

const tones: { hint: string; label: string; value: ReviewTone }[] = [
  {
    hint: "The system picks the best tone automatically.",
    label: "Auto",
    value: "auto",
  },
  {
    hint: "Polished, upscale, and a little more refined.",
    label: "Luxury",
    value: "luxury",
  },
  {
    hint: "Reliable and clean without sounding overdone.",
    label: "Professional",
    value: "professional",
  },
  {
    hint: "Warm, local, and easygoing.",
    label: "Friendly",
    value: "friendly",
  },
  {
    hint: "Premium but still rooted in Atlanta trust.",
    label: "Premium Local Brand",
    value: "premium-local",
  },
];

const toneKeywordMap: Record<ReviewTone, string[]> = {
  auto: ["trusted local cleaner", "quality garment care", "easy pickup service"],
  luxury: ["luxury garment care", "white-glove service", "premium dry cleaning"],
  professional: ["professional garment care", "reliable dry cleaner", "on-time pickup"],
  friendly: ["friendly local cleaner", "easy pickup service", "neighborhood laundry help"],
  "premium-local": ["trusted Atlanta dry cleaner", "local pickup and delivery", "premium local service"],
};

const serviceKeywordMap: Record<string, string[]> = {
  "dry-cleaning": ["eco-friendly dry cleaning", "spotless finish", "pressed and ready"],
  "laundry-service": ["wash and fold service", "weekly laundry pickup", "fresh folded delivery"],
  "shoe-cleaning": ["shoe restoration", "sneaker cleaning", "leather shoe care"],
  "carpet-cleaning": ["deep carpet cleaning", "rug pickup service", "odor treatment"],
  alterations: ["tailoring service", "bridal alterations", "perfect fit alterations"],
  "pickup-delivery": ["free pickup and delivery", "same-day pickup", "home service convenience"],
};

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

const reviewFocusOptions: { hint: string; label: string; value: ReviewFocus }[] = [
  {
    hint: "Best for talking about the whole shop experience.",
    label: "Overall Shop",
    value: "overall-shop",
  },
  {
    hint: "Focus on staff, communication, and professionalism.",
    label: "Customer Service",
    value: "customer-service",
  },
  {
    hint: "Focus on how clean, polished, or well-finished everything looked.",
    label: "Quality Results",
    value: "quality-results",
  },
  {
    hint: "Focus on route timing and convenience.",
    label: "Pickup & Delivery",
    value: "pickup-delivery",
  },
  {
    hint: "Focus on Smyrna location convenience.",
    label: "Location",
    value: "location-convenience",
  },
];

function dedupeKeywords(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function resolveTone(
  tone: ReviewTone,
  serviceSlug: string,
  rating: number | null,
): Exclude<ReviewTone, "auto"> {
  if (tone !== "auto") {
    return tone;
  }

  if (serviceSlug === "laundry-service" || serviceSlug === "pickup-delivery") {
    return "friendly";
  }

  if (
    serviceSlug === "shoe-cleaning" ||
    serviceSlug === "alterations" ||
    serviceSlug === "carpet-cleaning"
  ) {
    return (rating ?? 5) >= 5 ? "luxury" : "professional";
  }

  return (rating ?? 5) >= 5 ? "premium-local" : "professional";
}

export function ReviewFunnel({ businessName, publicReviewUrl, invite }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [serviceSlug, setServiceSlug] = useState(invite.serviceSlug);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set([invite.serviceSlug]),
  );
  const [tone, setTone] = useState<ReviewTone>("auto");
  const [locale, setLocale] = useState<ReviewLocale>(invite.locale);
  const [keywordsInput, setKeywordsInput] = useState(
    "eco-friendly dry cleaning, free pickup and delivery, Smyrna",
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [reviewFocus, setReviewFocus] = useState<ReviewFocus>("overall-shop");
  const [reviewPool, setReviewPool] = useState<string[]>([]);
  const [reviewPoolIndex, setReviewPoolIndex] = useState(0);
  const [reviewHistory, setReviewHistory] = useState<string[]>([]);
  const [review, setReview] = useState("");
  const [privateFeedback, setPrivateFeedback] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  const toggleService = (slug: string) => {
    setSelectedServices((current) => {
      const next = new Set(current);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      // Update primary serviceSlug if needed
      if (!next.has(serviceSlug)) {
        setServiceSlug(next.size > 0 ? Array.from(next)[0] : slug);
      }
      return next;
    });
  };

  const selectedService = useMemo(
    () => services.find((item) => item.slug === serviceSlug)?.name ?? "Dry Cleaning",
    [serviceSlug],
  );
  const effectiveTone = useMemo(
    () => resolveTone(tone, serviceSlug, rating),
    [rating, serviceSlug, tone],
  );

  const liveUserKeywords = useMemo(
    () =>
      dedupeKeywords(
        keywordsInput
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    [keywordsInput],
  );

  const toneKeywords = useMemo(
    () =>
      dedupeKeywords([
        ...(toneKeywordMap[effectiveTone] ?? []),
        ...(serviceKeywordMap[serviceSlug] ?? []),
      ]),
    [effectiveTone, serviceSlug],
  );

  const finalKeywordPlan = useMemo(
    () => dedupeKeywords([...liveUserKeywords, ...toneKeywords]).slice(0, 8),
    [liveUserKeywords, toneKeywords],
  );

  const activeRating = hoveredRating ?? rating ?? 0;
  const ratingLabel = rating ? ratingLabels[rating] : "Tap a star";
  const toneHint = tones.find((entry) => entry.value === tone)?.hint ?? "";
  const effectiveToneLabel =
    tones.find((entry) => entry.value === effectiveTone)?.label ?? "Professional";
  const reviewFocusHint =
    reviewFocusOptions.find((entry) => entry.value === reviewFocus)?.hint ?? "";

  async function fetchReviewPool(excludeReviews: string[] = []) {
    if (!rating) {
      return;
    }

    setStatus("loading");
    setReview("");

    const response = await fetch("/api/reviews/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inviteToken: invite.token,
        customerId: invite.customer.id,
        rating,
        serviceSlug,
        tone,
        locale,
        businessName,
        keywords: finalKeywordPlan,
        liveKeywords: liveUserKeywords,
        toneKeywords,
        reviewFocus,
        excludeReviews,
        batchSeed: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      }),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    const payload = (await response.json()) as { reviewId: string; reviews?: string[]; review?: string };
    const pool = payload.reviews?.filter(Boolean) ?? (payload.review ? [payload.review] : []);

    setReviewPool(pool);
    setReviewPoolIndex(0);
    setReview(pool[0] ?? "");
    setStatus("done");
  }

  async function handleGenerateFreshPool() {
    const excludeReviews = [...reviewHistory, ...reviewPool];
    if (reviewPool.length > 0) {
      setReviewHistory((current) => [...current, ...reviewPool].slice(-18));
    }
    await fetchReviewPool(excludeReviews);
  }

  async function handleRefreshReview() {
    if (!rating) {
      return;
    }

    if (reviewPool.length > 0 && reviewPoolIndex < reviewPool.length - 1) {
      const nextIndex = reviewPoolIndex + 1;
      setReviewPoolIndex(nextIndex);
      setReview(reviewPool[nextIndex] ?? "");
      return;
    }

    const excludeReviews = [...reviewHistory, ...reviewPool];
    if (reviewPool.length > 0) {
      setReviewHistory((current) => [...current, ...reviewPool].slice(-18));
    }
    await fetchReviewPool(excludeReviews);
  }

  async function handlePrivateFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating) {
      return;
    }

    setFeedbackStatus("saving");

    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inviteToken: invite.token,
        customerId: invite.customer.id,
        rating,
        serviceSlug,
        notes: privateFeedback,
      }),
    });

    setFeedbackStatus(response.ok ? "saved" : "error");
  }

  async function handleCopyReview() {
    if (!review) {
      return false;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(review);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = review;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      return true;
    } catch {
      return false;
    }
  }

  async function handleCopyAndOpenGoogleReview() {
    const copied = await handleCopyReview();
    if (!copied) {
      return;
    }

    if (typeof window !== "undefined" && publicReviewUrl) {
      window.location.assign(publicReviewUrl);
    }
  }

  function addSuggestedKeyword(keyword: string) {
    const nextKeywords = dedupeKeywords([...liveUserKeywords, keyword]);
    setKeywordsInput(nextKeywords.join(", "));
  }

  useEffect(() => {
    if ((rating ?? 0) >= 4) {
      setReviewHistory([]);
      void fetchReviewPool();
    } else {
      setReviewPool([]);
      setReviewPoolIndex(0);
      setReviewHistory([]);
      setReview("");
      setStatus("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating, serviceSlug]);

  return (
    <div className="review-page-shell">
      <div className="review-mobile-layout">
        <div className="review-top-card">
          <div className="review-top-copy">
            <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--spruce)]">
              Review invitation
            </div>
            <div className="mt-0.5 text-xl font-extrabold text-slate-950">
              Hi there, share your experience.
            </div>
            <div className="mt-1 text-xs leading-5 text-slate-600">
              Step 1: Select service • Step 2: Rate • Step 3: Generate review
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((current) => !current)}
            className="button-secondary review-advanced-toggle w-full justify-center"
          >
            {showAdvanced ? "Hide Advanced" : "Show Advanced"}
          </button>
        </div>

        <div className="review-surface-card">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--spruce)] text-sm font-bold text-white">
              1
            </div>
            <div className="text-sm font-bold text-slate-700">Which service did you use?</div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {services.map((service) => (
              <button
                key={service.slug}
                type="button"
                onClick={() => toggleService(service.slug)}
                data-selected={selectedServices.has(service.slug)}
                className="service-option-button"
              >
                <span className="service-option-name">{service.name}</span>
              </button>
            ))}
          </div>

          <div className="review-mini-card mt-3">
            <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--spruce)]">
              Primary Service
            </div>
            <div className="mt-1 text-lg font-extrabold text-slate-950">
              {selectedService}
            </div>
            {selectedServices.size > 1 && (
              <div className="mt-1 text-xs text-slate-500">
                +{selectedServices.size - 1} more selected
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--spruce)] text-sm font-bold text-white">
                2
              </div>
              <div className="text-sm font-bold text-slate-700">How would you rate your experience with {selectedService}?</div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-extrabold text-[var(--google-yellow-deep)]">{ratingLabel}</span>
            </div>

            <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((value) => {
                const filled = value <= activeRating;

                return (
                  <button
                    key={value}
                    type="button"
                    data-active={rating === value}
                    data-filled={filled}
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="star-button"
                  >
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="star-icon"
                      fill={filled ? "var(--google-yellow)" : "none"}
                      stroke={filled ? "var(--google-yellow-deep)" : "rgba(15,23,42,0.4)"}
                      strokeWidth="1.5"
                    >
                      <path d="M12 2.6l2.86 5.8 6.4.93-4.63 4.51 1.09 6.37L12 17.2l-5.72 3.01 1.09-6.37L2.74 9.33l6.4-.93L12 2.6z" />
                    </svg>
                    <span className="star-label">{value}</span>
                  </button>
                );
              })}
            </div>

            {rating !== null && rating >= 4 && (
              <div className="mt-3 rounded-lg bg-green-50 p-2.5 text-xs text-green-800">
                Perfect! We'll generate a {ratingLabels[rating]?.toLowerCase()} review for <strong>{selectedService}</strong>.
              </div>
            )}

            {rating !== null && rating < 4 && (
              <div className="mt-3 rounded-lg bg-blue-50 p-2.5 text-xs text-blue-800">
                Thank you for the honest feedback on <strong>{selectedService}</strong>. This helps us improve.
              </div>
            )}
          </div>

          {showAdvanced && (
            <div className="review-advanced-panel mt-3">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--spruce)] text-sm font-bold text-white">
                  3
                </div>
                <div className="text-sm font-bold text-slate-700">Advanced options</div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-2 text-sm font-bold text-slate-700">Language</div>
                  <select
                    className="form-select"
                    value={locale}
                    onChange={(event) => setLocale(event.target.value as ReviewLocale)}
                  >
                    <option value="en-US">English (US)</option>
                    <option value="es-US">Spanish (US)</option>
                  </select>
                </div>

                <div>
                  <div className="mb-2 text-sm font-bold text-slate-700">Review tone</div>
                  <select
                    className="form-select"
                    value={tone}
                    onChange={(event) => setTone(event.target.value as ReviewTone)}
                  >
                    {tones.map((entry) => (
                      <option key={entry.value} value={entry.value}>
                        {entry.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-1 text-xs leading-5 text-slate-500">{toneHint}</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="mb-2 text-sm font-bold text-slate-700">Auto review suggestion</div>
                <select
                  className="form-select"
                  value={reviewFocus}
                  onChange={(event) => setReviewFocus(event.target.value as ReviewFocus)}
                >
                  {reviewFocusOptions.map((entry) => (
                    <option key={entry.value} value={entry.value}>
                      {entry.label}
                    </option>
                  ))}
                </select>
                <div className="mt-1 text-xs leading-5 text-slate-500">{reviewFocusHint}</div>
              </div>

              <div className="mt-3">
                <div className="mb-2 text-sm font-bold text-slate-700">Live user keywords</div>
                <input
                  className="form-input"
                  value={keywordsInput}
                  onChange={(event) => setKeywordsInput(event.target.value)}
                  placeholder="eco-friendly dry cleaning, pickup and delivery, Smyrna"
                />
                <div className="mt-1 text-xs leading-5 text-slate-500">
                  Add your own keywords only if you want extra SEO control.
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--spruce)]">
                  Tone-driven keyword suggestions
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {toneKeywords.map((keyword) => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => addSuggestedKeyword(keyword)}
                      className="keyword-chip"
                    >
                      + {keyword}
                    </button>
                  ))}
                </div>
                <div className="mt-3 text-sm font-bold text-slate-700">Final SEO mix</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {finalKeywordPlan.map((keyword) => (
                    <div key={keyword} className="keyword-pill">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {(status === "done" || status === "loading") && (
          <div className="review-result-card">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-extrabold uppercase tracking-[0.16em] text-[var(--spruce)]">
                Generated review
              </div>
              {status === "loading" && <div className="loading-dots" aria-label="Processing review" />}
            </div>

            {status === "loading" && (
              <p className="review-stream mt-2 text-sm leading-6 text-slate-800">
                Creating a fresh review suggestion...
              </p>
            )}

            {status === "done" && review && (
              <>
                <div className="mt-3">
                  <div className="mb-2 text-sm font-bold text-slate-700">Edit review</div>
                  <textarea
                    className="form-textarea review-editor"
                    value={review}
                    onChange={(event) => {
                      setReview(event.target.value);
                    }}
                  />
                </div>

                <div className="review-action-grid mt-3">
                  <button type="button" onClick={handleRefreshReview} className="button-secondary review-action-button">
                    Refresh Review
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyAndOpenGoogleReview}
                    className="button-primary review-action-button"
                  >
                    Copy & Open Google Review
                  </button>
                </div>

                {showAdvanced && (
                  <button
                    type="button"
                    onClick={handleGenerateFreshPool}
                    className="button-secondary mt-2 w-full justify-center"
                  >
                    Generate New Set of 3 Reviews
                  </button>
                )}

                <div className="mt-2 text-xs text-slate-500">
                  Service tagged: {selectedService}. Refresh Review shows the next hidden review from the same set before generating a new set.
                </div>
              </>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="review-result-card">
            <div className="text-sm text-red-600">
              We could not generate the review right now. Please try again.
            </div>
          </div>
        )}

        {rating !== null && rating <= 3 && (
          <form onSubmit={handlePrivateFeedback} className="review-result-card">
            <div className="text-base font-extrabold text-slate-950">Help us make it right</div>
            <p className="mt-1.5 text-xs leading-5 text-slate-600">
              This stays private and routes to your internal recovery workflow instead of a public review page.
            </p>
            <textarea
              className="form-textarea mt-2"
              placeholder="Tell us what happened so support can follow up quickly."
              value={privateFeedback}
              onChange={(event) => setPrivateFeedback(event.target.value)}
              required
            />
            <button type="submit" className="button-primary mt-2 w-full justify-center">
              {feedbackStatus === "saving" ? "Sending feedback..." : "Send Private Feedback"}
            </button>
            <div className="mt-2 text-xs text-slate-500">
              {feedbackStatus === "saved" &&
                "Feedback captured. This is where your customer recovery automation begins."}
              {feedbackStatus === "error" &&
                "Feedback could not be saved yet. Check the database setup and try again."}
              {feedbackStatus === "idle" &&
                "No extra customer fields required because the invite token already identifies the order."}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
