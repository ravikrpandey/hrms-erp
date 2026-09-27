import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FnfSettlementRoutingModule } from './fnf-settlement-routing.module';
import { FnfSettlementComponent } from './fnf-settlement/fnf-settlement.component';
import { EarmingComponent } from './earming/earming.component';
import { DeductionComponent } from './deduction/deduction.component';
import { SummaryApprovalComponent } from './summary-approval/summary-approval.component';
import { DocumentPaymentComponent } from './document-payment/document-payment.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { MatIconModule } from '@angular/material/icon';
import { FnfEmployeeListComponent } from './fnf-employee-list/fnf-employee-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FnfStateDownlordComponent } from './fnf-state-downlord/fnf-state-downlord.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FnfActionComponent } from './fnf-action/fnf-action.component';




@NgModule({
  declarations: [
    FnfSettlementComponent,
    EarmingComponent,
    DeductionComponent,
    SummaryApprovalComponent,
    DocumentPaymentComponent,
    EmployeeDetailsComponent,
    FnfEmployeeListComponent,
    FnfStateDownlordComponent,
    FnfActionComponent
    
  ],
  imports: [
    CommonModule,
    FnfSettlementRoutingModule,
    MatIconModule,
    AgGridModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
   ]
})
export class FnfSettlementModule { }
