import { defineFunction } from '@aws-amplify/backend';

export const searchFormulas = defineFunction({
  name: 'searchFormulas',
  entry: './handler.ts',
  resourceGroupName: 'data',
  timeoutSeconds: 15,
});
