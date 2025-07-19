import type { ContentItem, ContentType } from "./types";
import { z } from "zod";

const AddContentItemInputSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

function determineContentType(url: string): ContentType {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }
  if (url.toLowerCase().endsWith(".pdf")) {
    return "pdf";
  }
  return "website";
}

function generateTitleFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    return "Content from " + hostname;
  } catch {
    return "Untitled Content";
  }
}

export function createContentItem(url: string): ContentItem {
  const contentType = determineContentType(url);
  
  const newItem: ContentItem = {
    id: crypto.randomUUID(),
    url,
    title: generateTitleFromUrl(url),
    type: contentType,
    summary: "",
    keywords: [],
    tags: [],
    createdAt: new Date().toISOString(),
    previewType: contentType === "youtube" || contentType === "website" ? "iframe" : "text",
  };

  return newItem;
}

export function validateUrl(url: string): { success: boolean; error?: string } {
  const result = AddContentItemInputSchema.safeParse({ url });
  
  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors.url?.[0] || "Invalid URL"
    };
  }
  
  return { success: true };
}
