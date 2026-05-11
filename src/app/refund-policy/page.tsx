import { LegalPageTemplate } from "@/components/legal/LegalPageTemplate";

const sections = [
  {
    id: "policy-overview",
    title: "Policy Overview",
    content: [
      "This Refund Policy explains how Listing Studio handles refunds for one-time and paid plan purchases.",
      "We aim to keep this policy clear, fair, and aligned with a production-ready SaaS experience.",
    ],
  },
  {
    id: "eligibility",
    title: "Refund Eligibility",
    content: [
      "Refund requests are evaluated case-by-case and typically require a valid billing reason such as accidental duplicate payment or technical access failure.",
      "Requests should be submitted promptly after purchase to support timely review.",
    ],
  },
  {
    id: "non-refundable",
    title: "Non-Refundable Cases",
    content: [
      "Refunds may be declined where substantial service value has already been delivered, including successful usage and generated output access.",
      "Dissatisfaction with business results alone does not create automatic refund eligibility.",
    ],
  },
  {
    id: "processing",
    title: "Processing Timeline",
    content: [
      "Approved refunds are issued back to the original payment method through our billing provider.",
      "Processing times vary by payment network and bank but are usually completed within several business days.",
    ],
  },
  {
    id: "ai-limits",
    title: "AI Output Expectations",
    content: [
      "AI outputs are optimization drafts and educational guidance, not assured performance outcomes.",
      "Because outputs require human review and market-specific judgment, purchase decisions should account for this limitation.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPageTemplate
      title="Refund Policy"
      subtitle="Billing and refund expectations for a transparent marketplace optimization SaaS."
      updatedAt="May 8, 2026"
      sections={sections}
    />
  );
}
