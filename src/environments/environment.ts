
// src/environments/environment.ts
export const environment = {
  production: false,
  keycloak: {
    url: 'http://localhost:8080', // Mock server
    realm: 'my-realm',
    clientId: 'my-angular-app',
  },
};
