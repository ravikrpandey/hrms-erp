import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorQuotationApprovalRoutingModule } from './vendor-quotation-approval-routing.module';
import { VendorQuotationApprovalComponent } from './vendor-quotation-approval.component';
import { VendorQuotationActionComponent } from './vendor-quotation-action/vendor-quotation-action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { VendorQuotationFormComponent } from './vendor-quotation-form/vendor-quotation-form.component';


@NgModule({
  declarations: [
    VendorQuotationApprovalComponent,
    VendorQuotationActionComponent,
    VendorQuotationFormComponent
  ],
  imports: [
    CommonModule,
    VendorQuotationApprovalRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class VendorQuotationApprovalModule { }
