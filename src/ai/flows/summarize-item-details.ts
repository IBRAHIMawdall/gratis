'use server';
/**
 * @fileOverview Summarizes the details of a free item or service from a given source.
 *
 * - summarizeItemDetails - A function that summarizes the details of a free item or service.
 * - SummarizeItemDetailsInput - The input type for the summarizeItemDetails function.
 * - SummarizeItemDetailsOutput - The return type for the summarizeItemDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeItemDetailsInputSchema = z.object({
  itemDetails: z.string().describe('The details of the free item or service to summarize.'),
  sourceUrl: z.string().describe('The URL of the source where the item details were found.'),
});
export type SummarizeItemDetailsInput = z.infer<typeof SummarizeItemDetailsInputSchema>;

const SummarizeItemDetailsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the free item or service details.'),
});
export type SummarizeItemDetailsOutput = z.infer<typeof SummarizeItemDetailsOutputSchema>;

export async function summarizeItemDetails(
  input: SummarizeItemDetailsInput
): Promise<SummarizeItemDetailsOutput> {
  return summarizeItemDetailsFlow(input);
}

const summarizeItemDetailsPrompt = ai.definePrompt({
  name: 'summarizeItemDetailsPrompt',
  input: {schema: SummarizeItemDetailsInputSchema},
  output: {schema: SummarizeItemDetailsOutputSchema},
  prompt: `You are an AI assistant that summarizes details of free items or services found online.

  Given the following details and source URL, provide a concise summary of the offering.

  Item Details: {{{itemDetails}}}
  Source URL: {{{sourceUrl}}}

  Summary:`,
});

const summarizeItemDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeItemDetailsFlow',
    inputSchema: SummarizeItemDetailsInputSchema,
    outputSchema: SummarizeItemDetailsOutputSchema,
  },
  async input => {
    const {output} = await summarizeItemDetailsPrompt(input);
    return output!;
  }
);
