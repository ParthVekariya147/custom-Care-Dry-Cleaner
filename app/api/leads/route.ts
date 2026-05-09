import { NextResponse } from "next/server";

import { captureEvent, saveLead } from "@/lib/supabase";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as Payload;

  if (!payload.email && !payload.phone) {
    return NextResponse.json(
      { error: "Provide at least an email or phone number." },
      { status: 400 },
    );
  }

  const leadId = crypto.randomUUID();

  await Promise.all([
    saveLead({
      id: leadId,
      full_name: payload.name ?? null,
      email: payload.email ?? null,
      phone: payload.phone ?? null,
      source: payload.source ?? "website",
      created_at: new Date().toISOString(),
    }),
    captureEvent({
      id: crypto.randomUUID(),
      event_name: "lead_captured",
      metadata: {
        source: payload.source ?? "website",
      },
      created_at: new Date().toISOString(),
    }),
  ]);

  return NextResponse.json({ saved: true, leadId });
}
