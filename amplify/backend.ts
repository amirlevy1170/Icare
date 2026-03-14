import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { auth } from './auth/resource.ts';
import { data } from './data/resource.ts';
import { adminUserOps } from './functions/adminUserOps/resource.ts';

const backend = defineBackend({ auth, data, adminUserOps });

const { userPool } = backend.auth.resources;
const lambda = backend.adminUserOps.resources.lambda as LambdaFunction;

lambda.addEnvironment('USER_POOL_ID', userPool.userPoolId);

lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'cognito-idp:AdminCreateUser',
      'cognito-idp:AdminSetUserPassword',
      'cognito-idp:AdminDeleteUser',
    ],
    resources: [userPool.userPoolArn],
  }),
);
