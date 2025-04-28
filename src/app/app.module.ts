
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
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

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MockKeycloakInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
