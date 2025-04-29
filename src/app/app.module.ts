
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LogoutComponent } from './logout/logout.component';
import { MockAuthRedirectComponent } from './mock-auth-redirect/mock-auth-redirect.component';
import { MockKeycloakInterceptor } from './auth/mock-keycloak.interceptor';
import { HomeComponent } from './login/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProcedureListComponent } from './procedure-list/procedure-list.component';
import { ProcedureTilesComponent } from './procedure-tiles/procedure-tiles.component';
import { SearchControlsComponent } from './search-controls/search-controls.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { DashboradComponent } from './dashborad/dashborad.component';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MockKeycloakService } from './auth/mock-keycloak.service';

export function initializeApp(keycloakService: MockKeycloakService) {
  return () => keycloakService.init();
}
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http);
  }



@NgModule({
  declarations: [
    AppComponent,
    MockAuthRedirectComponent,
    LogoutComponent,
    HomeComponent,
    NavigationComponent,
    ProcedureListComponent,
    ProcedureTilesComponent,
    SearchControlsComponent,
    DashboradComponent,

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
    MatSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })

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
