import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDashboardMetrics, isSupabaseConfigured } from "@/lib/supabase";

export default async function AdminPage() {
  const metrics = await getDashboardMetrics();
  const liveMode = isSupabaseConfigured();

  return (
    <main className="page-shell">
      <SiteHeader />
      <div className="section-wrap py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow">Admin Dashboard</div>
            <h1 className="heading-display mt-5 text-5xl font-semibold text-slate-950 md:text-6xl">
              Orders, pickups, reviews, conversion, and retention in one operating view.
            </h1>
          </div>
          <div className="metric-chip">{liveMode ? "Live Supabase Mode" : "Demo Data Mode"}</div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["Orders", metrics.orders.toString()],
            ["Pickup Routes", metrics.pickups.toString()],
            ["Revenue", `$${metrics.revenue.toLocaleString()}`],
            ["Review Drafts", metrics.reviewDrafts.toString()],
            ["Conversion Rate", `${metrics.conversionRate}%`],
            ["Retention Rate", `${metrics.retentionRate}%`],
          ].map(([label, value]) => (
            <div key={label} className="glass-card rounded-[1.8rem] p-6">
              <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">{label}</div>
              <div className="mt-3 text-4xl font-extrabold text-slate-950">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="surface-panel p-6">
            <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--spruce)]">
              Track next
            </div>
            <div className="mt-4 grid gap-3">
              {[
                "Average order value by route",
                "Review conversion by campaign source",
                "Repeat purchase windows by neighborhood",
                "Win-back success by inactive segment",
              ].map((item) => (
                <div key={item} className="glass-card rounded-[1.3rem] p-4 text-sm font-semibold text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-6">
            <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--spruce)]">
              Expansion path
            </div>
            <div className="mt-4 grid gap-3">
              {[
                "Phase 1: Website, QR funnel, review generator, SEO pages",
                "Phase 2: CRM, SMS and email automation, loyalty engine",
                "Phase 3: Franchise system, multi-location rollup, white-label SaaS",
              ].map((item) => (
                <div key={item} className="glass-card rounded-[1.3rem] p-4 text-sm font-semibold text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
