import { LegalPageTemplate } from "@/components/legal/LegalPageTemplate";

const sections = [
  {
    id: "overview",
    title: "Privacy Overview",
    content: [
      "This Privacy Policy explains how Listing Studio collects, uses, and protects your information when you use our platform.",
      "We apply privacy-by-default principles and only process data needed for account access, billing, and generation workflows.",
    ],
  },
  {
    id: "data-collected",
    title: "Data We Collect",
    content: [
      "Account data such as email, authentication session metadata, plan status, and generation usage counts.",
      "Product input data you submit for generation, including optional text and image payloads, plus generated output data.",
    ],
  },
  {
    id: "usage",
    title: "How We Use Data",
    content: [
      "We use your data to operate authentication, enforce usage limits, provide paid feature access, and generate requested content.",
      "We may use anonymized operational metrics for reliability, abuse prevention, and product quality improvements.",
    ],
  },
  {
    id: "third-parties",
    title: "Third-Party Services",
    content: [
      "We rely on trusted providers including Supabase for auth/data, Stripe for billing, and AI providers for generation tasks.",
      "These providers process data according to their own privacy and security obligations.",
    ],
  },
  {
    id: "gdpr",
    title: "GDPR and User Rights",
    content: [
      "Where applicable, you may request access, correction, deletion, or export of personal data in line with local privacy laws including GDPR principles.",
      "Contact us for privacy requests, and we will respond within a commercially reasonable timeframe.",
    ],
  },
  {
    id: "security",
    title: "Security and Retention",
    content: [
      "We implement reasonable administrative and technical safeguards to protect platform data.",
      "Data is retained for operational, legal, and security needs and may be deleted when no longer required.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageTemplate
      title="Privacy Policy"
      subtitle="How we handle your data with transparency, security, and SaaS best practices."
      updatedAt="May 8, 2026"
      sections={sections}
    />
  );
}
