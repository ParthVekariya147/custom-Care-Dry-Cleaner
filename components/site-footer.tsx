import Link from "next/link";

import { brand } from "@/lib/brand";
import { services } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-black/5 pb-10 pt-12">
      <div className="section-wrap grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="heading-display text-3xl font-semibold">{brand.name}</div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            Built to become Atlanta&apos;s most trusted convenience-first dry cleaning brand through
            pickup logistics, review automation, and retention-driven service design.
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
            <a href={`tel:${brand.primaryPhoneHref}`}>{brand.primaryPhone}</a>
            <span>•</span>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </div>
          <div className="text-sm leading-7 text-slate-600">
            {brand.shoppingCenter}
            <br />
            {brand.streetAddress}, {brand.locality}
          </div>
        </div>

        <div>
          <div className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">
            Services
          </div>
          <div className="space-y-3 text-sm text-slate-700">
            {services.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="block hover:text-slate-950">
                {service.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">
            Service Areas
          </div>
          <div className="space-y-3 text-sm text-slate-700">
            {brand.serviceAreas.map((area) => (
              <div key={area}>{area}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
