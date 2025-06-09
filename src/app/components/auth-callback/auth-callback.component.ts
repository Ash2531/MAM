import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule, MatProgressSpinner],
  template: `
    <div class="flex items-center justify-center min-h-screen">
      <mat-spinner diameter="48"></mat-spinner>
      <p class="ml-4">Processing authentication...</p>
    </div>
  `,
  styles: []
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      // Handle the authorization code from Keycloak
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (!code) {
        throw new Error('No authorization code received');
      }

      // Exchange the code for tokens
      const success = await this.authService.handleAuthCallback(code, state);
      
      if (success) {
        // Redirect to the originally requested page or default to dashboard
        const returnUrl = localStorage.getItem('return_url') || '/dashboard';
        localStorage.removeItem('return_url');
        await this.router.navigate([returnUrl]);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // Redirect to home and trigger login again
      await this.router.navigate(['/']);
      this.authService.login();
    }
  }
}
