import { NextRequest, NextResponse } from 'next/server';

// OpenStax textbook URLs
const OPENSTAX_URLS = [
  'https://openstax.org/books/university-physics-volume-1/pages/1-introduction',
  'https://openstax.org/books/university-physics-volume-2/pages/1-introduction',
  'https://openstax.org/books/university-physics-volume-3/pages/1-introduction'
];

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

    const fetchPromises = OPENSTAX_URLS.map(async (url) => {
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

    const response = await fetch('https://claude.chinchilla-ai.com/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: systemPrompt
      }),
      signal: AbortSignal.timeout(600000) // 10 minute timeout
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to AI service' },
      { status: 500 }
    );
  }
}
