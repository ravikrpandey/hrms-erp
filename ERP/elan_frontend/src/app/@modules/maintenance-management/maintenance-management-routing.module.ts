import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceManagementComponent } from './maintenance-management.component';

const routes: Routes = [
  {path:'',component:MaintenanceManagementComponent,
    children:[
      {
        path:'plan-maintenance',
        loadChildren:()=>import('./plan-maintenance/plan-maintenance.module').then(m=>m.PlanMaintenanceModule)
      },
      {
        path:'schedule-maintenance',
        loadChildren:()=>import('./schedule-maintenance/schedule-maintenance.module').then(m=>m.ScheduleMaintenanceModule)
      },
      {
        path:'maintenance-request',
        loadChildren:()=>import('./maintenance-request/maintenance-request.module').then(m=>m.MaintenanceRequestModule)
      },
      {
        path:'dashboard',
        loadChildren:()=>import('./maintenance-dashboard/maintenance-dashboard.module').then(m=>m.MaintenanceDashboardModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceManagementRoutingModule { }
