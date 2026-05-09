"use client";

import { useState } from "react";

type State = {
  name: string;
  email: string;
  phone: string;
};

const initialState: State = {
  name: "",
  email: "",
  phone: "",
};

export function LeadCaptureForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        source: "homepage-capture",
      }),
    });

    setStatus(response.ok ? "saved" : "error");
    if (response.ok) {
      setForm(initialState);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-panel p-6">
      <div className="text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--spruce)]">
        SMS + Email Growth Capture
      </div>
      <div className="mt-2 text-2xl font-extrabold text-slate-950">
        Build your win-back list from day one.
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Capture prospects for first-order promotions, route reminders, loyalty updates, and monthly campaigns.
      </p>

      <div className="mt-5 grid gap-3">
        <input
          className="form-input"
          placeholder="Full name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
        <input
          className="form-input"
          placeholder="Email address"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
        <input
          className="form-input"
          placeholder="Mobile number"
          type="tel"
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
        />
      </div>

      <button type="submit" className="button-primary mt-5 w-full">
        {status === "saving" ? "Saving..." : "Unlock VIP Offers"}
      </button>

      <div className="mt-3 text-sm text-slate-500">
        {status === "saved" && "Lead captured. In production this is stored directly in Supabase."}
        {status === "error" && "We could not save that yet. Check your Supabase setup and try again."}
        {status === "idle" && "Perfect for QR campaigns, apartment partnerships, and repeat-order automation."}
      </div>
    </form>
  );
}
