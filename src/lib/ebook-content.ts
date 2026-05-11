export type EbookChapter = {
  id: string;
  title: string;
  summary: string;
  points: string[];
  thinking: [string, string, string];
};

export const EBOOK_TITLE = "AI Etsy Listing Generator + SaaS Learning eBook";

export const EBOOK_CHAPTERS: EbookChapter[] = [
  {
    id: "idea",
    title: "Chapter 1: Idea",
    summary: "Why this product should exist",
    points: [
      "Problem: Etsy sellers waste time writing listings manually.",
      "Solution: An AI SaaS tool that instantly generates optimized Etsy listings.",
    ],
    thinking: ["Problem", "AI Solution", "Paid SaaS"],
  },
  {
    id: "stack",
    title: "Chapter 2: Tech Stack",
    summary: "How to build fast and ship",
    points: [
      "Next.js for full-stack product delivery and fast iteration.",
      "Supabase for auth, database, and access control.",
      "Gemini API for listing generation quality and speed.",
    ],
    thinking: ["Problem", "AI Solution", "Paid SaaS"],
  },
  {
    id: "monetization",
    title: "Chapter 3: Monetization",
    summary: "How revenue enters the system",
    points: [
      "Stripe paywall system controls free vs Pro access securely on the server.",
      "Simple pricing model: one-time $20 Pro unlock for unlimited generations.",
    ],
    thinking: ["Problem", "AI Solution", "Paid SaaS"],
  },
  {
    id: "growth",
    title: "Chapter 4: Growth Strategy",
    summary: "Getting first users aged 18-25",
    points: [
      "Reddit outreach in entrepreneur and side-project communities.",
      "X (Twitter) posts with before/after listing transformations.",
      "Product positioning: save time, launch faster, earn sooner.",
    ],
    thinking: ["Problem", "AI Solution", "Paid SaaS"],
  },
];

