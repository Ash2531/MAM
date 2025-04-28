
// src/environments/environment.ts
export const environment = {
  production: true,
  keycloak: {
    url: 'http://localhost:8080', // Real Keycloak server
    realm: 'Baxter-MAM',
    clientId: 'Baxter-Client-ID',
    useMock: false,
  },
};
