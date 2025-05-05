import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MockKeycloakService } from '../auth/mock-keycloak.service';

interface MenuItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  menuItems: MenuItem[] = [];
  username: string = 'User';
  email: string = 'Email';
  isMobileMenuOpen = false;
  constructor(private translate: TranslateService,private keycloakService: MockKeycloakService) {
    this.translate.setDefaultLang('en');
    this.menuItems = [
      { label: 'Procedure List', route: '/procedure-list' },
      { label: 'Procedure Tiles', route: '/procedure-tiles' },
      { label: 'Search Controls', route: '/search-controls' },
      { label:  'Tiles-More ', route: '/tiles-more' },
    ];
  }
  async ngOnInit()   {
    const profile = await this.keycloakService.getUserProfile();
    this.username = profile?.username || 'User';
    this.email = profile?.email || 'Email';
    console.log('User Profile:', profile);

   }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.keycloakService.logout();
}
  // Method to switch languages
  switchLanguage(language: string) {
    this.translate.use(language);
    }

}
