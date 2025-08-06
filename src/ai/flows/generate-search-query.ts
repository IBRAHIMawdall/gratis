'use server';

/**
 * @fileOverview Generates a search query from a natural language description of desired free items/services.
 *
 * - generateSearchQuery - A function that generates a search query.
 * - GenerateSearchQueryInput - The input type for the generateSearchQuery function.
 * - GenerateSearchQueryOutput - The return type for the generateSearchQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSearchQueryInputSchema = z.object({
  description: z.string().describe('A natural language description of the desired free items or services.'),
  location: z.string().describe('The user location to search for free items/services in.'),
});
export type GenerateSearchQueryInput = z.infer<typeof GenerateSearchQueryInputSchema>;

const GenerateSearchQueryOutputSchema = z.object({
  searchQuery: z.string().describe('The generated search query to find relevant free offerings.'),
});
export type GenerateSearchQueryOutput = z.infer<typeof GenerateSearchQueryOutputSchema>;

export async function generateSearchQuery(input: GenerateSearchQueryInput): Promise<GenerateSearchQueryOutput> {
  return generateSearchQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSearchQueryPrompt',
  input: {schema: GenerateSearchQueryInputSchema},
  output: {schema: GenerateSearchQueryOutputSchema},
  prompt: `You are an AI assistant designed to generate effective search queries for finding free items and services in a given location.

  Based on the user's description of what they are looking for and their location, create a search query that can be used to find relevant results online.

  User Description: {{{description}}}
  Location: {{{location}}}

  Ensure the search query is specific and includes relevant keywords to maximize the chances of finding suitable free offerings. Return only the search query.`,
});

const generateSearchQueryFlow = ai.defineFlow(
  {
    name: 'generateSearchQueryFlow',
    inputSchema: GenerateSearchQueryInputSchema,
    outputSchema: GenerateSearchQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
