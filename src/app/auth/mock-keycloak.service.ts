import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

import { environment } from 'src/environments/environment';

/**
 *
 */


interface UserProfile {
  username?: string;
  email?: string;
}
/**
 *
 */
@Injectable({
  providedIn: 'root',
})
export class MockKeycloakService {
  private keycloak: Keycloak;
  /**
   *
   */
  constructor( ) {
    this.keycloak = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId
    });
  }
  /**
   *@returns boolean
   */
  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
      });
      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed', error);
      return false;
    }
  }
  /**
   *@returns Keycloak instance
   */
  getKeycloakInstance(): Keycloak {
    return this.keycloak;
  }

  /**
   *@returns TokenResponse
   */
  async getToken(): Promise<string | undefined> {
    await this.keycloak.updateToken(30);
    return this.keycloak.token;
  }

  /**
   *
   */
  async logout(): Promise<void> {
    await this.keycloak.logout({ redirectUri: window.location.origin });
  }

  /**
   *@returns UserProfile
   */
  async getUserProfile(): Promise<UserProfile> {
    return await this.keycloak.loadUserProfile();
  }

  /**
   *@returns state check
   */
  isAuthenticated(): boolean {
    return !!this.keycloak.authenticated;
  }




}
