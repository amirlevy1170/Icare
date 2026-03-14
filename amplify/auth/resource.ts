import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: { username: true, email: false },
  userAttributes: {
    'custom:role': { dataType: 'String', mutable: true },
  },
});
