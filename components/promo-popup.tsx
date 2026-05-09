"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function PromoPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(true), 1400);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 md:inset-x-auto md:right-5 md:w-[420px]">
      <div className="glass-card rounded-[1.6rem] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--spruce)]">
              First Order Offer
            </div>
            <div className="mt-2 text-lg font-extrabold text-slate-950">
              Get 15% off your first pickup.
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Perfect for launching route density and converting first-time visitors into weekly customers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="rounded-full border border-black/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/contact" className="button-primary px-5 py-3 text-sm">
            Schedule Pickup
          </Link>
          <a href="sms:+14045550198" className="button-secondary px-5 py-3 text-sm">
            Text for Coupon
          </a>
        </div>
      </div>
    </div>
  );
}
