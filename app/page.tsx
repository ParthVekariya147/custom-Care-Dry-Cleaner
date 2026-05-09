import Link from "next/link";

import { LeadCaptureForm } from "@/components/lead-capture-form";
import { PromoPopup } from "@/components/promo-popup";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { brand, theme } from "@/lib/brand";
import { dashboardPreview, featuredServices, testimonials } from "@/lib/content";

export default function HomePage() {
  return (
    <main className="page-shell">
      <SiteHeader />

      <div className="hero-wrap">
        <div className="section-wrap pb-20 pt-10">
          <section className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-7 pt-6">
            <div className="eyebrow">Atlanta Growth Engine for Garment Care</div>
            <h1 className="heading-display max-w-4xl text-5xl font-semibold leading-[0.95] text-slate-950 md:text-7xl">
              Atlanta&apos;s eco-friendly dry cleaning with free pickup and delivery.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Built to win Atlanta on convenience, reputation, and repeat revenue. This isn&apos;t just a
              cleaner website. It&apos;s the front door to bookings, review growth, and long-term customer retention.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="button-primary">
                Schedule Pickup
              </Link>
              <Link href="/reviews/leave?invite=demo-atlanta" className="button-secondary">
                Leave Review
              </Link>
              <Link href="/contact#quote-request" className="button-secondary">
                Get Free Quote
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {theme.badges.map((badge) => (
                <div key={badge} className="metric-chip">
                  <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
                  {badge}
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Google Rating", "4.9 / 5"],
                ["Average Turnaround", "24 hrs"],
                ["Weekly Pickups", "350+"],
                ["Response Time", "< 5 min"],
              ].map(([label, value]) => (
                <div key={label} className="surface-panel p-4">
                  <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">{label}</div>
                  <div className="mt-2 text-2xl font-extrabold text-slate-950">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass-card rounded-[2rem] p-6 md:p-8">
              <div className="rounded-[1.6rem] bg-[linear-gradient(180deg,#11213f,#0f766e)] p-6 text-white">
                <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/70">
                  Route Density + Retention
                </div>
                <div className="mt-4 heading-display text-4xl font-semibold">
                  The dominant dry cleaner in Atlanta gets there with automation.
                </div>
                <div className="mt-4 grid gap-4 text-sm leading-6 text-white/78">
                  <div>QR review funnel that routes happy customers to Google and saves low ratings for recovery.</div>
                  <div>SMS and email capture layered into pickup booking, loyalty, and win-back campaigns.</div>
                  <div>Neighborhood service-area pages positioned for Smyrna, Marietta, Vinings, Buckhead, and Atlanta searches.</div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <a href="sms:+14045550198" className="surface-panel p-4">
                  <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--spruce)]">SMS CTA</div>
                  <div className="mt-2 text-xl font-extrabold text-slate-950">Text for same-day pickup</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">Fast mobile conversion path for busy households and professionals.</div>
                </a>
                <Link href="/reviews/leave?invite=demo-atlanta" className="surface-panel p-4">
                  <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--spruce)]">QR Review CTA</div>
                  <div className="mt-2 text-xl font-extrabold text-slate-950">Scan-to-review launch page</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">No extra data entry because the customer profile is already mapped to the invite.</div>
                </Link>
              </div>
            </div>
          </div>
          </section>
        </div>
      </div>

      <section className="section-wrap py-8">
        <div className="surface-panel p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--spruce)]">
                Featured Services
              </div>
              <div className="mt-2 heading-display text-4xl font-semibold text-slate-950">
                Designed for both household loyalty and premium-margin upsells.
              </div>
            </div>
            <Link href="/services" className="button-secondary">
              Explore All Services
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredServices.map((service, index) => (
              <div key={service} className="glass-card rounded-[1.6rem] p-5">
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                  0{index + 1}
                </div>
                <div className="mt-2 text-2xl font-extrabold text-slate-950">{service}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Premium presentation, pickup logistics, and repeat-order positioning for {service.toLowerCase()}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap py-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-panel p-7 md:p-8">
            <div className="text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--spruce)]">
              SEO Service Areas
            </div>
            <div className="mt-2 heading-display text-4xl font-semibold text-slate-950">
              Local search coverage built for Atlanta growth.
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {brand.serviceAreas.map((area) => (
                <div key={area} className="glass-card rounded-[1.5rem] p-5">
                  <div className="text-lg font-extrabold text-slate-950">{area}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Dedicated messaging for eco-friendly dry cleaning, laundry pickup, and same-day convenience in {area}.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <LeadCaptureForm />
        </div>
      </section>

      <section className="section-wrap py-8">
        <div className="surface-panel p-7 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--spruce)]">
                Customer Testimonials
              </div>
              <div className="mt-2 heading-display text-4xl font-semibold text-slate-950">
                Social proof that feels local, premium, and believable.
              </div>
            </div>
            <Link href="/reviews" className="button-secondary">
              View Review System
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="glass-card rounded-[1.8rem] p-6">
                <div className="text-2xl text-[var(--gold)]">★★★★★</div>
                <p className="mt-4 text-base leading-8 text-slate-700">{testimonial.quote}</p>
                <div className="mt-5 text-sm font-bold text-slate-950">
                  {testimonial.name} <span className="font-medium text-slate-500">• {testimonial.area}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap py-8">
        <div className="surface-panel p-7 md:p-8">
          <div className="text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--spruce)]">
            Admin Dashboard Preview
          </div>
          <div className="mt-2 heading-display text-4xl font-semibold text-slate-950">
            Operating visibility for orders, routes, reviews, and revenue.
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {dashboardPreview.metrics.map((metric) => (
              <div key={metric.label} className="glass-card rounded-[1.5rem] p-5">
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">{metric.label}</div>
                <div className="mt-3 text-3xl font-extrabold text-slate-950">{metric.value}</div>
                <div className="mt-2 text-sm font-bold text-[var(--spruce)]">{metric.delta}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {dashboardPreview.pipeline.map((step, index) => (
              <div key={step} className="surface-panel p-5">
                <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">
                  Step 0{index + 1}
                </div>
                <div className="mt-2 text-base font-bold text-slate-950">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
      <PromoPopup />
    </main>
  );
}
