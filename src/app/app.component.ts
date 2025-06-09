import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { LanguageService } from './services/language.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { LibraryVersionsDialog } from './library-versions/library-versions.dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule,
    TranslateModule,
    MatDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('sidenav') sidenav?: MatSidenav;

  private authService = inject(AuthService);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  isSidenavInitialized = false;
  user$ = this.authService.user$;
  currentLang = this.languageService.getCurrentLang();
  activeMenu = 'Dashboard';

  constructor(private dialog: MatDialog) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const path = this.router.url.split('/')[1];
      this.activeMenu = path.charAt(0).toUpperCase() + path.slice(1) || 'Dashboard';
    });

    // Subscribe to language changes
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  ngAfterViewInit() {
    if (this.sidenav) {
      this.isSidenavInitialized = true;
    }
  }

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  setLanguage(lang: 'en' | 'fr') {
    this.languageService.setLanguage(lang);
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  openLibraryDialog(): void {
    this.dialog.open(LibraryVersionsDialog, {
      width: '600px',
      panelClass: 'library-versions-dialog'
    });
  }
}
