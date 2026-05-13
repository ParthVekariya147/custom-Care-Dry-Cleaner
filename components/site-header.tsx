import Link from "next/link";

import { brand } from "@/lib/brand";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/loyalty", label: "Loyalty" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]">
      <div className="header-wrap">
        <div className="section-wrap">
          <div className="glass-card flex items-center justify-between rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 gap-2 sm:gap-4 w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
              <div className="grid h-9 sm:h-10 md:h-11 w-9 sm:w-10 md:w-11 flex-shrink-0 place-items-center rounded-xl sm:rounded-2xl bg-[var(--foreground)] text-xs sm:text-sm font-extrabold text-white">
                CC
              </div>
              <div className="min-w-0">
                <div className="heading-display text-sm sm:text-base md:text-lg font-semibold leading-tight truncate">{brand.name}</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-slate-500 leading-tight truncate">
                  {brand.city} Dry Cleaner
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden items-center gap-4 md:gap-6 text-xs md:text-sm font-semibold text-slate-700 lg:flex">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-slate-950">
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Section - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <a href={`tel:${brand.primaryPhoneHref}`} className="text-xs md:text-sm font-semibold text-slate-600">
                {brand.primaryPhone}
              </a>
              <Link href="/contact" className="button-primary px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm whitespace-nowrap">
                Schedule Pickup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
