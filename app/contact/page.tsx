import { BookingForm } from "@/components/booking-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { brand } from "@/lib/brand";

export default function ContactPage() {
  return (
    <main className="page-shell">
      <SiteHeader />
      <div className="section-wrap py-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="eyebrow">Contact + Booking</div>
            <h1 className="heading-display text-5xl font-semibold text-slate-950 md:text-6xl">
              Book a pickup, request a quote, or talk to support.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Built for click-to-call, mobile booking, and fast support across Atlanta service areas.
            </p>

            <div className="surface-panel p-6">
              <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--spruce)]">
                Store Location
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-950">{brand.shoppingCenter}</div>
              <div className="mt-3 text-sm leading-7 text-slate-600">
                {brand.streetAddress}
                <br />
                {brand.locality}
                <br />
                {brand.country}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <a href={`tel:${brand.primaryPhoneHref}`} className="glass-card rounded-[1.6rem] p-6">
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--spruce)]">Call</div>
                <div className="mt-2 text-2xl font-extrabold text-slate-950">{brand.primaryPhone}</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">Fastest path for same-day service requests.</div>
              </a>
              <a href={`sms:${brand.smsPhoneHref}`} className="glass-card rounded-[1.6rem] p-6">
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--spruce)]">Text</div>
                <div className="mt-2 text-2xl font-extrabold text-slate-950">SMS Support</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">Ideal for apartment access notes, route updates, and promo links.</div>
              </a>
            </div>

            <div className="surface-panel overflow-hidden">
              <div className="border-b border-black/5 p-6">
                <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--spruce)]">
                  Google Maps
                </div>
                <div className="mt-2 text-2xl font-extrabold text-slate-950">Primary Atlanta coverage</div>
              </div>
              <div className="p-6">
                <iframe
                  title="Custom Care Dry Cleaner service map"
                  src="https://www.google.com/maps?q=2792%20Cumberland%20Blvd%20SE%20Smyrna%20GA%2030080&output=embed"
                  className="h-[320px] w-full rounded-[1.5rem] border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div id="quote-request">
            <BookingForm />
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
