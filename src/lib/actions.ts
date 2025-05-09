
"use server";

import { summarizeContent, type SummarizeContentInput } from "@/ai/flows/summarize-content";
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

export async function addContentItemAction(
  prevState: any,
  formData: FormData
): Promise<{ item?: ContentItem; error?: string; fieldErrors?: Record<string, string[]> }> {
  const validatedFields = AddContentItemInputSchema.safeParse({
    url: formData.get("url"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid URL provided.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { url } = validatedFields.data;
  const contentType = determineContentType(url);

  try {
    const aiInput: SummarizeContentInput = { url };
    // In a real app, you might want to fetch the page title first
    // For now, the AI might infer it or we use a placeholder.
    let title = "Content from " + new URL(url).hostname;
    let summary = "";
    let keywords: string[] = [];

    // AI summarization can be slow, handle potential timeout or make it optional
    try {
      const aiResult = await summarizeContent(aiInput);
      summary = aiResult.summary;
      keywords = aiResult.keywords;
      if (aiResult.summary && aiResult.summary.length > 5) { // Basic check if summary is meaningful
        // Try to extract a title from the summary or use a part of it
        const firstSentence = aiResult.summary.split('.')[0];
        if (firstSentence && firstSentence.length < 100) {
          title = firstSentence;
        }
      }
    } catch (aiError) {
      console.warn("AI summarization failed:", aiError);
      // Proceed without AI summary if it fails
      summary = "Summary not available.";
    }


    const newItem: ContentItem = {
      id: crypto.randomUUID(),
      url,
      title: title || "Untitled Content",
      type: contentType,
      summary,
      keywords,
      tags: [...keywords], // Initial tags from keywords
      createdAt: new Date().toISOString(),
      previewType: contentType === 'youtube' || contentType === 'website' ? 'iframe' : 'text',
    };
    return { item: newItem };
  } catch (error) {
    console.error("Error adding content item:", error);
    return { error: "Failed to add content. Please try again." };
  }
}
