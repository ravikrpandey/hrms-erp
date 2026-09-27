import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicePaymentRoutingModule } from './invoice-payment-routing.module';
import { InvoicePaymentComponent } from './invoice-payment.component';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { InvoicePaymentActionComponent } from './invoice-payment-action/invoice-payment-action.component';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InvoicePaymentComponent,
    InvoicePaymentActionComponent,
    CreatePaymentComponent
  ],
  imports: [
    CommonModule,
    InvoicePaymentRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class InvoicePaymentModule { }
