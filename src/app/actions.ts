"use server";

import { z } from "zod";
import { generateSearchQuery } from "@/ai/flows/generate-search-query";
import { summarizeItemDetails } from "@/ai/flows/summarize-item-details";
import { mockFreeItems } from "@/lib/data";
import { FreeItem } from "@/lib/types";

const searchSchema = z.object({
  description: z.string().min(3, "Please describe what you're looking for."),
  location: z.string().min(3, "Please provide a location."),
});

export async function performSearch(data: { description: string; location: string }): Promise<{ items?: FreeItem[], error?: string }> {
  const validation = searchSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.errors.map((e) => e.message).join(", ") };
  }

  try {
    // Step 1: Generate a search query from the user's input.
    const { searchQuery } = await generateSearchQuery(data);

    // Step 2: Filter mock data based on the generated search query.
    // In a real application, this would be a database or API call.
    const keywords = searchQuery.toLowerCase().split(' ').filter(word => word.length > 2);
    const results = mockFreeItems.filter(item => {
        const itemText = `${item.title} ${item.description}`.toLowerCase();
        return keywords.some(keyword => itemText.includes(keyword));
    });

    if (results.length === 0) {
        return { items: [] };
    }

    // Step 3: Summarize the details of each found item.
    const summarizedResults = await Promise.all(
      results.map(async (item) => {
        const { summary } = await summarizeItemDetails({
          itemDetails: item.description,
          sourceUrl: item.sourceUrl,
        });
        return { ...item, description: summary };
      })
    );

    return { items: summarizedResults };
  } catch (error) {
    console.error("An error occurred during search:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
