import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationApprovalRoutingModule } from './quotation-approval-routing.module';
import { QuotationApprovalComponent } from './quotation-approval.component';
import { QuotationApprovalActionComponent } from './quotation-approval-action/quotation-approval-action.component';
import { QuotationApprovalCreateComponent } from './quotation-approval-create/quotation-approval-create.component';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [
    QuotationApprovalComponent,
    QuotationApprovalActionComponent,
    QuotationApprovalCreateComponent
  ],
  imports: [
    CommonModule,
    QuotationApprovalRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    MaterialModule,
    MatSelectFilterModule,
    NgxMatSelectSearchModule
  ]
})
export class QuotationApprovalModule { }
