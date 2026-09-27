import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleMaintenanceComponent } from './schedule-maintenance.component';
import { VendorScheduleMaintenanceComponent } from './vendor-schedule-maintenance/vendor-schedule-maintenance.component';

const routes: Routes = [
  {path:'',component:ScheduleMaintenanceComponent},
  {path:'vendor-schedule-maintenance',component:VendorScheduleMaintenanceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleMaintenanceRoutingModule { }
