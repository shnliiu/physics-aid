import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are an expert physics teacher's assistant specializing in Heat and Thermodynamics. Your role is to help students understand complex physics concepts through clear explanations, step-by-step problem solving, and real-world examples.

Guidelines:
- For greetings or small talk: Respond warmly but briefly (1-2 sentences), then invite physics questions
- For physics questions: Provide thorough, step-by-step explanations
- Explain concepts clearly using analogies when helpful
- Show all work and calculations when solving numerical problems
- Reference relevant formulas and laws (First Law, Second Law, etc.)
- Use proper physics terminology and units
- Be patient and supportive - students are learning
- If a question is unclear, ask for clarification

Student's message: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      claude_response: text,
      usedTextbook: false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat route:', error);
    
    return NextResponse.json({
      success: true,
      claude_response: `⚠️ **Service Temporarily Unavailable**

I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a few moments.

**Your Question:**
"${prompt}"

**Alternative Resources:**
1. **Formulas Tab**: Browse physics equations organized by chapter
2. **Problems Tab**: Post your question and get help from classmates
3. **Chapter Wiki**: Check collaborative notes and explanations`,
      warning: 'AI service unavailable',
      usedTextbook: false,
      timestamp: new Date().toISOString()
    });
  }
}
