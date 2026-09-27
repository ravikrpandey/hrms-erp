import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoInvoiceRoutingModule } from './so-invoice-routing.module';
import { CreateSoInvoiceComponent } from './create-so-invoice/create-so-invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { SoInvoiceActionComponent } from './so-invoice-action/so-invoice-action.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    CreateSoInvoiceComponent,
    SoInvoiceActionComponent
  ],
  imports: [
    CommonModule,
    SoInvoiceRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule
  ]
})
export class SoInvoiceModule { }
