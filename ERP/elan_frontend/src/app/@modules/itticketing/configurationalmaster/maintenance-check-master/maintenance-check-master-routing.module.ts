import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceCheckListComponent } from './maintenance-check-list/maintenance-check-list.component';
import { MaintenanceCheckCreateComponent } from './maintenance-check-create/maintenance-check-create.component';

const routes: Routes = [
  {path:'',component:MaintenanceCheckListComponent},
  {path:'create-maintenance-check',component:MaintenanceCheckCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceCheckMasterRoutingModule { }
