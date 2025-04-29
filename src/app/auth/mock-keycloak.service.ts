import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MockKeycloakService {
  private keycloak: Keycloak;
  constructor( ) {
    this.keycloak = new Keycloak({
      url: environment.keycloak.url, // e.g., 'http://localhost:8080'
      realm: environment.keycloak.realm, // e.g., 'your-realm'
      clientId: environment.keycloak.clientId // e.g., 'your-client-id'
    });
  }
  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required', // or 'check-sso' for silent authentication
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
      });
      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed', error);
      return false;
    }
  }
  getKeycloakInstance(): Keycloak {
    return this.keycloak;
  }

  async getToken(): Promise<string | undefined> {
    await this.keycloak.updateToken(30); // Refresh token if expiring within 30 seconds
    return this.keycloak.token;
  }

  async logout(): Promise<void> {
    await this.keycloak.logout({ redirectUri: window.location.origin });
  }

  async getUserProfile(): Promise<any> {
    return await this.keycloak.loadUserProfile();
  }

  isAuthenticated(): boolean {
    return !!this.keycloak.authenticated;
  }




}
