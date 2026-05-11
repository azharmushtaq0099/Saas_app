import type { ListingInput } from "@/features/listing/schemas";
import {
  getProductFocusExamples,
  inferProductFocusType,
} from "@/features/listing/domain/product-focus";

export function getClarifyingOnboardingQuestions(
  input: Pick<
    ListingInput,
    "productType" | "material" | "targetAudience" | "targetMarket" | "productText" | "safetyConsiderations"
  >,
) {
  const questions: string[] = [];
  const focusType = inferProductFocusType(input);
  const supportedExamples = getProductFocusExamples(focusType);
  if (!input.productType?.trim()) questions.push("What exact product category are you listing on Etsy?");
  if (!input.material?.trim()) questions.push("What are the primary materials (for example cotton blend or walnut wood)?");
  if (!input.targetAudience?.trim()) questions.push("Who is the primary buyer persona?");
  if (!input.targetMarket?.trim()) questions.push("Which country or region is this listing targeting?");
  if (!input.productText?.trim()) questions.push("What key product benefits, dimensions, or usage context should be included?");
  if (!input.safetyConsiderations?.trim()) questions.push("Any safety sensitivities or age guidance to reflect in safe-language suggestions?");
  if (supportedExamples.length > 0 && !input.productType?.trim()) {
    questions.push(
      `If helpful, align to one of these Etsy-focused examples: ${supportedExamples.slice(0, 4).join(", ")}.`,
    );
  }
  return questions;
}
