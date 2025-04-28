import { Component } from '@angular/core';


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

  isMobileMenuOpen = false;
  constructor() {
    this.menuItems = [
      { label: 'Procedure List', route: '/procedure-list' },
      { label: 'Procedure Tiles', route: '/procedure-tiles' },
      { label: 'Search Controls', route: '/search-controls' },
      { label:  'Tiles-More ', route: '/tiles-more' },
    ];
  }
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }




}
