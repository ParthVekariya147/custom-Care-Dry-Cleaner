import type { Metadata } from "next";

import { brand } from "@/lib/brand";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: `${brand.name} | Eco-Friendly Dry Cleaning in Atlanta`,
  description:
    "Atlanta dry cleaning, laundry, shoe restoration, carpet care, and pickup plus delivery powered by a modern review and retention funnel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="m-0 p-0">{children}</body>
    </html>
  );
}
