import { Component } from '@angular/core';
import { MockKeycloakService } from '../auth/mock-keycloak.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private keycloak: MockKeycloakService) {}
  login() {
    this.keycloak.initiateLogin();
  }

  logout() {
    this.keycloak.logout();
  }
  }


