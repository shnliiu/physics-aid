import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== Physics 4C TA - Collaborative Physics Learning Platform ===========
Data schema for Physics 4C TA - a single-class collaborative platform for
physics students to share problems, formulas, and wiki notes across 3 volumes.
=========================================================================*/

const schema = a.schema({
  // ============ ENUMS ============
  Volume: a.enum(['VOL1', 'VOL2', 'VOL3']),

  Role: a.enum(['STUDENT', 'TEACHER']),

  ProblemStatus: a.enum(['NEED_HELP', 'IN_PROGRESS', 'SOLVED']),

  // ============ USER MODEL ============
  User: a
    .model({
      email: a.string().required(),
      name: a.string(),
      role: a.ref('Role').required(),
      profileImage: a.string(),
      posts: a.hasMany('ProblemPost', 'authorId'),
      comments: a.hasMany('Comment', 'authorId'),
      wikiEdits: a.hasMany('WikiEdit', 'authorId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  // ============ CHAPTER MODEL ============
  Chapter: a
    .model({
      volume: a.ref('Volume').required(),
      number: a.integer().required(),
      title: a.string().required(),
      description: a.string(),
      // Cross-reference for Vol 3 Ch 3-4 → Vol 1 Ch 16
      relatedChapterId: a.string(),
      formulas: a.hasMany('Formula', 'chapterId'),
      problems: a.hasMany('ProblemPost', 'chapterId'),
      wikiPage: a.hasOne('WikiPage', 'chapterId'),
    })
    .authorization((allow) => [allow.authenticated().to(['read'])]),

  // ============ FORMULA MODEL ============
  Formula: a
    .model({
      chapterId: a.string().required(),
      chapter: a.belongsTo('Chapter', 'chapterId'),
      title: a.string().required(),
      latex: a.string().required(),
      description: a.string(),
      tags: a.string().array(),
      // Scraped from OpenStax
      isScraped: a.boolean().default(false),
      sourceUrl: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read', 'create', 'update']),
    ]),

  // ============ PROBLEM POST MODEL ============
  ProblemPost: a
    .model({
      chapterId: a.string().required(),
      chapter: a.belongsTo('Chapter', 'chapterId'),
      title: a.string().required(),
      body: a.string().required(), // markdown
      attachments: a.string().array(), // file URLs
      canvasJson: a.json(), // Fabric.js state
      status: a.ref('ProblemStatus').required(),
      difficulty: a.integer(), // 1-5
      tags: a.string().array(),
      authorId: a.string().required(),
      author: a.belongsTo('User', 'authorId'),
      comments: a.hasMany('Comment', 'postId'),
      // AI verification
      aiVerified: a.boolean().default(false),
      aiVerificationNote: a.string(),
      // Teacher featured
      featured: a.boolean().default(false),
      featuredAt: a.datetime(),
    })
    .secondaryIndexes((index) => [
      index('chapterId'),
      index('authorId'),
      index('status'),
    ])
    .authorization((allow) => [
      allow.authenticated().to(['read', 'update']), // Teachers can feature
      allow.owner().to(['create', 'update', 'delete']),
    ]),

  // ============ COMMENT MODEL ============
  Comment: a
    .model({
      postId: a.string().required(),
      post: a.belongsTo('ProblemPost', 'postId'),
      authorId: a.string().required(),
      author: a.belongsTo('User', 'authorId'),
      body: a.string().required(),
      canvasJson: a.json(), // Optional canvas per comment
      // AI verification for answers
      aiVerified: a.boolean().default(false),
      aiVerificationNote: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'update', 'delete']),
    ]),

  // ============ WIKI PAGE MODEL ============
  WikiPage: a
    .model({
      chapterId: a.string().required(),
      chapter: a.belongsTo('Chapter', 'chapterId'),
      content: a.string().required(), // markdown with KaTeX
      edits: a.hasMany('WikiEdit', 'pageId'),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read', 'create', 'update']),
    ]),

  // ============ WIKI EDIT (VERSION HISTORY) ============
  WikiEdit: a
    .model({
      pageId: a.string().required(),
      page: a.belongsTo('WikiPage', 'pageId'),
      authorId: a.string().required(),
      author: a.belongsTo('User', 'authorId'),
      diff: a.string().required(), // unified diff or full snapshot
      summary: a.string(), // edit summary
    })
    .authorization((allow) => [allow.authenticated().to(['read', 'create'])]),

  // ============ CUSTOM TYPES ============
  AIVerificationResult: a.customType({
    isCorrect: a.boolean().required(),
    confidence: a.float(), // 0.0 - 1.0
    explanation: a.string(),
    suggestedImprovements: a.string().array(),
  }),

  FormulaSearchResult: a.customType({
    formulaId: a.string().required(),
    title: a.string().required(),
    latex: a.string().required(),
    chapterId: a.string().required(),
    relevanceScore: a.float(),
  }),

  // ============ CUSTOM OPERATIONS ============

  // AI verification for problem solutions using RAG
  verifyProblemSolution: a
    .mutation()
    .arguments({
      problemId: a.string().required(),
      solution: a.string().required(),
      canvasJson: a.json(),
    })
    .returns(a.ref('AIVerificationResult'))
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.function('verifyProblemSolution')
    ),

  // Search formulas by chapter or keyword (for RAG context)
  searchFormulas: a
    .query()
    .arguments({
      chapterId: a.string(),
      keyword: a.string(),
      limit: a.integer(),
    })
    .returns(a.ref('FormulaSearchResult').array())
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.function('searchFormulas')
    ),

  // Get featured problems for the class
  getFeaturedProblems: a
    .query()
    .arguments({
      limit: a.integer(),
    })
    .returns(a.ref('ProblemPost').array())
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.function('getFeaturedProblems')
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
