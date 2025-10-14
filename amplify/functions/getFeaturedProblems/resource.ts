import { defineFunction } from '@aws-amplify/backend';

export const getFeaturedProblems = defineFunction({
  name: 'getFeaturedProblems',
  entry: './handler.ts',
  resourceGroupName: 'data',
  timeoutSeconds: 15,
});
