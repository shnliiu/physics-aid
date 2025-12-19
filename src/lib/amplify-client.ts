// Stub file to replace missing amplify-client
// This allows the app to build while transitioning to Supabase or when Amplify is removed.

export const client = {
    models: {
        ProblemPost: {
            get: async (args?: any) => ({ data: {} as any }),
            list: async (args?: any) => ({ data: [] as any[] }),
        },
        Comment: {
            list: async (args?: any) => ({ data: [] as any[] }),
            create: async (args?: any) => ({} as any),
        },
        User: {
            list: async (args?: any) => ({ data: [{ id: 'mock-auth-id' }] as any[] }),
        },
        Chapter: {
            list: async (args?: any) => ({ data: [] as any[] }),
        }
    },
    mutations: {
        verifyProblemSolution: async (args?: any) => ({ data: { isCorrect: false, explanation: "AI verification service unavailable" } as any }),
    }
};
