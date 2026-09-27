import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllRecivedInvoiceRoutingModule } from './all-recived-invoice-routing.module';
// import { AllRecivedInvoiceComponent } from './all-recived-invoice/all-recived-invoice.component';
import { ExpenseInvoiceComponent } from './expense-invoice/expense-invoice.component';
import { VendorInvoiceListComponent } from './vendor-invoice-list/vendor-invoice-list.component';
import { AuditorInvoiceListComponent } from './auditor-invoice-list/auditor-invoice-list.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AgGridModule } from 'ag-grid-angular';
import { AllRecivedInvoiceComponent } from './all-recived-invoice.component';
import { ExpenseInvoiceCreateComponent } from './expense-invoice-create/expense-invoice-create.component';
import { VendorInvoiceCreateComponent } from './vendor-invoice-create/vendor-invoice-create.component';
import { AuditorInvoiceCreateComponent } from './auditor-invoice-create/auditor-invoice-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CpInvoiceListComponent } from './cp-invoice-list/cp-invoice-list.component';
import { CpInvoiceCreateComponent } from './cp-invoice-create/cp-invoice-create.component';


@NgModule({
  declarations: [
    AllRecivedInvoiceComponent,
    ExpenseInvoiceComponent,
    VendorInvoiceListComponent,
    AuditorInvoiceListComponent,
    ExpenseInvoiceCreateComponent,
VendorInvoiceCreateComponent,
AuditorInvoiceCreateComponent,
CpInvoiceListComponent,
CpInvoiceCreateComponent
  ],
  imports: [
    CommonModule,
    AllRecivedInvoiceRoutingModule,
    MaterialModule,
    ShairedModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AllRecivedInvoiceModule { }
