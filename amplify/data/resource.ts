import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { adminUserOps } from '../functions/adminUserOps/resource';

const schema = a.schema({
  UserRecord: a
    .model({
      cognitoId: a.string().required(),
      name: a.string().required(),
      username: a.string().required(),
      role: a.string().required(),
    })
    .secondaryIndexes((index) => [index('username'), index('cognitoId')])
    .authorization((allow) => [allow.authenticated()]),

  Patient: a
    .model({
      fullName: a.string().required(),
      idNumber: a.string().required(),
      photoUrl: a.string().required(),
      group: a.string().required(),
      dateOfBirth: a.string().required(),
      gender: a.string().required(),
    })
    .secondaryIndexes((index) => [index('idNumber')])
    .authorization((allow) => [allow.authenticated()]),

  PatientWidget: a
    .model({
      patientId: a.string().required(),
      widgetType: a.string().required(),
      value: a.string().required(),
      lastUpdated: a.string().required(),
      updatedBy: a.string().required(),
    })
    .secondaryIndexes((index) => [index('patientId')])
    .authorization((allow) => [allow.authenticated()]),

  WidgetPermission: a
    .model({
      widgetType: a.string().required(),
      rolesAllowedToEdit: a.string().array().required(),
    })
    .secondaryIndexes((index) => [index('widgetType')])
    .authorization((allow) => [allow.authenticated()]),

  WidgetConfig: a
    .model({
      widgetType: a.string().required(),
      inputType: a.string().required(),
      options: a.string().array().required(),
    })
    .secondaryIndexes((index) => [index('widgetType')])
    .authorization((allow) => [allow.authenticated()]),

  AuditLogEntry: a
    .model({
      userId: a.string().required(),
      patientId: a.string().required(),
      widgetType: a.string().required(),
      oldValue: a.string().required(),
      newValue: a.string().required(),
      timestamp: a.string().required(),
    })
    .secondaryIndexes((index) => [index('patientId')])
    // Audit log is append-only: deny update/delete to prevent history tampering
    .authorization((allow) => [allow.authenticated().to(['create', 'read'])]),

  RoleDefinition: a
    .model({
      roleId: a.string().required(),
      label: a.string().required(),
      isBuiltIn: a.boolean().required(),
    })
    .secondaryIndexes((index) => [index('roleId')])
    .authorization((allow) => [allow.authenticated()]),

  userAdminCreate: a
    .mutation()
    .arguments({
      username: a.string().required(),
      password: a.string().required(),
      role: a.string().required(),
    })
    .returns(a.string().required())
    .handler(a.handler.function(adminUserOps))
    .authorization((allow) => [allow.authenticated()]),

  userAdminSetPassword: a
    .mutation()
    .arguments({
      username: a.string().required(),
      password: a.string().required(),
    })
    .returns(a.string().required())
    .handler(a.handler.function(adminUserOps))
    .authorization((allow) => [allow.authenticated()]),

  userAdminDelete: a
    .mutation()
    .arguments({
      username: a.string().required(),
    })
    .returns(a.string().required())
    .handler(a.handler.function(adminUserOps))
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
