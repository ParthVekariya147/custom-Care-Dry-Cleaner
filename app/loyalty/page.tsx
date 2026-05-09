import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { loyaltyPerks } from "@/lib/content";

export default function LoyaltyPage() {
  return (
    <main className="page-shell">
      <SiteHeader />
      <div className="section-wrap py-16">
        <div className="eyebrow">Loyalty Program</div>
        <h1 className="heading-display mt-5 text-5xl font-semibold text-slate-950 md:text-6xl">
          Promotions that reward habit, not one-off discounts.
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Loyalty works best when it reinforces route consistency, premium perception, and referral momentum.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {loyaltyPerks.map((perk) => (
            <div key={perk} className="glass-card rounded-[1.8rem] p-6">
              <div className="text-xl font-extrabold text-slate-950">{perk}</div>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
