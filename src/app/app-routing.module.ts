import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/Guard/AuthGuard.guard';
import { DashboradComponent } from './dashborad/dashborad.component';
import { MockAuthRedirectComponent } from './mock-auth-redirect/mock-auth-redirect.component';
import { ProcedureListComponent } from './procedure-list/procedure-list.component';
import { ProcedureTilesComponent } from './procedure-tiles/procedure-tiles.component';
import { SearchControlsComponent } from './search-controls/search-controls.component';
import { TilesMoreOptionComponent } from './tiles-more-option/tiles-more-option.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'mock-auth-redirect', component: MockAuthRedirectComponent },
  { path: 'dashboard', component: DashboradComponent, canActivate: [AuthGuard] },
  { path: 'procedure-list', component: ProcedureListComponent },
  { path: 'procedure-tiles', component: ProcedureTilesComponent },
  { path: 'search-controls', component: SearchControlsComponent },
  { path: 'tiles-more', component: TilesMoreOptionComponent },
];


/**
 *
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
