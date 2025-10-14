import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../data/resource';

type Handler = Schema['getFeaturedProblems']['functionHandler'];

/**
 * Get Featured Problems Handler
 * Returns teacher-featured problems sorted by most recent
 */
export const handler: Handler = async (event) => {
  console.log('=== Get Featured Problems ===');
  console.log('Arguments:', JSON.stringify(event.arguments, null, 2));

  try {
    const { limit } = event.arguments;
    const effectiveLimit = limit ?? 10;

    const env = process.env as any;
    const { resourceConfig } = await getAmplifyDataClientConfig(env);
    const client = generateClient<Schema>({
      authMode: 'iam',
      ...resourceConfig,
    });

    // Fetch all problems with featured = true
    const { data: problems } = await client.models.ProblemPost.list({
      filter: { featured: { eq: true } }
    });

    console.log(`Found ${problems.length} featured problems`);

    // Sort by featuredAt date (most recent first)
    const sortedProblems = problems
      .filter(p => p.featuredAt) // Only include problems with featuredAt set
      .sort((a, b) => {
        const dateA = new Date(a.featuredAt!).getTime();
        const dateB = new Date(b.featuredAt!).getTime();
        return dateB - dateA;
      })
      .slice(0, effectiveLimit);

    // Return the problems (type is already correct)
    return sortedProblems as any[];

  } catch (error: any) {
    console.error('Error in getFeaturedProblems:', error);
    throw new Error(`Failed to get featured problems: ${error.message}`);
  }
};
