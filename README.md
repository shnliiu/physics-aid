# Physics Study Hub

A free, AI-powered study platform for thermodynamics and heat physics with interactive learning tools.

## Features

- **Chapter Summaries**: Comprehensive thermodynamics content
- **Formula Reference**: 20+ essential physics formulas
- **Practice Problems**: Step-by-step solutions
- **Interactive Flashcards**: Quick review cards
- **AI Tutor**: Powered by Google Gemini Pro

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys:
   - `GOOGLE_API_KEY`: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

3. **Run the development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to start learning.

## Tech Stack

- Next.js 15.5.0
- Material-UI
- Supabase (Database & Auth)
- Google Gemini Pro (AI)
- TypeScript

## Getting API Keys

### Google Gemini Pro API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` as `GOOGLE_API_KEY`

### Supabase
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API to get your URL and anon key
4. Add them to your `.env.local`

## Deployment

Ready for free deployment on Vercel or Netlify. Make sure to add your environment variables in the deployment settings.

## Contributing

Edit `/src/data/physicsContent.ts` to add more content.

## License

Educational use - Built for students, by students.
