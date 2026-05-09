export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  startingPrice: string;
  turnaround: string;
  featured: string[];
};

export const services: Service[] = [
  {
    slug: "dry-cleaning",
    name: "Dry Cleaning",
    shortDescription: "Precision care for businesswear, uniforms, silk, and formal garments.",
    fullDescription:
      "Investor-grade convenience starts with reliable garment care. Our dry-cleaning flow uses fabric-safe solvents, expert stain treatment, and photo-checked finishing before delivery.",
    startingPrice: "$7.99",
    turnaround: "24 to 48 hours",
    featured: ["Eco-conscious process", "Hand-finished pressing", "Pickup and delivery"],
  },
  {
    slug: "laundry-service",
    name: "Laundry Service",
    shortDescription: "Wash, dry, fold, and household linen service built for busy Atlanta schedules.",
    fullDescription:
      "For professionals, families, and property managers, our laundry service removes friction with recurring pickups, item tracking, and fold-ready delivery windows.",
    startingPrice: "$1.99 / lb",
    turnaround: "Next day",
    featured: ["Recurring plans", "Hypoallergenic options", "Text reminders"],
  },
  {
    slug: "shoe-cleaning",
    name: "Shoe Cleaning",
    shortDescription: "Sneaker whitening, leather conditioning, and deodorizing restoration.",
    fullDescription:
      "We restore premium footwear with material-specific cleaning, reshaping, odor treatment, and finishing designed for luxury, athletic, and daily-wear pairs.",
    startingPrice: "$24.00",
    turnaround: "2 to 4 days",
    featured: ["Leather-safe care", "Suede refresh", "Luxury presentation"],
  },
  {
    slug: "carpet-cleaning",
    name: "Carpet Cleaning",
    shortDescription: "Deep cleaning for rugs, runners, and high-traffic carpet zones.",
    fullDescription:
      "Our carpet team pairs fiber-appropriate treatment with odor control and pickup logistics, making bulky home-care jobs easy for clients and property managers.",
    startingPrice: "$89.00",
    turnaround: "3 to 5 days",
    featured: ["Pet odor removal", "Low-moisture options", "Large item pickup"],
  },
  {
    slug: "alterations",
    name: "Alterations",
    shortDescription: "Tailoring for hems, resizing, bridal prep, and uniform adjustments.",
    fullDescription:
      "Alterations are positioned as margin-friendly premium service lines, from suit tailoring to wedding fittings and recurring hospitality or healthcare uniforms.",
    startingPrice: "$18.00",
    turnaround: "2 to 5 days",
    featured: ["Wedding fittings", "Uniform programs", "Expert tailoring"],
  },
  {
    slug: "pickup-delivery",
    name: "Free Pickup & Delivery",
    shortDescription: "The convenience engine that drives retention, referrals, and repeat orders.",
    fullDescription:
      "Pickup and delivery is the moat. Customers book in seconds, receive SMS updates, and build habit-forming weekly routes that lift lifetime value.",
    startingPrice: "Free",
    turnaround: "Same-day windows available",
    featured: ["Route optimization", "SMS status updates", "Home and office service"],
  },
];

export const featuredServices = [
  "Dry Cleaning",
  "Laundry",
  "Shoe Restoration",
  "Carpet Cleaning",
  "Wedding Garments",
  "Commercial Cleaning",
];

export const testimonials = [
  {
    name: "Danielle R.",
    area: "Buckhead",
    quote:
      "Pickup was seamless, the clothes were flawless, and the text updates made the whole thing feel premium.",
  },
  {
    name: "Michael T.",
    area: "Smyrna",
    quote:
      "They restored two pairs of sneakers and handled my weekly laundry. This feels more like a concierge brand than a neighborhood cleaner.",
  },
  {
    name: "Jasmine L.",
    area: "Vinings",
    quote:
      "The wedding garment care was excellent. Fast, polished, and actually eco-conscious instead of just saying it.",
  },
];

export const loyaltyPerks = [
  "Earn points on every order and bonus credits on recurring pickups",
  "Birthday and anniversary garment-care rewards",
  "Referral credits for neighbors, apartments, and office teams",
  "Win-back campaigns for customers who have been inactive for 30 to 90 days",
];

export const dashboardPreview = {
  metrics: [
    { label: "Monthly Orders", value: "482", delta: "+14%" },
    { label: "Pickup Routes", value: "37", delta: "+8%" },
    { label: "Review Drafts", value: "126", delta: "+31%" },
    { label: "Retention Rate", value: "78%", delta: "+6%" },
  ],
  pipeline: [
    "New customer books first pickup from mobile QR campaign",
    "Route dispatched with SMS update and CRM tagging",
    "Post-delivery review invite sent with known customer profile attached",
    "5-star review routes to Google, lower ratings route to private recovery",
  ],
};
