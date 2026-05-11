import { LegalPageTemplate } from "@/components/legal/LegalPageTemplate";

const sections = [
  {
    id: "purpose",
    title: "Purpose of AI Guidance",
    content: [
      "Listing Studio provides AI-assisted optimization recommendations designed to improve draft quality and workflow speed.",
      "All AI content is educational guidance only and is not legal certification, legal advice, or regulatory approval.",
    ],
  },
  {
    id: "outcome-limitations",
    title: "Outcome Limitations",
    content: [
      "We do not provide assurances of listing approval, policy alignment, ranking, conversion rates, or business outcomes from generated output.",
      "AI systems may produce errors, omissions, or outdated interpretations depending on context and timing.",
    ],
  },
  {
    id: "regulations-change",
    title: "Regulations May Change",
    content: [
      "Legislation, standards, and marketplace enforcement practices can change rapidly across regions.",
      "Generated guidance may not reflect the most recent updates at the time of publication.",
    ],
  },
  {
    id: "human-loop",
    title: "Independent Verification Required",
    content: [
      "Users must independently review all generated copy, compliance suggestions, and risk notices before using them commercially.",
      "Critical statements such as safety claims, materials, age suitability, and legal declarations must be validated by a qualified human reviewer.",
    ],
  },
  {
    id: "compliance-limits",
    title: "AI Output Limitations",
    content: [
      "Marketplace compliance reminders are high-level and may not capture category-specific legal obligations in every jurisdiction.",
      "You remain responsible for confirming requirements such as CE, CPSIA, EUDR, packaging/EPR, and local consumer rules where applicable, including any future policy updates.",
    ],
  },
  {
    id: "best-practice",
    title: "Recommended Best Practice",
    content: [
      "Treat generated output as an editable first draft and run an internal or professional review process before publication.",
      "Maintain source documentation, testing records, and product evidence to support your marketplace claims.",
    ],
  },
];

export default function AiDisclaimerPage() {
  return (
    <LegalPageTemplate
      title="AI Disclaimer"
      subtitle="Understand how to use AI outputs responsibly in a commercial marketplace workflow."
      updatedAt="May 8, 2026"
      sections={sections}
    />
  );
}
