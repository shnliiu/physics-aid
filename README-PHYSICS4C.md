# Physics 4C TA

A collaborative physics learning platform with AI verification for Physics 4C students.

## 🚀 Features

### ✅ Implemented (Priority Order)

1. **AI Chat with RAG**
   - Chinchilla AI integration with Retrieval Augmented Generation
   - Uses scraped formulas as context for accurate answers
   - LaTeX and KaTeX rendering support
   - Chapter-scoped or general physics questions

2. **OpenStax Content Scraper**
   - **Critical filtering rules:**
     - Volume 1: ALL chapters imported
     - Volume 2: Chapters 1-4 ONLY
     - Volume 3: Chapters 1-4 ONLY
   - Formula deduplication
   - Rate limiting and robots.txt compliance
   - Dry-run mode for testing

3. **Chapter/Volume Organization**
   - 3 volume tabs (Vol 1: Mechanics, Vol 2: Thermodynamics, Vol 3: Modern Physics)
   - Chapter pages with 4 tabs: Formulas, Problems, Wiki, Chat
   - LaTeX formula rendering
   - Cross-volume linking (Vol 3 Ch 3-4 ↔ Vol 1 Ch 16)

4. **Teacher Admin Panel**
   - Feature/unfeature problems for homepage showcase
   - Upload new problems
   - View all problems with status
   - Teacher-only access control

5. **Problem Management**
   - Post problems (text, images, files)
   - AI verification via RAG
   - Status tracking: NEED_HELP, IN_PROGRESS, SOLVED
   - Difficulty rating (1-5)
   - Tags and search

## 🏗️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** AWS Amplify Gen 2 (Data, Auth, Functions, Storage)
- **Database:** DynamoDB (via Amplify)
- **Auth:** Cognito User Pools (via Amplify)
- **AI:** Chinchilla AI API (Claude integration)
- **LaTeX:** KaTeX, react-katex, remark-math
- **Scraping:** Cheerio, Node fetch

## 📁 Project Structure

```
physics-aid/
├── amplify/
│   ├── backend.ts                    # Backend configuration
│   ├── auth/                         # Cognito auth config
│   ├── data/
│   │   └── resource.ts              # Data schema (models, custom operations)
│   ├── functions/
│   │   ├── verifyProblemSolution/   # AI verification Lambda
│   │   ├── searchFormulas/          # Formula search Lambda
│   │   └── getFeaturedProblems/     # Featured problems Lambda
│   └── storage/                      # S3 file storage config
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Homepage with featured problems
│   │   ├── vol/[vol]/
│   │   │   ├── page.tsx            # Volume chapters list
│   │   │   └── ch/[number]/
│   │   │       └── page.tsx        # Chapter detail (formulas/problems/wiki/chat)
│   │   ├── problems/
│   │   │   ├── new/page.tsx        # Post new problem
│   │   │   └── [id]/page.tsx       # Problem detail with AI verification
│   │   ├── admin/page.tsx          # Teacher admin panel
│   │   └── api/
│   │       └── ask-physics/route.ts # AI chat API with RAG
│   ├── components/
│   │   ├── VolumeTabs.tsx          # Volume navigation tabs
│   │   └── AIChat.tsx              # AI chat component
│   └── lib/
│       └── amplify-client.ts        # Amplify client utility
├── scripts/
│   └── scrape-openstax.ts          # OpenStax content scraper
└── package.json
```

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Amplify Sandbox

This deploys your backend (DynamoDB, Cognito, Lambdas, S3):

```bash
npx ampx sandbox --stream-function-logs
```

Wait 2-3 minutes for first deployment. The sandbox will auto-deploy on code changes.

### 3. Start Next.js Dev Server

```bash
npm run dev -- -p 3000
```

App will be available at http://localhost:3000

### 4. Run the Scraper (Optional)

First, test with dry-run:

```bash
npm run scrape:dry
```

Then run the actual scrape:

```bash
npm run scrape
```

This will import:
- Volume 1: ALL chapters
- Volume 2: Chapters 1-4 only
- Volume 3: Chapters 1-4 only

## 🔑 Environment Variables

Create a `.env.local` file:

