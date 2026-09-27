import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrollSalerySlipComponent } from './payroll-salery-slip/payroll-salery-slip.component';
import { SalaryApprovalSlipComponent } from './salary-approval-slip/salary-approval-slip.component';

const routes: Routes = [
  {path:'',component:SalaryApprovalSlipComponent},
  {path:'pay-salery-slip',component:PayrollSalerySlipComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollSalerySlipRoutingModule { }
