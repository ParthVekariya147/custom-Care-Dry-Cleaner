"use client";

import { useState } from "react";

type BookingState = {
  name: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  notes: string;
};

const initialBookingState: BookingState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  service: "dry-cleaning",
  notes: "",
};

export function BookingForm() {
  const [form, setForm] = useState(initialBookingState);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setStatus(response.ok ? "saved" : "error");
    if (response.ok) {
      setForm(initialBookingState);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-panel p-7">
      <div className="text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--spruce)]">
        Booking Form
      </div>
      <div className="mt-2 text-3xl font-extrabold text-slate-950">Schedule your pickup</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Mobile-first booking for home, office, apartment concierge, or recurring routes.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          className="form-input"
          placeholder="Full name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
        <input
          className="form-input"
          placeholder="Phone number"
          type="tel"
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
          required
        />
        <input
          className="form-input"
          placeholder="Email address"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
        <select
          className="form-select"
          value={form.service}
          onChange={(event) => setForm((current) => ({ ...current, service: event.target.value }))}
        >
          <option value="dry-cleaning">Dry Cleaning</option>
          <option value="laundry-service">Laundry Service</option>
          <option value="shoe-cleaning">Shoe Cleaning</option>
          <option value="carpet-cleaning">Carpet Cleaning</option>
          <option value="alterations">Alterations</option>
        </select>
      </div>

      <div className="mt-4 grid gap-4">
        <input
          className="form-input"
          placeholder="Pickup address"
          value={form.address}
          onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
          required
        />
        <textarea
          className="form-textarea"
          placeholder="Special instructions, timing, garment notes, gate code, or stain details"
          value={form.notes}
          onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
        />
      </div>

      <button type="submit" className="button-primary mt-5 w-full">
        {status === "saving" ? "Sending request..." : "Confirm Pickup Request"}
      </button>

      <div className="mt-3 text-sm text-slate-500">
        {status === "saved" && "Pickup request saved. Your CRM can now trigger confirmations and route planning."}
        {status === "error" && "The booking could not be saved yet. Check your Supabase environment variables."}
        {status === "idle" && "Ideal next step: send instant SMS confirmation and assign to route cluster."}
      </div>
    </form>
  );
}
