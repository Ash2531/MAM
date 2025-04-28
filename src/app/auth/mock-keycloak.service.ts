import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MOCK_KEYCLOAK_CONFIG } from './keycloak.constants';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockKeycloakService {
  constructor(private router: Router) {}


  initiateLogin(): void {                       //I1C-1669 Start login flow trying to access protected resource.
    const params = new URLSearchParams({
      client_id: MOCK_KEYCLOAK_CONFIG.clientId,
      response_type: 'code',
      redirect_uri: MOCK_KEYCLOAK_CONFIG.redirectUri,
    });
    const mockAuthUrl = `/mock-auth-redirect?${params.toString()}&code=mock-auth-code`;
    console.log('Redirecting to mock login:', mockAuthUrl);
    this.router.navigateByUrl(mockAuthUrl);     //I1C-1716 Successful login mock-Auth-redirect
  }
  logout(): void {               // I1C-852 Logout and expiration token.
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id_token');
    sessionStorage.clear(); //Clearing all session storage
    console.log('User logged out. Tokens cleared.');
    this.router.navigate(['/logout']);
  }



  loadUserProfile(): Observable<any> {
    return of({
      sub: '1',
      preferred_username: 'testuser',
      email: 'testuser@example.com',
      roles: ['user'],
    });
  }
}
