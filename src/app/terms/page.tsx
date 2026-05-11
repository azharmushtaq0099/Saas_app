import { LegalPageTemplate } from "@/components/legal/LegalPageTemplate";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: [
      "By accessing Listing Studio, you agree to these Terms of Service and any updates we publish in the legal center.",
      "If you use this platform on behalf of a business, you confirm you have authority to bind that business to these terms.",
    ],
  },
  {
    id: "service-scope",
    title: "Service Scope",
    content: [
      "Listing Studio provides AI-assisted marketplace optimization content, including title suggestions, descriptions, tags, compliance-oriented prompts, and educational guidance.",
      "The service is offered as an optimization tool, not as legal, tax, medical, or financial advice.",
    ],
  },
  {
    id: "ai-output",
    title: "AI Output and Human Review",
    content: [
      "AI-generated outputs are provided for educational and drafting purposes only. They may be incomplete, outdated, or inaccurate for your specific marketplace category.",
      "You are responsible for human review and final verification before publishing any listing, claim, safety statement, or compliance language.",
    ],
  },
  {
    id: "regulations-change",
    title: "Regulations May Change",
    content: [
      "Laws, product standards, and marketplace policies evolve frequently across regions and categories.",
      "Any guidance shown in the platform may become outdated, and users are responsible for validating the latest applicable requirements before use.",
    ],
  },
  {
    id: "independent-verification",
    title: "Independent Verification Required",
    content: [
      "Before commercial publication, users must verify critical product claims, safety statements, material declarations, and policy-sensitive language using independent review.",
      "Where needed, users should seek qualified professional review to confirm fit for their jurisdiction and marketplace.",
    ],
  },
  {
    id: "user-responsibility",
    title: "User Responsibility",
    content: [
      "You are solely responsible for listing accuracy, product claims, intellectual property rights, and marketplace policy compliance in every destination market.",
      "You agree not to use the platform to generate misleading claims, unauthorized trademark usage, unlawful content, or harmful product statements.",
    ],
  },
  {
    id: "ip",
    title: "Intellectual Property",
    content: [
      "You retain ownership of your original product data and business materials uploaded to the platform.",
      "The platform software, branding, and system design remain property of Listing Studio and its licensors.",
    ],
  },
  {
    id: "ai-limitations",
    title: "AI Output Limitations",
    content: [
      "Outputs are probabilistic suggestions and may include omissions, inaccuracies, or category mismatches.",
      "Platform output should be treated as an editable draft, not as a definitive statement of legal or regulatory status.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability and No Warranty",
    content: [
      "To the maximum extent permitted by law, Listing Studio is not liable for indirect, incidental, special, or consequential damages resulting from use of AI-generated content.",
      "The service is provided on an \"as is\" and \"as available\" basis without warranties of legal compliance, regulatory accuracy, marketplace acceptance, or fitness for a specific commercial outcome.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPageTemplate
      title="Terms of Service"
      subtitle="Clear usage terms for our AI marketplace optimization platform."
      updatedAt="May 8, 2026"
      sections={sections}
    />
  );
}
