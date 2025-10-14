import { defineFunction } from '@aws-amplify/backend';

export const verifyProblemSolution = defineFunction({
  name: 'verifyProblemSolution',
  entry: './handler.ts',
  resourceGroupName: 'data',
  environment: {
    CHINCHILLA_API_URL: 'https://claude.chinchilla-ai.com',
  },
  timeoutSeconds: 60, // AI verification may take longer
});
