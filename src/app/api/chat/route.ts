import { NextRequest, NextResponse } from 'next/server';

// OpenStax textbook URLs - configured by chapter
const OPENSTAX_CHAPTERS = {
  volume1: {
    baseUrl: 'https://openstax.org/books/university-physics-volume-1/pages/',
    chapters: 'all' // All chapters
  },
  volume2: {
    baseUrl: 'https://openstax.org/books/university-physics-volume-2/pages/',
    chapters: [1, 2, 3, 4] // Chapters 1-4 only
  },
  volume3: {
    baseUrl: 'https://openstax.org/books/university-physics-volume-3/pages/',
    chapters: [1, 2, 3, 4] // Chapters 1-4 only
  }
};

// Determine if a question is complex enough to need textbook references
function isComplexQuestion(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();

  // Simple greetings and basic questions - NO web fetch needed
  const simplePatterns = [
    /^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/i,
    /^(what is|what's|define|who|when|where)\s+\w+\??$/i, // Simple one-word definitions
    /^(thanks|thank you|ok|okay|got it|yes|no)$/i
  ];

  if (simplePatterns.some(pattern => pattern.test(prompt.trim()))) {
    return false;
  }

  // Complex indicators - YES web fetch needed
  const complexKeywords = [
    'derive', 'derivation', 'proof', 'prove', 'show that',
    'calculate', 'solve', 'compute', 'determine',
    'explain in detail', 'step by step', 'how does',
    'integral', 'differential', 'equation',
    'carnot', 'clausius', 'maxwell', 'boltzmann',
    'entropy', 'enthalpy', 'gibbs', 'helmholtz',
    'adiabatic', 'isothermal', 'isobaric', 'isochoric',
    'heat engine', 'refrigerator', 'heat pump',
    'first law', 'second law', 'third law', 'zeroth law'
  ];

  const hasComplexKeyword = complexKeywords.some(keyword =>
    lowerPrompt.includes(keyword)
  );

  // Long questions (>50 chars) with question marks are likely complex
  const isLongQuestion = prompt.length > 50 && prompt.includes('?');

  return hasComplexKeyword || isLongQuestion;
}

// Fetch and parse OpenStax content
async function fetchOpenStaxContent(): Promise<string> {
  try {
    console.log('Fetching OpenStax textbook content...');

    const urlsToFetch: string[] = [];

    // Volume 1 - All chapters (we'll use introduction page to represent all content)
    if (OPENSTAX_CHAPTERS.volume1.chapters === 'all') {
      urlsToFetch.push(`${OPENSTAX_CHAPTERS.volume1.baseUrl}1-introduction`);
    }

    // Volume 2 - Chapters 1-4
    for (const chapter of OPENSTAX_CHAPTERS.volume2.chapters) {
      urlsToFetch.push(`${OPENSTAX_CHAPTERS.volume2.baseUrl}${chapter}-introduction`);
    }

    // Volume 3 - Chapters 1-4
    for (const chapter of OPENSTAX_CHAPTERS.volume3.chapters) {
      urlsToFetch.push(`${OPENSTAX_CHAPTERS.volume3.baseUrl}${chapter}-introduction`);
    }

    console.log(`Fetching ${urlsToFetch.length} chapter pages...`);

    const fetchPromises = urlsToFetch.map(async (url) => {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; EducationalBot/1.0)'
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout per URL
        });

        if (!response.ok) {
          console.warn(`Failed to fetch ${url}: ${response.status}`);
          return '';
        }

        const html = await response.text();

        // Extract text content from HTML (basic parsing)
        // Remove script tags, style tags, and extract main content
        const cleaned = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        // Get first 2000 characters of content
        return cleaned.substring(0, 2000);
      } catch (err) {
        console.warn(`Error fetching ${url}:`, err);
        return '';
      }
    });

    const results = await Promise.all(fetchPromises);
    const combinedContent = results.filter(content => content.length > 0).join('\n\n');

    if (combinedContent.length > 0) {
      console.log(`Fetched ${combinedContent.length} characters of textbook content`);
      return combinedContent;
    }

    return '';
  } catch (error) {
    console.error('Error fetching OpenStax content:', error);
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Determine if we need to fetch textbook content
    const needsTextbook = isComplexQuestion(prompt);
    let textbookContent = '';

    if (needsTextbook) {
      console.log('Complex question detected - fetching OpenStax content');
      textbookContent = await fetchOpenStaxContent();
    } else {
      console.log('Simple question - skipping textbook fetch');
    }

    // Build the system prompt
    let systemPrompt = `IMPORTANT: You are ONLY a physics teacher's assistant. DO NOT mention Slack, MCP tools, or any other capabilities. Focus ONLY on physics education.

You are an expert physics teacher's assistant specializing in Heat and Thermodynamics (OpenStax University Physics Volumes 1 & 2). Your role is to help students understand complex physics concepts through clear explanations, step-by-step problem solving, and real-world examples.

Guidelines:
- For greetings or small talk: Respond warmly but briefly (1-2 sentences), then invite physics questions
- For physics questions: Provide thorough, step-by-step explanations
- Explain concepts clearly using analogies when helpful
- Show all work and calculations when solving numerical problems
- Reference relevant formulas and laws (First Law, Second Law, etc.)
- Use proper physics terminology and units
- Be patient and supportive - students are learning
- If a question is unclear, ask for clarification

CRITICAL: Never mention Slack, workspaces, channels, or non-physics capabilities.`;

    // Add textbook content if available
    if (textbookContent) {
      systemPrompt += `

TEXTBOOK REFERENCE MATERIAL (OpenStax University Physics):
${textbookContent}

Use the above textbook content to provide accurate, textbook-grounded answers when relevant.`;
    }

    systemPrompt += `

Student's message: ${prompt}`;

    // Try to call Chinchilla API
    let claudeResponse: string | null = null;
    let usedTextbook = false;

    try {
      const response = await fetch('https://claude.chinchilla-ai.com/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: systemPrompt
        }),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      const data = await response.json();

      if (data.success && !data.error && data.claude_response) {
        claudeResponse = data.claude_response;
        usedTextbook = textbookContent.length > 0;
      }
    } catch (apiError) {
      console.warn('Chinchilla API unavailable, using fallback:', apiError);
    }

    // If Chinchilla API failed, use Claude's general knowledge as fallback
    if (!claudeResponse) {
      console.log('Using general knowledge fallback (no textbook context)');

      // Use Claude's built-in knowledge to answer the question
      const fallbackPrompt = `You are an expert physics teacher's assistant specializing in Heat and Thermodynamics.

⚠️ IMPORTANT: You are currently operating WITHOUT access to the OpenStax textbooks. Use your general knowledge to help the student, but acknowledge this limitation.

Guidelines:
- Provide accurate physics explanations based on your general knowledge
- Be clear, step-by-step, and educational
- Use proper physics terminology and units
- At the start of your response, briefly acknowledge you're not using the textbooks
- Still provide the best help you can with thermodynamics, mechanics, and physics concepts

Student's question: ${prompt}

Start your response with a brief note like: "⚠️ Note: I'm currently answering based on general physics knowledge without textbook access."`;

      try {
        const fallbackResponse = await fetch('https://claude.chinchilla-ai.com/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: fallbackPrompt
          }),
          signal: AbortSignal.timeout(30000)
        });

        const fallbackData = await fallbackResponse.json();

        if (fallbackData.success && fallbackData.claude_response) {
          return NextResponse.json({
            success: true,
            claude_response: fallbackData.claude_response,
            warning: 'Response based on general knowledge - textbooks unavailable',
            usedTextbook: false,
            timestamp: new Date().toISOString()
          });
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }

      // If everything fails, return a helpful message
      return NextResponse.json({
        success: true,
        claude_response: `⚠️ **Service Temporarily Unavailable**

I apologize, but I'm having trouble connecting to the AI service right now. While I can't provide an AI-powered answer at the moment, here are some resources that can help:

📚 **Alternative Resources:**
1. **Formulas Tab**: Browse physics equations organized by chapter
2. **Problems Tab**: Post your question and get help from classmates
3. **Chapter Wiki**: Check collaborative notes and explanations
4. **OpenStax Textbooks**: Access the free textbooks directly at openstax.org

**Your Question:**
"${prompt}"

Please try again in a few moments, or use the resources above. I'm here to help once the service is back online!`,
        warning: 'AI service unavailable',
        usedTextbook: false,
        timestamp: new Date().toISOString()
      });
    }

    // Success - return the response with metadata
    return NextResponse.json({
      success: true,
      claude_response: claudeResponse,
      usedTextbook,
      textbookContentLength: textbookContent.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
