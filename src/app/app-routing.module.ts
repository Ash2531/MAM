import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './login/home.component';
import { MockAuthRedirectComponent } from './mock-auth-redirect/mock-auth-redirect.component';
import { DashboradComponent } from './dashborad/dashborad.component';
import { ProcedureListComponent } from './procedure-list/procedure-list.component';
import { ProcedureTilesComponent } from './procedure-tiles/procedure-tiles.component';
import { SearchControlsComponent } from './search-controls/search-controls.component';
import { TilesMoreOptionComponent } from './tiles-more-option/tiles-more-option.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'mock-auth-redirect', component: MockAuthRedirectComponent },
  {path: 'dashboard', component: DashboradComponent},
  { path: 'procedure-list', component: ProcedureListComponent },
  { path: 'procedure-tiles', component: ProcedureTilesComponent },
  { path: 'search-controls', component: SearchControlsComponent },
  { path: 'tiles-more', component: TilesMoreOptionComponent },
  { path: 'logout', component: LogoutComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
