import { ReviewFunnel } from "@/components/review-funnel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { brand } from "@/lib/brand";
import { getReviewInvite } from "@/lib/supabase";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LeaveReviewPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const inviteToken =
    typeof resolvedSearchParams.invite === "string"
      ? resolvedSearchParams.invite
      : undefined;
  const invite = await getReviewInvite(inviteToken);

  return (
    <main className="page-shell">
      <SiteHeader />
      <div className="section-wrap py-16">
        <ReviewFunnel
          businessName={brand.name}
          publicReviewUrl={brand.googleReviewUrl}
          invite={invite}
        />
      </div>
      <SiteFooter />
    </main>
  );
}
