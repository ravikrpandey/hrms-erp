import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceRequestComponent } from './maintenance-request.component';
import { ApproveMaintenanceComponent } from './approve-maintenance/approve-maintenance.component';
import { RejectMaintenanceComponent } from './reject-maintenance/reject-maintenance.component';

const routes: Routes = [
  {path:'',component:MaintenanceRequestComponent},
  {path:'approve',component:ApproveMaintenanceComponent},
  {path:'reject',component:RejectMaintenanceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRequestRoutingModule { }
