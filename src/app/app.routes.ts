import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { ShakaPlayerComponent } from './shaka-player/shaka-player.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthCallbackComponent } from './auth/auth-callback.component';
import { LogoutComponent } from './components/logout/logout.component';
import { GraphqlDemoComponent } from './graphql-demo/graphql-demo.component';
import { authGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { SseEventsComponent } from './components/sse-events/sse-events.component';

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
  },
  {
    path: 'player',
    component: ShakaPlayerComponent,
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'graphql-demo',
    component: GraphqlDemoComponent,
    canActivate: [authGuard]
  },
   {
    path: 'graphql-sse',
    component: SseEventsComponent,
    canActivate: [authGuard]
  }
];
