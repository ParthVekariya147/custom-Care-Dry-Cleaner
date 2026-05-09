import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function ShortInviteRedirectPage({ params }: PageProps) {
  const { token } = await params;
  redirect(`/reviews/leave?invite=${encodeURIComponent(token)}`);
}
