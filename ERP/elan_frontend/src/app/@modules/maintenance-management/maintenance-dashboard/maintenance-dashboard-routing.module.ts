import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceDashboardComponent } from './maintenance-dashboard.component';

const routes: Routes = [
  {path:'',component:MaintenanceDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceDashboardRoutingModule { }
