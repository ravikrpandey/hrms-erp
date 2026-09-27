import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GstReportRoutingModule } from './gst-report-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { PurchaseDebitNoteListComponent } from './purchase-debit-note-list/purchase-debit-note-list.component';
import { PurchaseRegisterListComponent } from './purchase-register-list/purchase-register-list.component';
import { SalesCreditNoteListComponent } from './sales-credit-note-list/sales-credit-note-list.component';
import { SalesDebitNoteListComponent } from './sales-debit-note-list/sales-debit-note-list.component';
import { SalesRegisterListComponent } from './sales-register-list/sales-register-list.component';
import { Gstr1Component } from './gstr1/gstr1.component';
import { Gstr2bComponent } from './gstr2b/gstr2b.component';
import { Gstr3bComponent } from './gstr3b/gstr3b.component';
import { HsnSummaryReportComponent } from './hsn-summary-report/hsn-summary-report.component';
import { Gstr9AnnualReturnComponent } from './gstr9-annual-return/gstr9-annual-return.component';
import { Gstr7TdsUnderGstComponent } from './gstr7-tds-under-gst/gstr7-tds-under-gst.component';
import { Gstr8AnnualReturnComponent } from './gstr8-annual-return/gstr8-annual-return.component';
import { AddGstIoReportComponent } from './add-gst-io-report/add-gst-io-report.component';


@NgModule({
  declarations: [

  
    PurchaseDebitNoteListComponent,
        PurchaseRegisterListComponent,
        SalesCreditNoteListComponent,
        SalesDebitNoteListComponent,
        SalesRegisterListComponent,
        Gstr1Component,
        Gstr2bComponent,
        Gstr3bComponent,
        HsnSummaryReportComponent,
        Gstr9AnnualReturnComponent,
        Gstr7TdsUnderGstComponent,
        Gstr8AnnualReturnComponent,
        AddGstIoReportComponent
  ],
  imports: [
    CommonModule,
    GstReportRoutingModule,
    AgGridModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
  
    ReactiveFormsModule,
    ShairedModule,
     
  
  ]
})
export class GstReportModule { }
