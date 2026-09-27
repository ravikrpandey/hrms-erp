import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrollCycleListComponent } from './payroll-cycle-list/payroll-cycle-list.component';
import { PayrollCycleCreateComponent } from './payroll-cycle-create/payroll-cycle-create.component';

const routes: Routes = [
  {path:'',component:PayrollCycleListComponent},
  {path:'create-payroll-cycle', component:PayrollCycleCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollCycleRoutingModule { }
