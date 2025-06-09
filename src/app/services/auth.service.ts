import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, firstValueFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as jose from 'jose';
import { environment } from '../../environments/environment';

export interface UserProfile {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  email_verified?: boolean;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);

  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  public user$ = this.userSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor() {
    // Check for existing token on startup
    const token = localStorage.getItem('access_token');
    if (token) {
      this.validateAndSetToken(token);
    }
  }

  private async generatePkceChallenge(): Promise<{ codeVerifier: string; codeChallenge: string }> {
    const codeVerifier = this.generateRandomString(128);
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    
    // Check if we're in a test environment
    if (typeof window === 'undefined' || !window.crypto?.subtle) {
      // Mock implementation for testing
      const codeChallenge = btoa(codeVerifier).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return { codeVerifier, codeChallenge };
    }
    
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return { codeVerifier, codeChallenge };
  }

  private generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async login() {
    // Store the current URL to redirect back after login
    localStorage.setItem('return_url', this.router.url);

    // Generate PKCE challenge
    const { codeVerifier, codeChallenge } = await this.generatePkceChallenge();
    localStorage.setItem('code_verifier', codeVerifier);

    // Redirect to Keycloak login
    const loginUrl = environment.keycloak.authEndpoint;
    const params = new URLSearchParams({
      client_id: environment.keycloak.clientId,
      redirect_uri: environment.keycloak.redirectUri,
      response_type: environment.keycloak.responseType,
      scope: environment.keycloak.scope,
      code_challenge: codeChallenge,
      code_challenge_method: environment.keycloak.pkceMethod
    });

    window.location.href = `${loginUrl}?${params.toString()}`;
  }

  async handleAuthCallback(code: string, state: string | null | undefined): Promise<boolean> {
    const tokenUrl = environment.keycloak.tokenEndpoint;
    const codeVerifier = localStorage.getItem('code_verifier');
    if (!codeVerifier) {
      throw new Error('No code verifier found');
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: environment.keycloak.clientId,
      redirect_uri: environment.keycloak.redirectUri,
      code,
      code_verifier: codeVerifier
    });

    // Clean up code verifier
    localStorage.removeItem('code_verifier');

    try {
      interface TokenResponse {
        access_token: string;
        refresh_token?: string;
        id_token?: string;
        token_type: string;
        expires_in: number;
      }

      const response = await firstValueFrom(this.http.post<TokenResponse>(tokenUrl, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }));

      if (response?.access_token) {
        // Store all tokens
        localStorage.setItem('access_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        }
        if (response.id_token) {
          localStorage.setItem('id_token', response.id_token);
        }

        await this.validateAndSetToken(response.access_token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      return false;
    }
  }

  private async validateAndSetToken(token: string) {
    try {
      const decodedToken = await this.decodeToken(token);
      this.tokenSubject.next(token);
      this.userSubject.next(decodedToken as UserProfile);
      localStorage.setItem('access_token', token);
    } catch (error) {
      console.error('Invalid token:', error);
      this.logout();
    }
  }

  private async decodeToken(token: string): Promise<unknown> {
    return jose.decodeJwt(token);
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  async logout() {
    try {
      // Get the current tokens
      const refreshToken = localStorage.getItem('refresh_token');
      const idToken = localStorage.getItem('id_token');
      const accessToken = localStorage.getItem('access_token');

      // First, try to revoke the tokens if we have them
      if (accessToken || refreshToken) {
        try {
          // Revoke access token
          if (accessToken) {
            await firstValueFrom(this.http.post(environment.keycloak.revocationEndpoint,
              new URLSearchParams({ token: accessToken, token_type_hint: 'access_token' }), {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }));
          }

          // Revoke refresh token
          if (refreshToken) {
            await firstValueFrom(this.http.post(environment.keycloak.revocationEndpoint,
              new URLSearchParams({ token: refreshToken, token_type_hint: 'refresh_token' }), {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }));
          }
        } catch (revokeError) {
          console.warn('Token revocation failed:', revokeError);
        }
      }

      // Clear all local storage tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('return_url');
      localStorage.removeItem('code_verifier');

      // Clear the subjects
      this.tokenSubject.next(null);
      this.userSubject.next(null);

      // Construct logout URL with basic parameters
      const logoutUrl = environment.keycloak.endSessionEndpoint;
      const params = new URLSearchParams({
        client_id: environment.keycloak.clientId,
        post_logout_redirect_uri: `${window.location.origin}/logout`,
        redirect_uri: `${window.location.origin}/logout`
      });

      // Redirect to Keycloak end session endpoint
      window.location.href = `${logoutUrl}?${params.toString()}`;
    } catch (error) {
      console.error('Logout error:', error);
      // If something goes wrong, at least clear the local state
      localStorage.clear();
      this.tokenSubject.next(null);
      this.userSubject.next(null);
      this.router.navigate(['/logout']);
    }
  }
}
