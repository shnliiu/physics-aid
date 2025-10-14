import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../data/resource';

type Handler = Schema['searchFormulas']['functionHandler'];

/**
 * Formula Search Handler
 * Searches formulas by chapter or keyword for RAG context retrieval
 */
export const handler: Handler = async (event) => {
  console.log('=== Formula Search ===');
  console.log('Arguments:', JSON.stringify(event.arguments, null, 2));

  try {
    const { chapterId, keyword, limit } = event.arguments;
    const effectiveLimit = limit ?? 20;

    const env = process.env as any;
    const { resourceConfig } = await getAmplifyDataClientConfig(env);
    const client = generateClient<Schema>({
      authMode: 'iam',
      ...resourceConfig,
    });

    // Build filter based on provided arguments
    let filter: any = {};

    if (chapterId) {
      filter.chapterId = { eq: chapterId };
    }

    // Fetch formulas
    const { data: formulas } = await client.models.Formula.list({
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    });

    console.log(`Found ${formulas.length} formulas before filtering`);

    // If keyword is provided, filter by keyword (client-side search)
    let filteredFormulas = formulas;
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredFormulas = formulas.filter(f =>
        f.title.toLowerCase().includes(lowerKeyword) ||
        f.latex.toLowerCase().includes(lowerKeyword) ||
        f.description?.toLowerCase().includes(lowerKeyword) ||
        f.tags?.some(tag => tag !== null && tag.toLowerCase().includes(lowerKeyword))
      );
    }

    console.log(`Filtered to ${filteredFormulas.length} formulas with keyword`);

    // Limit results
    const limitedFormulas = filteredFormulas.slice(0, effectiveLimit);

    // Map to return type
    return limitedFormulas.map(f => ({
      formulaId: f.id,
      title: f.title,
      latex: f.latex,
      chapterId: f.chapterId,
      relevanceScore: 1.0, // Simple implementation; could add TF-IDF scoring
    }));

  } catch (error: any) {
    console.error('Error in searchFormulas:', error);
    throw new Error(`Failed to search formulas: ${error.message}`);
  }
};
