import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrmsDashboardComponent } from './hrms-dashboard/hrms-dashboard.component';
import { IframeDashboard } from './iframe-dashboard/iframe-dashboard';

const routes: Routes = [  
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: HrmsDashboardComponent
      
  }, 
  {
    path: 'dashboard-hrms',
    component: IframeDashboard
      
  }, 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmsDashboardRoutingModule { }
