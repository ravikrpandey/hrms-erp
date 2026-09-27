import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { InvoiceActionComponent } from './invoice-action/invoice-action.component';
import { CreateGrnInvoiceComponent } from './create-grn-invoice/create-grn-invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { CreateMultiPoInvoiceComponent } from './create-multi-po-invoice/create-multi-po-invoice.component';


@NgModule({
  declarations: [
    InvoiceComponent,
    InvoiceActionComponent,
    CreateGrnInvoiceComponent,
    CreateInvoiceComponent,
    CreateMultiPoInvoiceComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
  ]
})
export class InvoiceModule { }
