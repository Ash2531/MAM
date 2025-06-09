import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      @if (!error) {
        <div class="text-center">
          <mat-spinner diameter="48" class="mx-auto mb-4"></mat-spinner>
          <p class="text-gray-600">Completing login, please wait...</p>
        </div>
      } @else {
        <div class="text-center text-red-600">
          <mat-icon class="text-6xl mb-4">error_outline</mat-icon>
          <p class="text-lg font-medium mb-2">Authentication Error</p>
          <p class="text-gray-600 mb-4">{{error}}</p>
          <button
            (click)="retryLogin()"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      }
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  error: string | null = null;

  ngOnInit() {
    this.handleCallback();
  }

  private async handleCallback() {
    try {
      const params = this.route.snapshot.queryParams;
      const code = params['code'];
      const state = params['state'];

      if (!code) {
        throw new Error('No authorization code received');
      }

      // Use firstValueFrom to handle queryParams
      const success = await this.authService.handleAuthCallback(code, state);
      if (success) {
        // Always redirect to dashboard after successful login
        await this.router.navigateByUrl('/dashboard');
      } else {
        throw new Error('Failed to process login');
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Auth callback error:', err);
    }
  }

  retryLogin() {
    this.authService.login();
  }
}
