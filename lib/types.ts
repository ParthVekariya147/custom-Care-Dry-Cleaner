export type ReviewTone =
  | "auto"
  | "luxury"
  | "professional"
  | "friendly"
  | "premium-local";

export type ReviewLocale = "en-US" | "es-US";

export type CustomerProfile = {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type ReviewInvite = {
  id: string;
  token: string;
  source: string;
  serviceSlug: string;
  locale: ReviewLocale;
  customer: CustomerProfile;
};
