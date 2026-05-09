import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { testimonials } from "@/lib/content";

export default function ReviewsPage() {
  return (
    <main className="page-shell">
      <SiteHeader />
      <div className="section-wrap py-16">
        <div className="eyebrow">Reputation System</div>
        <h1 className="heading-display mt-5 text-5xl font-semibold text-slate-950 md:text-6xl">
          Review generation, customer recovery, and trust-building in one flow.
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Happy customers get a fast path to public reviews. Lower ratings route to private feedback so you can
          protect the brand while improving service recovery.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-panel p-7">
            <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--spruce)]">
              Customer Testimonials
            </div>
            <div className="mt-6 grid gap-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="glass-card rounded-[1.5rem] p-5">
                  <div className="text-[var(--gold)]">★★★★★</div>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{testimonial.quote}</p>
                  <div className="mt-4 text-sm font-bold text-slate-950">
                    {testimonial.name} • {testimonial.area}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-8">
            <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--spruce)]">
              Funnel Logic
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-950">
              A smarter path than just asking for a review.
            </div>

            <div className="mt-6 space-y-4">
              {[
                "Scan QR code from garment bag, counter sign, or delivery handoff",
                "Open branded landing page already attached to the customer record",
                "Select star rating and service type",
                "Generate an SEO-friendly review draft with a natural local tone",
                "Copy to Google, Yelp, or Facebook for 4 to 5 stars",
                "Redirect 1 to 3 stars into private issue capture and recovery automation",
              ].map((step, index) => (
                <div key={step} className="surface-panel flex gap-4 p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--foreground)] text-sm font-extrabold text-white">
                    {index + 1}
                  </div>
                  <div className="text-sm leading-7 text-slate-700">{step}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/reviews/leave?invite=demo-atlanta" className="button-primary">
                Try Review Funnel
              </Link>
              <Link href="/contact" className="button-secondary">
                Add It to Booking Flow
              </Link>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
