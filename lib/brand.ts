export const brand = {
  name: "Custom Care",
  shortName: "Custom Care",
  city: "Smyrna",
  shoppingCenter: "Cumberland Crossing Shopping Center",
  streetAddress: "2792 Cumberland Blvd SE",
  locality: "Smyrna, GA 30080",
  country: "United States",
  primaryPhone: "1 678-239-4100",
  primaryPhoneHref: "+16782394100",
  smsPhoneHref: "+16782394100",
  email: "hello@customcaredrycleaner.com",
  baseReviewLink: "/r/demo-atlanta",
  bookingLink: "/contact",
  quoteLink: "/contact#quote-request",
  googleReviewUrl:
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ??
    "https://www.google.com/maps/place/Custom+Care+Dry+Cleaner/@33.8843631,-84.4801535,17z/data=!3m1!4b1!4m6!3m5!1s0x88f51059d932d669:0x1733f0a8d5616a69!8m2!3d33.8843631!4d-84.4775786!16s%2Fg%2F1tl_mkfz?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D",
  mapsUrl:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ??
    "https://www.google.com/maps/place/Custom+Care+Dry+Cleaner/@33.8843631,-84.4801535,17z/data=!3m1!4b1!4m6!3m5!1s0x88f51059d932d669:0x1733f0a8d5616a69!8m2!3d33.8843631!4d-84.4775786!16s%2Fg%2F1tl_mkfz?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D",
  serviceAreas: [
    "Smyrna",
    "Atlanta",
    "Marietta",
    "Vinings",
    "Buckhead",
  ],
  seoKeywords: [
    "eco-friendly dry cleaning",
    "free pickup and delivery",
    "Atlanta laundry service",
    "Smyrna dry cleaner",
  ],
  socials: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
  },
};

export const theme = {
  colors: {
    ink: "#0f172a",
    slate: "#334155",
    cream: "#fffaf2",
    sand: "#f4ecdd",
    gold: "#b88746",
    spruce: "#0f766e",
    mint: "#dff4ef",
    coral: "#f97316",
  },
  badges: [
    "Google Top Rated",
    "Eco-Friendly Process",
    "Same-Day Available",
    "Trained Garment Pros",
  ],
};
