import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockKeycloakService } from '../auth/mock-keycloak.service';

@Component({
  selector: 'app-mock-auth-redirect',
  template: '<p>Redirecting...</p>'
})
export class MockAuthRedirectComponent implements OnInit {
  constructor(
    private keycloakService: MockKeycloakService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      await this.keycloakService.getKeycloakInstance().updateToken(30);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Token update failed', error);
      this.router.navigate(['/']);
    }
  }
}