export const MOCK_KEYCLOAK_CONFIG = {
  realm: 'Baxter-MAM',
  clientId: 'Baxter-Client-ID',
  redirectUri: 'http://localhost:4200',
  endpoints: {
    auth: '/realms/mam/protocol/openid-connect/auth',
    token: '/realms/mam/protocol/openid-connect/token',
    logout: '/realms/mam/protocol/openid-connect/logout'
  }
};
