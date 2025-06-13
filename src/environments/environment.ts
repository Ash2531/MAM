export const environment = {
  production: false,
  keycloak: {
    // Your Keycloak server URL
    url: 'http://localhost:8080',
    realm: 'my-realm',
    clientId: 'my-client-id',
    // Redirect URI must match exactly what's configured in Keycloak client
    redirectUri: 'http://localhost:4200/auth/callback',
    // Additional Keycloak settings
    scope: 'openid profile email roles offline_access',
    responseType: 'code',
    // Full endpoint URLs from OpenID Configuration
    issuer: 'http://localhost:8080/realms/my-realm',
    authEndpoint: 'http://localhost:8080/realms/my-realm/protocol/openid-connect/auth',
    tokenEndpoint: 'http://localhost:8080/realms/my-realm/protocol/openid-connect/token',
    userinfoEndpoint: 'http://localhost:8080/realms/my-realm/protocol/openid-connect/userinfo',
    endSessionEndpoint: 'http://localhost:8080/realms/my-realm/protocol/openid-connect/logout',
    checkSessionIframe: 'http://localhost:8080/realms/my-realm/protocol/openid-connect/login-status-iframe.html',
    revocationEndpoint: 'http://localhost:8080/realms/my-realm/protocol/openid-connect/revoke',
    // PKCE is supported by the server
    usePkce: true,
    pkceMethod: 'S256',
    // Refresh token settings
    useRefreshToken: true,
    refreshTokenTimeSkew: 60
  },
    graphql: {
    endpoint: 'http://localhost:4000/graphql',
    sse: {
      enabled: true,
      endpoint: 'http://localhost:4000/sse',
      maxRetries: 5,
      reconnectInterval: 3000
    }
  }
};
