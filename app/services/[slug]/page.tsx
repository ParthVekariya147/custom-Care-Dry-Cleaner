import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { services } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="page-shell">
      <SiteHeader />
      <div className="section-wrap py-16">
        <div className="eyebrow">{service.name}</div>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="heading-display text-5xl font-semibold text-slate-950 md:text-6xl">
              {service.shortDescription}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{service.fullDescription}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="surface-panel p-5">
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Starting Price</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-950">{service.startingPrice}</div>
              </div>
              <div className="surface-panel p-5">
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Turnaround</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-950">{service.turnaround}</div>
              </div>
              <div className="surface-panel p-5">
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">Pickup</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-950">Included</div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-7">
            <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--spruce)]">
              Why this matters
            </div>
            <div className="mt-4 text-3xl font-extrabold text-slate-950">
              Service design should lift lifetime value.
            </div>
            <div className="mt-5 grid gap-3">
              {service.featured.map((feature) => (
                <div key={feature} className="surface-panel p-4 text-sm font-semibold text-slate-700">
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="button-primary">
                Book This Service
              </Link>
              <Link href="/reviews/leave?invite=demo-atlanta" className="button-secondary">
                See Review Funnel
              </Link>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
