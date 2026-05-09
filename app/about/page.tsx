import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <main className="page-shell">
      <SiteHeader />
      <div className="section-wrap py-16">
        <div className="eyebrow">About Us</div>
        <h1 className="heading-display mt-5 text-5xl font-semibold text-slate-950 md:text-6xl">
          A neighborhood cleaner run like a premium convenience brand.
        </h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Eco-friendly care",
              body: "Fabric-safe processes, thoughtful stain treatment, and delivery-ready finishing that respects both garments and households.",
            },
            {
              title: "Operational discipline",
              body: "Pickup windows, route density, status messages, and service recovery all built around consistency and customer trust.",
            },
            {
              title: "Growth mindset",
              body: "Reviews, retention campaigns, referral rewards, and loyalty programs turn each order into a compounding asset.",
            },
          ].map((item) => (
            <div key={item.title} className="glass-card rounded-[1.8rem] p-7">
              <div className="text-2xl font-extrabold text-slate-950">{item.title}</div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
