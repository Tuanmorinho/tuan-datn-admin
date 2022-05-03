// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: 'v1.0.0',
  apiUrl: 'https://localhost:3333',
  domain: 'https://localhost:4200',
  KEYCLOAK_CLIENT_ID: 'auth-keycloak-testing',
  KEYCLOAK_REALM: 'testing-auth',
  KEYCLOAK_CLIENT_SECRET: 'ch9bkQNSJYaeb3nA0KBvZeWBUvVxUQai',
  APP_CLIENT: 'ch9bkQNSJYaeb3nA0KBvZeWBUvVxUQai',
  apiDevUrl: 'https://localhost:3333'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
