import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanMaintenanceComponent } from './plan-maintenance.component';
import { CreateScheduleMaintenanceComponent } from './create-schedule-maintenance/create-schedule-maintenance.component';

const routes: Routes = [
  {path:'',component:PlanMaintenanceComponent},
  {path:'create-schedule',component:CreateScheduleMaintenanceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanMaintenanceRoutingModule { }
