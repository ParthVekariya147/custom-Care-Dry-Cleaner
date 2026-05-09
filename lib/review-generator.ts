import "server-only";

import { GoogleGenAI } from "@google/genai";

import { brand } from "@/lib/brand";
import { services } from "@/lib/content";
import type { ReviewLocale, ReviewTone } from "@/lib/types";

type ReviewFocus =
  | "overall-shop"
  | "customer-service"
  | "quality-results"
  | "pickup-delivery"
  | "location-convenience";

type GenerateReviewInput = {
  businessName: string;
  rating: number;
  serviceSlug: string;
  keywords: string[];
  liveKeywords?: string[];
  toneKeywords?: string[];
  excludeReviews?: string[];
  batchSeed?: string;
  tone: ReviewTone;
  locale: ReviewLocale;
  reviewFocus?: ReviewFocus;
};

const toneGuide: Record<ReviewTone, string> = {
  auto: "natural and balanced for the service, rating, and local context",
  luxury: "elevated, polished, and high-end",
  professional: "clear, confident, and trustworthy",
  friendly: "warm, easygoing, and neighborly",
  "premium-local": "premium but approachable, rooted in Atlanta local trust",
};

const toneKeywordGuide: Record<ReviewTone, string[]> = {
  auto: [
    "trusted Smyrna dry cleaner",
    "quality garment care",
    "easy pickup service",
    "Cumberland Crossing Shopping Center",
  ],
  luxury: ["luxury garment care", "white-glove service", "premium dry cleaning"],
  professional: ["reliable dry cleaner", "on-time pickup", "professional garment care"],
  friendly: ["friendly local cleaner", "easy pickup service", "neighborhood laundry help"],
  "premium-local": ["trusted Atlanta dry cleaner", "local pickup and delivery", "premium local service"],
};

const serviceKeywordGuide: Record<string, string[]> = {
  "dry-cleaning": ["eco-friendly dry cleaning", "stain-free finish", "pressed and ready"],
  "laundry-service": ["wash and fold service", "weekly laundry pickup", "fresh folded delivery"],
  "shoe-cleaning": ["shoe restoration", "sneaker cleaning", "leather shoe care"],
  "carpet-cleaning": ["rug pickup service", "deep carpet cleaning", "odor treatment"],
  alterations: ["tailoring service", "perfect fit alterations", "bridal alterations"],
  "pickup-delivery": ["free pickup and delivery", "same-day pickup", "home service convenience"],
};

const focusGuide: Record<ReviewFocus, string> = {
  "overall-shop":
    "Highlight the overall experience with the shop, including trust, convenience, quality, and why the customer would come back.",
  "customer-service":
    "Focus on staff helpfulness, communication, professionalism, and how easy the service felt.",
  "quality-results":
    "Focus on how clean, fresh, restored, or well-finished the items looked after service.",
  "pickup-delivery":
    "Focus on pickup and delivery convenience, timing, and how smooth the process was.",
  "location-convenience":
    "Focus on the Smyrna location, Cumberland Crossing Shopping Center, and neighborhood convenience.",
};

const optionDirections = [
  "Option 1 should begin with the overall experience or convenience.",
  "Option 2 should begin with quality, results, or how everything looked after service.",
  "Option 3 should begin with trust, reliability, or why the customer would come back.",
];

function hashSeed(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function dedupeKeywords(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function normalizeReview(text: string) {
  return text
    .replace(/["#*_`]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeReviewForCompare(text: string) {
  return normalizeReview(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function countSentences(text: string) {
  return text
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

function isBalancedReview(text: string) {
  const normalized = normalizeReview(text);
  const words = countWords(normalized);
  const sentences = countSentences(normalized);

  return words >= 32 && words <= 72 && sentences >= 2 && sentences <= 4;
}

function openingSignature(text: string) {
  return normalizeReviewForCompare(text)
    .split(/\s+/)
    .slice(0, 10)
    .join(" ");
}

function getWordSet(text: string) {
  return new Set(
    normalizeReviewForCompare(text)
      .split(/\s+/)
      .filter((word) => word.length > 2),
  );
}

function getSharedPrefixCount(left: string, right: string) {
  const leftWords = normalizeReviewForCompare(left).split(/\s+/).filter(Boolean);
  const rightWords = normalizeReviewForCompare(right).split(/\s+/).filter(Boolean);
  let count = 0;

  while (count < leftWords.length && count < rightWords.length && leftWords[count] === rightWords[count]) {
    count += 1;
  }

  return count;
}

function getWordSimilarity(left: string, right: string) {
  const leftWords = getWordSet(left);
  const rightWords = getWordSet(right);

  if (leftWords.size === 0 || rightWords.size === 0) {
    return 0;
  }

  let overlap = 0;
  for (const word of leftWords) {
    if (rightWords.has(word)) {
      overlap += 1;
    }
  }

  return overlap / Math.max(leftWords.size, rightWords.size);
}

function areReviewsTooSimilar(left: string, right: string) {
  const leftNormalized = normalizeReviewForCompare(left);
  const rightNormalized = normalizeReviewForCompare(right);

  if (!leftNormalized || !rightNormalized) {
    return false;
  }

  if (leftNormalized === rightNormalized) {
    return true;
  }

  if (openingSignature(left) === openingSignature(right)) {
    return true;
  }

  if (getSharedPrefixCount(left, right) >= 6) {
    return true;
  }

  return getWordSimilarity(left, right) >= 0.72;
}

function isTooSimilarToUsed(text: string, usedReviews: string[]) {
  return usedReviews.some((review) => areReviewsTooSimilar(text, review));
}

function orderReviewsForSeed(pool: string[], batchSeed: string) {
  return pool
    .map((review, index) => ({
      review,
      weight: hashSeed(`${batchSeed}:${index}:${openingSignature(review)}`),
    }))
    .sort((left, right) => left.weight - right.weight)
    .map((entry) => entry.review);
}

function dedupeReviewPool(pool: string[]) {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const review of pool) {
    const key = normalizeReviewForCompare(review);
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(review);
  }

  return unique;
}

function selectFallbackBatch(
  pool: string[],
  excludeReviews: string[],
  batchSeed: string,
) {
  const ordered = orderReviewsForSeed(dedupeReviewPool(pool), batchSeed);
  const selected: string[] = [];

  const pushDistinctReviews = (reviews: string[], allowExcluded: boolean) => {
    for (const review of reviews) {
      if (selected.length >= 3) {
        break;
      }

      if (!allowExcluded && isTooSimilarToUsed(review, excludeReviews)) {
        continue;
      }

      if (!isTooSimilarToUsed(review, selected)) {
        selected.push(review);
      }
    }
  };

  pushDistinctReviews(ordered, false);
  pushDistinctReviews(ordered, true);

  return selected.slice(0, 3);
}

function resolveTone(
  input: Pick<GenerateReviewInput, "rating" | "serviceSlug" | "tone">,
): Exclude<ReviewTone, "auto"> {
  if (input.tone !== "auto") {
    return input.tone;
  }

  if (input.serviceSlug === "laundry-service" || input.serviceSlug === "pickup-delivery") {
    return "friendly";
  }

  if (
    input.serviceSlug === "shoe-cleaning" ||
    input.serviceSlug === "alterations" ||
    input.serviceSlug === "carpet-cleaning"
  ) {
    return input.rating >= 5 ? "luxury" : "professional";
  }

  return input.rating >= 5 ? "premium-local" : "professional";
}

function getKeywordPlan(input: GenerateReviewInput) {
  const effectiveTone = resolveTone(input);

  return dedupeKeywords([
    ...input.keywords,
    ...(input.liveKeywords ?? []),
    ...(input.toneKeywords ?? []),
    ...(toneKeywordGuide[effectiveTone] ?? []),
    ...(serviceKeywordGuide[input.serviceSlug] ?? []),
    brand.shoppingCenter,
    brand.city,
  ]).slice(0, 8);
}

function fallbackReviews(input: GenerateReviewInput) {
  const service =
    services.find((item) => item.slug === input.serviceSlug)?.name ?? "dry cleaning";
  const focus = input.reviewFocus ?? "overall-shop";
  const seed = input.batchSeed ?? `${service}-${focus}`;
  const excludeReviews = input.excludeReviews ?? [];

  if (focus === "pickup-delivery") {
    return selectFallbackBatch(
      [
        `Pickup and delivery made the whole experience feel easy from the start. My ${service.toLowerCase()} was handled on time, communication was clear, and everything felt smooth and dependable.`,
        `What I liked most was how convenient the timing felt from beginning to end. The pickup and return process was easy, the communication was clear, and the whole service felt reliable.`,
        `The convenience really stood out to me with this service. Everything moved on time, the updates were clear, and the pickup and delivery process made the whole experience feel simple.`,
        `The easiest part of the whole process was how smooth the pickup and return timing felt. My ${service.toLowerCase()} was handled on schedule, and the communication made everything feel organized.`,
        `I liked how simple the pickup and delivery side of the service felt. The timing was solid, updates were clear, and the whole process made things much more convenient.`,
        `What stood out first was how dependable the pickup and delivery process felt. Everything moved on time, and the service made the whole experience feel low stress.`,
        `Having pickup and delivery available made this much easier than I expected. The timing stayed on track, the communication was clear, and the whole experience felt convenient.`,
        `The route timing and delivery process were handled really well from start to finish. Everything felt smooth, dependable, and easy to keep up with.`,
        `One of the best parts of the service was how easy the pickup and return process felt. The communication was good, the timing worked, and it all felt well managed.`,
      ],
      excludeReviews,
      seed,
    );
  }

  if (focus === "location-convenience") {
    return selectFallbackBatch(
      [
        `Having this shop in Cumberland Crossing Shopping Center makes it really convenient around Smyrna. The process felt easy, the timing worked well, and the overall experience stayed smooth from start to finish.`,
        `The Smyrna location makes this shop very easy to use when you need something handled without extra hassle. Everything felt simple, well organized, and convenient from the beginning.`,
        `I like how convenient this location is for the area, especially at Cumberland Crossing Shopping Center. The service felt smooth, easy to use, and dependable when I needed it.`,
        `The location at Cumberland Crossing Shopping Center makes this shop especially easy to use. The process felt smooth, the timing worked out well, and the whole experience stayed convenient.`,
        `Being in Smyrna makes this a really practical place to use when I need something handled quickly and well. The service felt organized, easy, and reliable from the start.`,
        `What I noticed right away was how convenient the location felt for the area. Everything from timing to the overall process was simple and easy to work with.`,
        `This location works really well if you are around Smyrna and want something dependable without making it complicated. The whole process felt easy, convenient, and smooth from the beginning.`,
        `Cumberland Crossing Shopping Center is a very convenient spot for this kind of service. The timing was easy to work with, and the overall experience felt simple and reliable.`,
        `I liked how practical the location felt for the neighborhood. The process was easy to manage, and the whole experience stayed smooth and convenient the entire time.`,
      ],
      excludeReviews,
      seed,
    );
  }

  if (focus === "quality-results") {
    return selectFallbackBatch(
      [
        `What stood out most was how well everything turned out in the end. My ${service.toLowerCase()} looked clean, fresh, and properly finished, and the quality felt consistent the whole way through.`,
        `The final result looked great and felt carefully done. My ${service.toLowerCase()} came back clean, well finished, and in the kind of condition that makes you notice the attention to detail.`,
        `I was really happy with how everything looked when it came back. The quality felt strong, the finishing looked neat, and the overall result felt worth coming back for.`,
        `The quality showed up most in the final result. My ${service.toLowerCase()} came back looking clean, well finished, and noticeably cared for from top to bottom.`,
        `What impressed me most was how polished everything looked once it was done. The result felt consistent, neat, and handled with real attention to detail.`,
        `I noticed the quality right away when everything came back. The finishing looked sharp, the result felt solid, and the whole service left a really good impression.`,
        `The finished result was what stayed with me most after using the service. My ${service.toLowerCase()} looked refreshed, well handled, and clearly done with care.`,
        `What I appreciated most was how clean and put together everything looked at the end. The overall quality felt strong and the finishing details really stood out.`,
        `The final condition of everything made the service feel worth it. The quality was easy to notice, and the result looked neat, polished, and consistent.`,
      ],
      excludeReviews,
      seed,
    );
  }

  if (focus === "customer-service") {
    return selectFallbackBatch(
      [
        `The service felt professional, helpful, and easy to trust from the beginning. Communication was clear, the process was smooth, and the whole experience felt organized without being complicated.`,
        `What I noticed most was how easy the staff made the whole process feel. Communication was clear, the service felt professional, and everything moved smoothly from start to finish.`,
        `The customer service made a strong impression right away. Everyone felt helpful, the communication was good, and the overall process felt dependable and well managed.`,
        `What stayed with me most was how helpful and clear the service felt from the start. The communication was good, and everything moved in a way that felt easy to trust.`,
        `The staff side of the experience made everything feel smooth and simple. Communication was clear, the process felt organized, and the whole service came across as very dependable.`,
        `I liked how straightforward and professional the customer service felt. Questions were easy to handle, the updates were clear, and the process never felt confusing.`,
        `The customer service really helped the whole experience feel easy. Everyone seemed helpful, the communication was clear, and the process felt well managed from beginning to end.`,
        `What stood out to me was how dependable and organized the communication felt. The service was easy to follow, and everything came across as professional without being stiff.`,
        `The people side of the service made a big difference for me. It felt clear, helpful, and smooth in a way that made the whole experience much easier.`,
      ],
      excludeReviews,
      seed,
    );
  }

  return selectFallbackBatch(
    [
      `The overall experience felt easy, dependable, and well put together from start to finish. My ${service.toLowerCase()} came back looking great, the timing worked well, and the service felt smooth without any hassle.`,
      `From the beginning, the whole experience felt simple and well organized. The quality was solid, the timing worked well, and everything felt easy enough that I would use the shop again.`,
      `What I liked most was how balanced the whole experience felt. The service was smooth, the results looked good, and the process felt dependable in a way that makes it easy to come back.`,
      `The whole experience felt smooth and dependable from the beginning. My ${service.toLowerCase()} looked great when it came back, and the timing made everything easy to work around.`,
      `What stood out most was how easy the entire process felt. The quality was good, the service stayed on track, and everything felt simple enough that I would come back again.`,
      `I liked how well rounded the whole experience felt from start to finish. The timing worked, the results looked good, and the service came across as reliable the entire way through.`,
      `From start to finish, the experience felt easy to trust and easy to use. My ${service.toLowerCase()} came back looking good, and the whole process felt smooth without extra hassle.`,
      `The overall service felt steady, convenient, and well managed. The quality looked strong, the process stayed simple, and everything worked out in a way that felt dependable.`,
      `What I appreciated most was how complete the whole experience felt. The service was smooth, the result looked solid, and everything came together in a way that made it easy to return.`,
    ],
    excludeReviews,
    seed,
  );
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new GoogleGenAI({ apiKey });
}

function createBatchPrompt(input: GenerateReviewInput) {
  const service =
    services.find((item) => item.slug === input.serviceSlug)?.name ?? "dry cleaning";
  const keywordPlan = getKeywordPlan(input);
  const effectiveTone = resolveTone(input);
  const focus = input.reviewFocus ?? "overall-shop";
  const batchSeed = input.batchSeed ?? crypto.randomUUID();
  const avoidText =
    input.excludeReviews && input.excludeReviews.length > 0
      ? input.excludeReviews.join("\n---\n")
      : "none";

  return `Business: ${input.businessName}
Location: ${brand.shoppingCenter}, ${brand.streetAddress}, ${brand.locality}
Phone: ${brand.primaryPhone}
Rating: ${input.rating} stars
Service: ${service}
Tone: ${toneGuide[effectiveTone]}
Locale: ${input.locale}
Review focus: ${focusGuide[focus]}
Keyword plan: ${keywordPlan.join(", ")}
Batch seed: ${batchSeed}
Avoid repeating these previous reviews:
${avoidText}

Write exactly 3 different Google review options for the same happy customer.

Each review must:
- be 2 or 3 natural sentences
- be 40 to 70 words
- sound fully human, local, and believable
- not start with the business name
- not start with "handled my"
- use first-person customer language
- include believable details like timing, convenience, communication, quality, finish, location, or pickup and delivery when it fits
- use keywords naturally, never as a list
- feel a little different from the other options
- do not repeat or closely paraphrase any review from the avoid list
- make this batch noticeably different from earlier batches

Directions:
1. ${optionDirections[0]}
2. ${optionDirections[1]}
3. ${optionDirections[2]}

Output format exactly:
[REVIEW 1]
review text
[REVIEW 2]
review text
[REVIEW 3]
review text`;
}

function parseBatchReviews(text: string, excludeReviews: string[]) {
  const normalized = text.replace(/\r/g, "");
  const matches = normalized.match(
    /\[REVIEW 1\]([\s\S]*?)\[REVIEW 2\]([\s\S]*?)\[REVIEW 3\]([\s\S]*)/i,
  );

  if (!matches) {
    return [];
  }

  const reviews = [matches[1], matches[2], matches[3]]
    .map((entry) => normalizeReview(entry))
    .filter(isBalancedReview);
  const unique: string[] = [];

  for (const review of reviews) {
    if (isTooSimilarToUsed(review, excludeReviews)) {
      continue;
    }

    if (!isTooSimilarToUsed(review, unique)) {
      unique.push(review);
    }
  }

  return unique;
}

export async function generateReviewOptions(input: GenerateReviewInput) {
  const fallback = fallbackReviews(input);
  const client = getGeminiClient();

  if (!client) {
    return fallback;
  }

  try {
    const effectiveTone = resolveTone(input);
    const response = await client.models.generateContent({
      model: process.env.GEMINI_REVIEW_MODEL || "gemini-2.5-flash",
      contents: createBatchPrompt(input),
      config: {
        systemInstruction:
          input.locale === "es-US"
            ? "Escribe resenas de Google breves que suenen humanas, creibles y locales en Estados Unidos. Deben sentirse escritas por una persona real. Evita respuestas muy cortas, reseñas largas, lenguaje robotico y aperturas repetitivas."
            : "Write short Google reviews that sound human, believable, and local to the United States. They should feel like a real person wrote them. Avoid responses that are too short, too long, robotic, or repetitive at the opening.",
        candidateCount: 1,
        responseMimeType: "text/plain",
        temperature: effectiveTone === "luxury" ? 0.82 : 0.75,
        topP: 0.92,
        maxOutputTokens: 420,
      },
    });

    const reviews = parseBatchReviews(response.text || "", input.excludeReviews ?? []);
    if (reviews.length === 3) {
      return reviews;
    }

    return fallback;
  } catch {
    return fallback;
  }
}
