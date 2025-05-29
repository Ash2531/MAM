import { Injectable } from '@angular/core';
import { fromUnixTime, isAfter } from 'date-fns';
import { decodeJwt } from 'jose';
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
  private token: string | null = null;
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
  init(): Promise<void> {
    return this.keycloak
      .init({ onLoad: 'login-required' })
      .then((authenticated) => {
        if (authenticated) {
          debugger;
          this.token = this.keycloak.token ?? null;
          console.log('Authenticated');
          this.handleToken(this.token);
        } else {
          // eslint-disable-next-line no-console
          console.warn('Not authenticated');
        }
      })
      .catch((err) => console.error('Keycloak init failed', err));
  }

  /**
   *
   * @param token
   */
  private handleToken(token: string | null): void {
    if (!token) {return;}
    try {
      const decoded = decodeJwt(token);
      const expTime = fromUnixTime(decoded.exp || 0);
      console.log('Token expires at:', expTime);
      const isTokenExpired = isAfter(new Date(), expTime);
      if (isTokenExpired) {
        // eslint-disable-next-line no-console
        console.warn('Token has expired!');
      } else {
        console.log('Token is valid');
      }
    } catch (error) {
      console.error('Failed to decode token', error);
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
    return this.token ?? undefined;
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
export const keycloakService = new MockKeycloakService();
