import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseManagementRoutingModule } from './purchase-management-routing.module';
import { PurchaseManagementComponent } from './purchase-management.component';
import { RouterModule } from '@angular/router';
import { AddProductDialogComponent } from './dialog/add-product-dialog/add-product-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { PrApprovalDialogComponent } from './dialog/pr-approval-dialog/pr-approval-dialog.component';
import { PrRfpStatusDialogComponent } from './dialog/pr-rfp-status-dialog/pr-rfp-status-dialog.component';
import { ItemQuestionDialogComponent } from './dialog/item-question-dialog/item-question-dialog.component';
import { VendorQuotationApprovalDialogComponent } from './dialog/vendor-quotation-approval-dialog/vendor-quotation-approval-dialog.component';
import { PrStatusDialogComponent } from './dialog/pr-status-dialog/pr-status-dialog.component';
import { ShowQuestionAnswerDialogComponent } from './dialog/show-question-answer-dialog/show-question-answer-dialog.component';
import { ExtendRfpDateDialogComponent } from './dialog/extend-rfp-date-dialog/extend-rfp-date-dialog.component';
import { PoApprovalDialogComponent } from './dialog/po-approval-dialog/po-approval-dialog.component';
import { GenerateBatchDialogComponent } from './dialog/generate-batch-dialog/generate-batch-dialog.component';
import { NegotiationDialogComponent } from './dialog/negotiation-dialog/negotiation-dialog.component';
import { AgGridModule } from 'ag-grid-angular';
import { ChaForwarderFormComponent } from './cha-forwarder-form/cha-forwarder-form.component';
import { GateInwardListComponent } from './gate-inward-list/gate-inward-list.component';
import { VendorAgingReportComponent } from './vendor-aging-report/vendor-aging-report.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    PurchaseManagementComponent,
    AddProductDialogComponent,
    PrApprovalDialogComponent,
    PrRfpStatusDialogComponent,
    ItemQuestionDialogComponent,
    VendorQuotationApprovalDialogComponent,
    PrStatusDialogComponent,
    ShowQuestionAnswerDialogComponent,
    ExtendRfpDateDialogComponent,
    PoApprovalDialogComponent,
    GenerateBatchDialogComponent,
    NegotiationDialogComponent,
    ChaForwarderFormComponent,
    GateInwardListComponent,
    VendorAgingReportComponent,
  ],
  imports: [
    CommonModule,
    PurchaseManagementRoutingModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ShairedModule,
    AgGridModule,
    MatIconModule,
  ],
})
export class PurchaseManagementModule {}
