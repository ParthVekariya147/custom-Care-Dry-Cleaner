import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { ReviewInvite } from "@/lib/types";

const demoInvite: ReviewInvite = {
  id: "demo-invite",
  token: "demo-atlanta",
  source: "qr-door-hanger",
  serviceSlug: "dry-cleaning",
  locale: "en-US",
  customer: {
    id: "demo-customer",
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex@example.com",
    phone: "+14045550198",
  },
};

type JsonRecord = Record<string, unknown>;

function isValidHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key || !isValidHttpUrl(url)) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      isValidHttpUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
  );
}

export async function getReviewInvite(token?: string): Promise<ReviewInvite> {
  const supabase = getSupabaseAdmin();

  if (!supabase || !token) {
    return demoInvite;
  }

  const { data: invitation } = await supabase
    .from("review_invitations")
    .select("id, token, source, service_slug, locale, customer_id")
    .eq("token", token)
    .maybeSingle();

  if (!invitation) {
    return demoInvite;
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("id, first_name, last_name, email, phone")
    .eq("id", invitation.customer_id)
    .maybeSingle();

  return {
    id: invitation.id,
    token: invitation.token,
    source: invitation.source ?? "qr-campaign",
    serviceSlug: invitation.service_slug ?? "dry-cleaning",
    locale: invitation.locale === "es-US" ? "es-US" : "en-US",
    customer: {
      id: customer?.id ?? demoInvite.customer.id,
      firstName: customer?.first_name ?? demoInvite.customer.firstName,
      lastName: customer?.last_name ?? demoInvite.customer.lastName,
      email: customer?.email ?? undefined,
      phone: customer?.phone ?? undefined,
    },
  };
}

export async function captureEvent(payload: JsonRecord) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { saved: false, mode: "demo" as const };
  }

  const { error } = await supabase.from("marketing_events").insert(payload);

  if (error) {
    return { saved: false, mode: "database" as const, error: error.message };
  }

  return { saved: true, mode: "database" as const };
}

export async function saveReviewGeneration(payload: JsonRecord) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { saved: false, mode: "demo" as const };
  }

  const { error } = await supabase.from("review_generations").insert(payload);

  if (error) {
    return { saved: false, mode: "database" as const, error: error.message };
  }

  return { saved: true, mode: "database" as const };
}

export async function savePrivateFeedback(payload: JsonRecord) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { saved: false, mode: "demo" as const };
  }

  const { error } = await supabase.from("private_feedback").insert(payload);

  if (error) {
    return { saved: false, mode: "database" as const, error: error.message };
  }

  return { saved: true, mode: "database" as const };
}

export async function saveLead(payload: JsonRecord) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { saved: false, mode: "demo" as const };
  }

  const { error } = await supabase.from("lead_captures").insert(payload);

  if (error) {
    return { saved: false, mode: "database" as const, error: error.message };
  }

  return { saved: true, mode: "database" as const };
}

export async function saveBooking(payload: JsonRecord) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { saved: false, mode: "demo" as const };
  }

  const { error } = await supabase.from("booking_requests").insert(payload);

  if (error) {
    return { saved: false, mode: "database" as const, error: error.message };
  }

  return { saved: true, mode: "database" as const };
}

export async function getDashboardMetrics() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      orders: 482,
      pickups: 37,
      revenue: 18420,
      reviewDrafts: 126,
      conversionRate: 18.4,
      retentionRate: 78,
    };
  }

  const [{ count: orders }, { count: pickups }, { count: drafts }, { data: revenueRows }] =
    await Promise.all([
      supabase.from("service_orders").select("*", { count: "exact", head: true }),
      supabase.from("pickup_routes").select("*", { count: "exact", head: true }),
      supabase
        .from("review_generations")
        .select("*", { count: "exact", head: true }),
      supabase.from("service_orders").select("total_amount"),
    ]);

  const revenue =
    revenueRows?.reduce((sum, row) => sum + Number(row.total_amount ?? 0), 0) ?? 0;

  return {
    orders: orders ?? 0,
    pickups: pickups ?? 0,
    revenue,
    reviewDrafts: drafts ?? 0,
    conversionRate: 22.1,
    retentionRate: 81,
  };
}
