import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Physics Tutor with RAG
 * Uses Chinchilla API with formula context for accurate physics answers
 *
 * Note: Simplified version without Amplify client dependency
 * Formulas can be fetched from database directly or via separate endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const { question, chapterId } = await request.json();

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question is required' },
        { status: 400 }
      );
    }

    console.log('=== AI Physics Question ===');
    console.log('Question:', question);
    console.log('Chapter context:', chapterId || 'all');

    // For now, use general physics context
    // TODO: Fetch formulas from database when Amplify is properly configured on server-side
    const formulaContext = 'Use your general physics knowledge from OpenStax University Physics textbooks.';

    // Build comprehensive system prompt for Chinchilla AI
    const systemPrompt = `You are an expert Physics 4C teaching assistant specializing in thermodynamics and modern physics.

IMPORTANT INSTRUCTIONS:
- You are ONLY a physics tutor. Focus exclusively on physics education.
- DO NOT mention Slack, MCP tools, or any non-physics capabilities.
- Provide thorough, step-by-step explanations for complex problems.
- Show all work and calculations when solving numerical problems.
- Use proper physics terminology, notation, and units.
- Reference formulas from the context below when applicable.
- If the question is unclear, ask for clarification.
- Be patient and encouraging - students are learning.

RELEVANT FORMULAS AND CONCEPTS:
${formulaContext}

STUDENT'S QUESTION:
${question}

Provide a clear, accurate answer based on physics principles and the formulas above.`;

    // Call Chinchilla AI API
    console.log('Calling Chinchilla AI API...');
    const apiResponse = await fetch('https://claude.chinchilla-ai.com/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: systemPrompt }),
      signal: AbortSignal.timeout(60000), // 60 second timeout
    });

    if (!apiResponse.ok) {
      throw new Error(`Chinchilla API error: ${apiResponse.status}`);
    }

    const apiData = await apiResponse.json();
    const claudeResponse = apiData.claude_response || apiData.message || '';

    console.log('AI response received, length:', claudeResponse.length);

    return NextResponse.json({
      success: true,
      answer: claudeResponse,
      formulasUsed: 0, // Simplified for now
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error in AI physics chat:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process question',
        details: error.message
      },
      { status: 500 }
    );
  }
}

