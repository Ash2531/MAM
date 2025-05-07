
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MockKeycloakInterceptor } from './auth/mock-keycloak.interceptor';
import { MockKeycloakService } from './auth/mock-keycloak.service';
import { DashboradComponent } from './dashborad/dashborad.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProcedureListComponent } from './procedure-list/procedure-list.component';
import { ProcedureTilesComponent } from './procedure-tiles/procedure-tiles.component';
import { SafePipe } from './safe.pipe';
import { SearchControlsComponent } from './search-controls/search-controls.component';
import { TilesMoreOptionComponent } from './tiles-more-option/tiles-more-option.component';
/**
 *
 * @param keycloakService
 * @returns A function that intialize the Keycloak service.
 */
// This function initializes the Keycloak service before the app starts/starts/loads.
export const initializeApp = (keycloakService: MockKeycloakService): (() => Promise<boolean>) => {
  return () => keycloakService.init();
};
// AoT requires an exported function for factories
/**
 *
 * @param http - The HttpClient instance to use for making HTTP requests.
 * @returns A new instance of TranslateHttpLoader.
 */
export const HttpLoaderFactory = (http: HttpClient): TranslateHttpLoader => {
  return new TranslateHttpLoader(http);
};



/**
 *
 */
@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ProcedureListComponent,
    ProcedureTilesComponent,
    SearchControlsComponent,
    DashboradComponent,
    SafePipe

  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule,
    MatInputModule,
    FormsModule,
    MatToolbarModule,
    MatSelectModule,
    MatTabsModule,
    MatCardModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TilesMoreOptionComponent
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [MockKeycloakService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockKeycloakInterceptor,
      multi: true
    }
  ],
})
export class AppModule {}
