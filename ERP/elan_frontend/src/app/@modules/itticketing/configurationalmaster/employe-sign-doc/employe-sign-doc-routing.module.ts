import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeCreateSignComponent } from './employee-create-sign/employee-create-sign.component';
import { EmployeeListSignComponent } from './employee-list-sign/employee-list-sign.component';

const routes: Routes = [
  {path:'',component:EmployeeListSignComponent},
  {path:'employee-create-doc',component:EmployeeCreateSignComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeSignDocRoutingModule { }
