import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'physicsAidStorage',
  access: (allow) => ({
    'textbooks/*': [
      allow.guest.to(['read']),
    ],
  }),
});
