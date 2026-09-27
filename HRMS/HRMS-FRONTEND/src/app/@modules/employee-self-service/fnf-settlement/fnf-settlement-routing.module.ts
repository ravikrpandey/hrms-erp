import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FnfSettlementComponent } from './fnf-settlement/fnf-settlement.component';
import { EarmingComponent } from './earming/earming.component';
import { DeductionComponent } from './deduction/deduction.component';
import { SummaryApprovalComponent } from './summary-approval/summary-approval.component';
import { DocumentPaymentComponent } from './document-payment/document-payment.component';
// import { Children } from 'react';
import { EmployeeDatailsComponent } from 'src/app/new-employee-form/employee-datails/employee-datails.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { FnfEmployeeListComponent } from './fnf-employee-list/fnf-employee-list.component';
import { FnfStateDownlordComponent } from './fnf-state-downlord/fnf-state-downlord.component';



const routes: Routes = [
  {
    path: '',
    component: FnfEmployeeListComponent
  },
    {
    path: 'downlord',
    component: FnfStateDownlordComponent
  },
  {
    path: 'common',
    component: FnfSettlementComponent,
    children: [
      { path: '', redirectTo: 'basic-details', pathMatch: 'full' },
      { path: 'basic-details', component: EmployeeDetailsComponent },
      { path: 'earning-details', component: EarmingComponent },
      { path: 'deduction', component: DeductionComponent },
      { path: 'summary-approval', component: SummaryApprovalComponent },
      { path: 'documantation-payment', component: DocumentPaymentComponent }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FnfSettlementRoutingModule { }
