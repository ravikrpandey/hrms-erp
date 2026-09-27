import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EInvoiceRoutingModule } from './e-invoice-routing.module';
import { EInvoiceComponent } from './e-invoice.component';
import { EInvoiceActionComponent } from './action/action.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { InvoicePdfComponent } from './invoice-pdf/invoice-pdf.component';



@NgModule({
  declarations: [
    EInvoiceComponent,
    EInvoiceActionComponent,
    InvoicePdfComponent
  ],
  imports: [
    CommonModule,
    EInvoiceRoutingModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule

  ]
})
export class EInvoiceModule { }
