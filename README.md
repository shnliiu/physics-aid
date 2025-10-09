# 🎓 Physics Study Hub

A free, community-driven study platform for thermodynamics and heat physics, featuring OpenStax University Physics textbook content, practice problems, formula references, and interactive flashcards.

## 🌟 Features

### 📚 Chapter Summaries
- Comprehensive summaries of Heat & Thermodynamics chapters
- Key concepts and learning objectives
- Topic breakdowns for each chapter
- Based on OpenStax University Physics Volume 2

### 🧮 Formula Reference
- 20+ essential thermodynamics formulas
- Variable definitions and units
- Use cases and descriptions
- Organized by topic

### 💪 Practice Problems
- 9+ physics problems with full solutions
- Difficulty levels: Easy, Medium, Hard
- Step-by-step solution explanations
- Topics: Heat Transfer, Kinetic Theory, Thermodynamic Processes

### 🎴 Interactive Flashcards
- Quick-review flashcards
- Front/back flip interaction
- Navigation through card deck
- Perfect for exam preparation

### 🔍 Search & Filter (Coming Soon)
- Search across chapters, formulas, and concepts
- Filter practice problems by difficulty
- Quick topic lookup

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:3000/tutor` to access the Physics Study Hub.

### Adding Content

All physics content is centralized in `/src/data/physicsContent.ts`:

```typescript
// Add a new chapter
export const chapters: Chapter[] = [
  {
    id: 5,
    title: "Your New Chapter",
    topics: ["Topic 1", "Topic 2"],
    summary: "Chapter summary...",
    keyFormulas: [...],
    concepts: [...]
  }
];

// Add a practice problem
export const practiceProblems: PracticeProblem[] = [
  {
    id: 10,
    topic: "Thermodynamics",
    difficulty: "Medium",
    question: "Your problem...",
    solution: "Step-by-step solution...",
    answer: "Final answer"
  }
];

// Add a flashcard
export const flashcards: Flashcard[] = [
  {
    id: 6,
    topic: "Heat Transfer",
    front: "Question?",
    back: "Answer."
  }
];
```

## 📦 Deployment

This project is ready to deploy to free hosting platforms. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy (automatic configuration)
4. Share the URL with classmates

**Cost: $0.00/month** - Perfect for classroom use!

## 🎯 Project Goals

- ✅ 100% free for students (no costs, no logins required)
- ✅ Accurate physics content from trusted textbooks
- ✅ Community-driven (anyone can contribute)
- ✅ Mobile-friendly and accessible
- ✅ Fast and reliable

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.0
- **UI Library**: Material-UI (MUI)
- **Backend**: AWS Amplify Gen 2 (optional for future features)
- **Hosting**: Vercel / Netlify (free tier)
- **Authentication**: AWS Cognito (optional, not currently used)

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with MUI theme
│   ├── page.tsx                # Homepage
│   └── tutor/
│       └── page.tsx            # Physics Study Hub (main feature)
├── data/
│   └── physicsContent.ts       # All physics content (chapters, problems, flashcards)
├── components/
│   └── Layout/                 # Navigation and layout components
└── providers/
    ├── LayoutProvider.tsx      # Layout control
    └── AmplifyProvider.tsx     # Amplify configuration
```

## 🤝 Contributing

Want to add more content? Edit `/src/data/physicsContent.ts` and submit a pull request!

### Content Contribution Guidelines

1. **Chapters**: Add summaries, formulas, and concepts from OpenStax textbooks
2. **Practice Problems**: Include difficulty level, full solution, and final answer
3. **Flashcards**: Keep questions concise, answers clear
4. **Formulas**: Define all variables with units

## 📖 Content Sources

- OpenStax University Physics Volume 2 (Heat & Thermodynamics)
- Open-licensed educational content
- Community contributions

## 🔮 Future Features

- AI tutor powered by AWS Bedrock (optional, requires authentication)
- Community Q&A forum
- Formula sheet generator (printable PDFs)
- Progress tracking and quiz scores
- Custom study guides
- Spaced repetition for flashcards

## 📊 Current Statistics

- **4 Chapters** with full summaries
- **20+ Formulas** with variable definitions
- **9 Practice Problems** with step-by-step solutions
- **5 Flashcards** for quick review
- **100% Free** - No costs, no ads, no login required

## 📝 License

This project uses open educational resources and is intended for educational purposes.

## 🙏 Acknowledgments

- OpenStax for free, high-quality physics textbooks
- Material-UI for the component library
- AWS Amplify for backend infrastructure (optional)

---

**Built for classmates, by classmates** 🎓

Visit the deployed site: [Coming Soon - Deploy to get your URL!]

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
