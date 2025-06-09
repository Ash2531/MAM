import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'fr';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<Language>('en');
  currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    // Set available languages
    translate.addLangs(['en', 'fr']);
    
    // Initialize translation with default language
    translate.setDefaultLang('en');
    
    // Try to get language from localStorage or use browser default
    const savedLang = localStorage.getItem('language') as Language;
    const browserLang = translate.getBrowserLang();
    const langToUse = savedLang || (browserLang?.match(/en|fr/) ? browserLang : 'en');
    
    this.setLanguage(langToUse as Language);
  }

  setLanguage(lang: Language) {
    if (this.translate.getLangs().includes(lang)) {
      this.translate.use(lang);
      this.currentLangSubject.next(lang);
      localStorage.setItem('language', lang);
    }
  }

  getCurrentLang(): Language {
    return this.currentLangSubject.value;
  }
}
