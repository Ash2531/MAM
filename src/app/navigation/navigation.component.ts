/* eslint-env browser */
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MockKeycloakService } from '../auth/mock-keycloak.service';

interface MenuItem {
  label: string;
  route: string;
}
/**
 *
 */
@Component({
  selector: 'app-navigation',
  standalone: false,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  menuItems: MenuItem[] = [];
  username: string = 'User';
  email: string = 'Email';
  selectedOption : string = 'en';
  /**
   *
   * @param translate
   * @param keycloakService
   */
  constructor(private translate: TranslateService,private keycloakService: MockKeycloakService) {
    this.translate.setDefaultLang('en');
    this.menuItems = [
      { label:  'Tiles-More ', route: '/tiles-more' },
      { label: 'Nav Menu Check ', route: '/dashboard' },
      { label: ' Nav 1', route: '/dashboard' },
      { label: 'Nav 2', route: '/dashboard' },
    ];
  }
  /**
   *@returns fteches the user profile from the Keycloak service and sets the username and email properties.
   */
  async ngOnInit() : Promise<void>  {
    const profile = await this.keycloakService.getUserProfile();
    this.username = profile?.username || 'User';
    this.email = profile?.email || 'Email';
    console.log('User Profile:', profile);

    if(localStorage.getItem('language')){

      this.selectedOption = localStorage.getItem('language') || 'en';
      this.translate.use(this.selectedOption);
    }
    else{
      this.translate.setDefaultLang('en');
      localStorage.setItem('language','en');
    }
  }



  /**
   *@returns void
   */
  logout():void {
    this.keycloakService.logout();
  }
  // Method to switch languages
  /**
   *
   * @param language
   * @returns void
   */
  switchLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem('language',language);
    this.selectedOption = language;
  }

}
