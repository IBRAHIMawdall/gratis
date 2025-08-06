'use server';

/**
 * @fileOverview Suggests relevant items based on a user's favorites or general interest.
 *
 * - suggestItems - A function that suggests items.
 * - SuggestItemsInput - The input type for the suggestItems function.
 * - SuggestItemsOutput - The return type for the suggestItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { FreeItem } from '@/lib/types';

const SuggestItemsInputSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    location: z.string(),
  })).describe('A list of all available items.'),
  favorites: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    location: z.string(),
  })).optional().describe('A list of the user\'s favorite items. This can be used to personalize suggestions.'),
});
export type SuggestItemsInput = z.infer<typeof SuggestItemsInputSchema>;

const SuggestItemsOutputSchema = z.object({
  suggestedItemIds: z.array(z.string()).describe('An array of IDs of the suggested items.'),
});
export type SuggestItemsOutput = z.infer<typeof SuggestItemsOutputSchema>;

export async function suggestItems(input: SuggestItemsInput): Promise<SuggestItemsOutput> {
  return suggestItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestItemsPrompt',
  input: {schema: SuggestItemsInputSchema},
  output: {schema: SuggestItemsOutputSchema},
  prompt: `You are an AI assistant that suggests interesting items to users from a list of available free items.

Your goal is to provide surprising and delightful recommendations.

Here is the list of all available items:
{{#each items}}
- ID: {{id}}, Title: {{title}}, Description: {{description}}
{{/each}}

{{#if favorites}}
The user has shown interest in the following items (favorites):
{{#each favorites}}
- ID: {{id}}, Title: {{title}}, Description: {{description}}
{{/each}}
Based on their favorites, suggest 3 other items from the main list that they might also like.
{{else}}
The user has not provided any favorites. Suggest 3 random, interesting, and diverse items from the list.
{{/if}}

Return only the IDs of the suggested items.`,
});


const suggestItemsFlow = ai.defineFlow(
  {
    name: 'suggestItemsFlow',
    inputSchema: SuggestItemsInputSchema,
    outputSchema: SuggestItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
