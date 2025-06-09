import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        @if (isLogoutPage) {
          <mat-icon class="text-6xl mb-4 text-gray-400">logout</mat-icon>
          <h2 class="text-2xl font-semibold mb-2">Successfully Logged Out</h2>
          <p class="text-gray-600 mb-6">Thank you for using our application</p>
        } @else {
          <mat-icon class="text-6xl mb-4 text-blue-400">login</mat-icon>
          <h2 class="text-2xl font-semibold mb-2">Welcome Back</h2>
          <p class="text-gray-600 mb-6">Please log in to continue</p>
        }
        <button mat-raised-button color="primary" (click)="login()">
          <mat-icon class="mr-2">login</mat-icon>
          {{ isLogoutPage ? 'Login Again' : 'Login' }}
        </button>
      </div>
    </div>
  `
})
export class LogoutComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  get isLogoutPage() {
    return this.router.url === '/logout';
  }

  login() {
    this.authService.login();
  }
}
