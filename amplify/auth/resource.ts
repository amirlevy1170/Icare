import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: { username: true },
  userAttributes: {
    'custom:role': { dataType: 'String', mutable: true },
  },
});
