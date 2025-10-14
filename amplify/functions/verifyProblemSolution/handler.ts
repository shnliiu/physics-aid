import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../data/resource';

type Handler = Schema['verifyProblemSolution']['functionHandler'];

/**
 * AI Verification Handler for Problem Solutions
 * Uses Chinchilla AI API with RAG (Retrieval Augmented Generation)
 * to verify physics problem solutions against chapter formulas.
 */
export const handler: Handler = async (event) => {
  console.log('=== AI Problem Verification ===');
  console.log('Arguments:', JSON.stringify(event.arguments, null, 2));

  try {
    const { problemId, solution, canvasJson } = event.arguments;

    // Initialize Amplify client with IAM auth
    const env = process.env as any;
    const { resourceConfig } = await getAmplifyDataClientConfig(env);
    const client = generateClient<Schema>({
      authMode: 'iam',
      ...resourceConfig,
    });

    // Fetch the problem to get chapter context
    const { data: problem } = await client.models.ProblemPost.get({ id: problemId });

    if (!problem) {
      throw new Error('Problem not found');
    }

    console.log(`Verifying solution for problem in chapter: ${problem.chapterId}`);

    // Fetch relevant formulas from the chapter for RAG context
    const { data: formulas } = await client.models.Formula.list({
      filter: { chapterId: { eq: problem.chapterId } }
    });

    console.log(`Found ${formulas.length} formulas for RAG context`);

    // Build RAG context from formulas
    const formulaContext = formulas
      .map(f => `${f.title}: ${f.latex}\n${f.description || ''}`)
      .join('\n\n');

    // Build prompt for Chinchilla AI
    const prompt = `You are a physics grading assistant. Verify if this student's solution is correct.

PROBLEM:
${problem.title}
${problem.body}

STUDENT'S SOLUTION:
${solution}

RELEVANT FORMULAS FROM CHAPTER:
${formulaContext}

${canvasJson ? 'Note: Student also provided a canvas drawing with their solution.' : ''}

Analyze the solution and respond in JSON format:
{
  "isCorrect": boolean,
  "confidence": number (0.0-1.0),
  "explanation": "Brief explanation of why the solution is correct or incorrect",
  "suggestedImprovements": ["improvement 1", "improvement 2"]
}

Be thorough but concise. Focus on physics accuracy.`;

    // Call Chinchilla AI API
    console.log('Calling Chinchilla AI API for verification...');

    const apiResponse = await fetch('https://claude.chinchilla-ai.com/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!apiResponse.ok) {
      throw new Error(`Chinchilla API error: ${apiResponse.status}`);
    }

    const apiData = await apiResponse.json();
    console.log('Chinchilla AI response received');

    // Parse the Claude response
    const claudeResponse = apiData.claude_response || apiData.message || '';

    // Extract JSON from response (Claude might wrap it in markdown)
    const jsonMatch = claudeResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response as JSON');
    }

    const verification = JSON.parse(jsonMatch[0]);

    // Update the problem post with verification result
    await client.models.ProblemPost.update({
      id: problemId,
      aiVerified: verification.isCorrect,
      aiVerificationNote: verification.explanation,
    });

    console.log(`Verification complete: ${verification.isCorrect ? 'CORRECT' : 'INCORRECT'}`);

    return {
      isCorrect: verification.isCorrect,
      confidence: verification.confidence,
      explanation: verification.explanation,
      suggestedImprovements: verification.suggestedImprovements || [],
    };

  } catch (error: any) {
    console.error('Error in verifyProblemSolution:', error);
    throw new Error(`Failed to verify solution: ${error.message}`);
  }
};
