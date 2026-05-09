import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { services } from "@/lib/content";

export default function ServicesPage() {
  return (
    <main className="page-shell">
      <SiteHeader />
      <div className="section-wrap py-16">
        <div className="eyebrow">Service Stack</div>
        <h1 className="heading-display mt-5 text-5xl font-semibold text-slate-950 md:text-6xl">
          Premium care lines built for repeat revenue.
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Every service line is positioned to support margin, retention, and convenience across household,
          bridal, sneaker, commercial, and bulky-item care.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {services.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="glass-card rounded-[1.9rem] p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-3xl font-extrabold text-slate-950">{service.name}</div>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">{service.fullDescription}</p>
                </div>
                <div className="rounded-full bg-[rgba(15,118,110,0.1)] px-4 py-2 text-sm font-extrabold text-[var(--spruce)]">
                  Starts {service.startingPrice}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                {service.featured.map((feature) => (
                  <div key={feature} className="metric-chip">
                    {feature}
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