```bash
# Amplify auto-populates these during sandbox
# No manual configuration needed

# Optional: Custom scraping URLs
SCRAPE_VOL1_URL=https://openstax.org/books/university-physics-volume-1/pages/
SCRAPE_VOL2_URL=https://openstax.org/books/university-physics-volume-2/pages/
SCRAPE_VOL3_URL=https://openstax.org/books/university-physics-volume-3/pages/
```

## 📊 Data Model

### Core Models

- **User** - Student or Teacher role
- **Chapter** - Organized by Volume (VOL1, VOL2, VOL3) and number
- **Formula** - LaTeX formulas with descriptions and tags
- **ProblemPost** - Student problems with AI verification, status, difficulty
- **Comment** - Threaded discussions on problems
- **WikiPage** - Collaborative chapter notes
- **WikiEdit** - Version history for wikis

### Custom Operations (Lambda-backed)

- `verifyProblemSolution` - AI verification using Chinchilla API + RAG
- `searchFormulas` - Keyword search for formula context
- `getFeaturedProblems` - Teacher-curated problem showcase

## 🎯 Usage

### For Students

1. **Browse chapters** - Navigate by volume → chapter
2. **View formulas** - See LaTeX-rendered formulas with descriptions
3. **Ask AI** - Get help from AI tutor with chapter context
4. **Post problems** - Share solved problems or ask for help
5. **Get AI verification** - Check if your solution is correct

### For Teachers

1. **Access admin panel** - Visit `/admin` (requires TEACHER role)
2. **Feature problems** - Highlight best problems for students
3. **Upload problems** - Add practice problems or examples
4. **Monitor activity** - See all problems, statuses, AI verifications

## 🤖 AI Verification (RAG)

When a student posts a solution:

1. **Formula Retrieval**: System fetches relevant formulas from the chapter
2. **Context Building**: Formulas + problem description sent to Chinchilla AI
3. **Verification**: Claude analyzes correctness using physics principles
4. **Feedback**: Returns verdict (✓/✗), confidence score, and explanation

## 🔗 Cross-Volume Linking

**Volume 3, Chapters 3-4** (waves topics) automatically show a banner linking to **Volume 1, Chapter 16** (waves fundamentals) since they cover related content.

## 📝 Development Commands

```bash
# Development
npm run dev              # Start Next.js (port 3000)
npx ampx sandbox         # Start Amplify backend

# Scraping
npm run scrape:dry       # Preview scraping (no import)
npm run scrape           # Actually scrape and import

# Build
npm run build           # Production build
npm run start           # Production server
```

## 🚧 Not Yet Implemented

- **Socket.io real-time** - Live comments, presence, canvas sync
- **Fabric.js canvas** - Drawing/annotation on problems
- **Sticky notes** - Visual annotations
- **Wiki editing** - Rich editor for collaborative notes
- **E2E tests** - Playwright test suite
- **Seed script** - Demo data generator

## 🔐 Authentication

- Email + password authentication via AWS Cognito
- Teacher role must be manually set in DynamoDB User table (role: "TEACHER")
- Default role: "STUDENT"

## 🌟 Key Features Highlight

### 1. AI Accuracy (Priority #1)
✅ RAG system retrieves formulas from database before asking AI
✅ Chinchilla API integration with physics-specific prompts
✅ LaTeX rendering for math expressions
✅ Chapter-scoped context for targeted help

### 2. Proper Scraping (Priority #2)
✅ Volume-specific filtering (Vol 1: all, Vol 2-3: Ch 1-4 only)
✅ Formula deduplication by content hash
✅ Rate limiting (1 req/sec)
✅ Dry-run mode for testing

### 3. Organization (Priority #3)
✅ 3 volumes with chapter navigation
✅ Formulas tab with LaTeX rendering
✅ Problems tab with filters
✅ Wiki tab (ready for content)
✅ AI Chat tab per chapter
✅ Cross-volume linking (Vol 3 Ch 3-4 ↔ Vol 1 Ch 16)

### 4. Admin Features (Priority #4)
✅ Teacher can feature problems
✅ Teacher can upload problems
✅ Featured problems show on homepage
✅ Role-based access control

## 📞 Support

For issues or questions, see the examples folder for Amplify Gen 2 patterns and best practices.

---

Built with ❤️ for Physics 4C students
