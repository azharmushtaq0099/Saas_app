import type { ListingInput } from "@/features/listing/schemas";
import { inferProductFocusType } from "@/features/listing/domain/product-focus";

export function getSeoInputWarnings(input: Pick<ListingInput, "productTitle" | "keywords" | "productType" | "targetAudience" | "targetMarket">) {
  const result: string[] = [];
  const focus = inferProductFocusType({ productType: input.productType });
  if (!input.keywords?.trim()) result.push("Add more keywords for better SEO.");
  if (!input.targetAudience?.trim()) result.push("Define target audience for stronger buyer psychology.");
  if (!input.targetMarket?.trim()) result.push("Add a target market/country for localization quality.");
  if (!input.productType?.trim()) result.push("Specify product type for better marketplace fit.");
  if (input.productTitle?.trim() && input.productTitle.trim().length < 12) result.push("Title may be too short.");
  if (focus === "general") {
    result.push("For this MVP, cotton and wooden Etsy product contexts perform best.");
  }
  return result;
}
