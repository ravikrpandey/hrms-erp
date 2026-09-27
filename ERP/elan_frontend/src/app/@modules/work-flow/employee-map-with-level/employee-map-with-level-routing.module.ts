import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeMapWithLevelComponent } from './employee-map-with-level.component';
import { EmployeeMapWithLevelCreateComponent } from './employee-map-with-level-create/employee-map-with-level-create.component';
import { EmployeeMapWithLevelActionComponent } from './employee-map-with-level-action/employee-map-with-level-action.component';

const routes: Routes = [
  { path: '', component: EmployeeMapWithLevelComponent },
  { path: 'create', component: EmployeeMapWithLevelCreateComponent },
  { path: 'action', component: EmployeeMapWithLevelActionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeMapWithLevelRoutingModule { }
