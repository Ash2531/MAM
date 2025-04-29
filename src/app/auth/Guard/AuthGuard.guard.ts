import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MockKeycloakService } from '../mock-keycloak.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private keycloakService: MockKeycloakService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (this.keycloakService.isAuthenticated()) {
      return true;
    }

    await this.keycloakService.getKeycloakInstance().login({
      redirectUri: window.location.origin + state.url
    });
    return false;
  }
}