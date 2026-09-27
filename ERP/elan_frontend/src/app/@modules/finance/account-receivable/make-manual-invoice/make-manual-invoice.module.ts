import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MakeManualInvoiceRoutingModule } from './make-manual-invoice-routing.module';
import { MakeManualInvoiceComponent } from './make-manual-invoice.component';
import { PandingManualInvoiceComponent } from './panding-manual-invoice/panding-manual-invoice.component';
import { ApprvedManualInvoiceComponent } from './apprved-manual-invoice/apprved-manual-invoice.component';
import { RejectManualInvoiceComponent } from './reject-manual-invoice/reject-manual-invoice.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ReactiveFormsModule , FormsModule} from '@angular/forms';
import { ActionManualInvoiceComponent } from './action-manual-invoice/action-manual-invoice.component';
import { ActionApprovedComponent } from './action-approved/action-approved.component';


@NgModule({
  declarations: [
    MakeManualInvoiceComponent,
    PandingManualInvoiceComponent,
    ApprvedManualInvoiceComponent,
    RejectManualInvoiceComponent,
    ActionManualInvoiceComponent,
    ActionApprovedComponent
  ],
  imports: [
    CommonModule,
    MakeManualInvoiceRoutingModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule

  ]
})
export class MakeManualInvoiceModule { }
