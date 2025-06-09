import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { ShakaPlayerComponent } from './shaka-player/shaka-player.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthCallbackComponent } from './auth/auth-callback.component';
import { LogoutComponent } from './components/logout/logout.component';
import { authGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LogoutComponent,
    canActivate: [() => !inject(AuthService).isAuthenticated()]
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },  {
    path: 'player',
    component: ShakaPlayerComponent,
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard]
  }
];
