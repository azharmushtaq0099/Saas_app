import { GoogleGenerativeAI } from "@google/generative-ai";

import { enforceSafeListingLanguage } from "@/features/compliance/safe-language-engine";
import type { ListingInput, ListingOutput } from "@/features/listing/schemas";
import { buildListingPrompt } from "@/features/listing/services/prompt-builder";
import { parseStructuredListingOutput } from "@/features/listing/services/output-parser";

const GENERATION_TIMEOUT_MS = 55_000;

function extractInlineImage(imageDataUrl?: string) {
  if (!imageDataUrl) return null;
  const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("AI generation timed out")), ms);
    promise
      .then((v) => {
        clearTimeout(id);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(id);
        reject(e);
      });
  });
}

function extractResponseText(result: { response: { text: () => string } }): string | null {
  try {
    const text = result.response.text();
    const trimmed = text?.trim();
    return trimmed ? trimmed : null;
  } catch {
    return null;
  }
}

export async function generateListingOutput(
  input: ListingInput,
  geminiApiKey: string,
): Promise<ListingOutput | null> {
  if (!geminiApiKey?.trim()) return null;

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const inlineImage = extractInlineImage(input.imageDataUrl);

  try {
    const result = await withTimeout(
      model.generateContent(
        inlineImage
          ? [
              { text: buildListingPrompt(input) },
              { inlineData: { mimeType: inlineImage.mimeType, data: inlineImage.data } },
            ]
          : buildListingPrompt(input),
      ),
      GENERATION_TIMEOUT_MS,
    );

    const text = extractResponseText(result);
    if (!text) return null;

    const parsed = parseStructuredListingOutput(text);
    return parsed ? enforceSafeListingLanguage(parsed) : null;
  } catch (error) {
    console.error("generateListingOutput failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
