import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllPayableRoutingModule } from './all-payable-routing.module';
import { ExpenseInvoicePayableComponent } from './expense-invoice-payable/expense-invoice-payable.component';
import { VendorInvoicePayableComponent } from './vendor-invoice-payable/vendor-invoice-payable.component';
import { AuditorInvoicePayableComponent } from './auditor-invoice-payable/auditor-invoice-payable.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AgGridModule } from 'ag-grid-angular';
import { AllPayableComponent } from './all-payable.component';
import { CpInvoicePaybleListComponent } from './cp-invoice-list/cp-invoice-list.component';
import { ExpenseInvoicePdfComponent } from './expense-invoice-pdf/expense-invoice-pdf.component';
import { VendorInvoicePdfComponent } from './vendor-invoice-pdf/vendor-invoice-pdf.component';
import { AuditorInvoicePdfComponent } from './auditor-invoice-pdf/auditor-invoice-pdf.component';
import { CpInvoicePdfComponent } from './cp-invoice-pdf/cp-invoice-pdf.component';
// import { CpInvoicePaybleListComponent } from './cp-invoice-list/cp-invoice-list.component';
// import { ExpenseInvoiceCreateComponent } from './expense-invoice-create/expense-invoice-create.component';
// import { VendorInvoiceCreateComponent } from './vendor-invoice-create/vendor-invoice-create.component';
// import { AuditorInvoiceCreateComponent } from './auditor-invoice-create/auditor-invoice-create.component';
// import { AllPayableComponent } from './all-payable/all-payable.component'

@NgModule({
  declarations: [
    ExpenseInvoicePayableComponent,
    VendorInvoicePayableComponent,
    AuditorInvoicePayableComponent,
    AllPayableComponent,
    CpInvoicePaybleListComponent,
    ExpenseInvoicePdfComponent,
    VendorInvoicePdfComponent,
    AuditorInvoicePdfComponent,
    CpInvoicePdfComponent,
   
  ],
  imports: [
    CommonModule,
    AllPayableRoutingModule,
    MaterialModule,
    ShairedModule,
    AgGridModule
  ]
})
export class AllPayableModule { }
