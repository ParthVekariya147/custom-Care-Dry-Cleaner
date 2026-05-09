import { NextResponse } from "next/server";

import { captureEvent, saveBooking } from "@/lib/supabase";

type Payload = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  service?: string;
  notes?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as Payload;

  if (!payload.name || !payload.phone || !payload.email || !payload.address || !payload.service) {
    return NextResponse.json({ error: "Missing required booking inputs." }, { status: 400 });
  }

  const bookingId = crypto.randomUUID();

  await Promise.all([
    saveBooking({
      id: bookingId,
      customer_name: payload.name,
      phone: payload.phone,
      email: payload.email,
      pickup_address: payload.address,
      service_slug: payload.service,
      notes: payload.notes ?? null,
      status: "new",
      created_at: new Date().toISOString(),
    }),
    captureEvent({
      id: crypto.randomUUID(),
      event_name: "booking_requested",
      metadata: {
        service_slug: payload.service,
      },
      created_at: new Date().toISOString(),
    }),
  ]);

  return NextResponse.json({ saved: true, bookingId });
}
