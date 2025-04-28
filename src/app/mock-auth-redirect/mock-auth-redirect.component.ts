import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MOCK_KEYCLOAK_CONFIG } from '../auth/keycloak.constants';

@Component({
  selector: 'app-mock-auth-redirect',
  templateUrl: './mock-auth-redirect.component.html',
  styleUrls: ['./mock-auth-redirect.component.scss'],
})
export class MockAuthRedirectComponent implements OnInit {
  redirectUri = MOCK_KEYCLOAK_CONFIG.redirectUri;
  clientId = MOCK_KEYCLOAK_CONFIG.clientId;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code === 'mock-auth-code') {
        debugger;
        this.http
          .post<any>(`http://localhost:3000${MOCK_KEYCLOAK_CONFIG.endpoints.token}`, {
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.redirectUri,
            client_id: this.clientId,
          })
          .subscribe({
            next: (res) => {
              console.log('Mock token received', res);
              localStorage.setItem('access_token', res.access_token);
              localStorage.setItem('refresh_token', res.refresh_token);
              localStorage.setItem('id_token', res.id_token);
              setTimeout(() => {
                this.router.navigate(['/dashboard']);
              }, 1000);
            },
            error: (err) => {
              console.error('Token exchange failed', err);
              this.router.navigate(['/logout']);
            },
          });
      } else {
        console.error('Invalid authorization code');
        this.router.navigate(['/']);
      }
    });
  }
}

