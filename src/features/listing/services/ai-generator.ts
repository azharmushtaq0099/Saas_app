import { GoogleGenerativeAI } from "@google/generative-ai";

import { enforceSafeListingLanguage } from "@/features/compliance/safe-language-engine";
import type { ListingInput } from "@/features/listing/schemas";
import { buildListingPrompt } from "@/features/listing/services/prompt-builder";
import { parseStructuredListingOutput } from "@/features/listing/services/output-parser";

function extractInlineImage(imageDataUrl?: string) {
  if (!imageDataUrl) return null;
  const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

export async function generateListingOutput(input: ListingInput, geminiApiKey: string) {
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const inlineImage = extractInlineImage(input.imageDataUrl);

  const result = await model.generateContent(
    inlineImage
      ? [{ text: buildListingPrompt(input) }, { inlineData: { mimeType: inlineImage.mimeType, data: inlineImage.data } }]
      : buildListingPrompt(input),
  );

  const text = result.response.text();
  const parsed = parseStructuredListingOutput(text);
  return parsed ? enforceSafeListingLanguage(parsed) : null;
}
