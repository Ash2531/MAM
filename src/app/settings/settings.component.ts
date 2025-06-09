import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnDestroy {
  settings = {
    email: '',
    displayName: '',
    emailNotifications: true,
    darkMode: false,
    twoFactorAuth: false,
    publicProfile: true,
    onlineStatus: true
  };

  private userSubscription!: Subscription;

  constructor(private authService: AuthService) {
    this.subscribeToUserProfile();
  }

  private subscribeToUserProfile(): void {
    this.userSubscription = this.authService.user$.subscribe(profile => {
      if (profile) {
        console.log(profile);
        console.log("===")
        this.settings.email = profile?.email || '';
        this.settings.displayName = profile?.name || profile?.preferred_username || '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  saveSettings() {
    console.log('Settings saved:', this.settings);
  }
}
