import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BvgListComponent } from './bvg-list/bvg-list.component';
import { HrDashboardComponent } from './hr-dashboard-list/hr-dashboard-list.component';

const routes: Routes = [
  {path:'hr-dashboard', component : HrDashboardComponent},
  {path:'bvg-list', component : BvgListComponent},
  {path:'dialog/:candidate_id',component:BvgListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrDashboardRoutingModule { }
