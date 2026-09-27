import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceListComponent } from './maintenance-list/maintenance-list.component';
import { AddMaintenanceComponent } from './add-maintenance/add-maintenance.component';

const routes: Routes = [
  {path:'',component:MaintenanceListComponent},
  {path:'create-maintenance',component:AddMaintenanceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
