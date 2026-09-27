import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseCreditNoteListComponent } from './purchase-credit-note-list/purchase-credit-note-list.component';
import { AddGstIoReportComponent } from './add-gst-io-report/add-gst-io-report.component';
import { PurchaseDebitNoteListComponent } from './purchase-debit-note-list/purchase-debit-note-list.component';
import { PurchaseRegisterListComponent } from './purchase-register-list/purchase-register-list.component';
import { SalesCreditNoteListComponent } from './sales-credit-note-list/sales-credit-note-list.component';
import { SalesDebitNoteListComponent } from './sales-debit-note-list/sales-debit-note-list.component';
import { SalesRegisterListComponent } from './sales-register-list/sales-register-list.component';
import { Gstr1Component } from './gstr1/gstr1.component';
import { Gstr2bComponent } from './gstr2b/gstr2b.component';
import { Gstr3bComponent } from './gstr3b/gstr3b.component';
import { HsnSummaryReportComponent } from './hsn-summary-report/hsn-summary-report.component';
import { Gstr8AnnualReturnComponent } from './gstr8-annual-return/gstr8-annual-return.component';
import { Gstr7TdsUnderGstComponent } from './gstr7-tds-under-gst/gstr7-tds-under-gst.component';

const routes: Routes = [
  {
    path: 'purchase-credit-note', component: PurchaseCreditNoteListComponent
  },
  {
    path: 'gst-output/Input-report', component: AddGstIoReportComponent
  },
  {
    path: 'purchase-debit-note', component: PurchaseDebitNoteListComponent
  },
  {
    path: 'purchase-register', component: PurchaseRegisterListComponent
  },
  {
    path: 'sales-credit-note', component: SalesCreditNoteListComponent
  },
  {
    path: 'sales-debit-note', component: SalesDebitNoteListComponent
  },
  {
    path: 'sales-register', component: SalesRegisterListComponent
  },
  {
    path: 'gstr-1', component: Gstr1Component
  },
  {
    path: 'gstr-2b', component: Gstr2bComponent
  },
  {
    path: 'gstr-3b', component: Gstr3bComponent
  },
  {
    path: 'hsn-summary-report', component: HsnSummaryReportComponent
  },
  {
    path: 'gstr-8-annual-return', component:Gstr8AnnualReturnComponent
  },{
    path: 'gstr-7-under-gst-tds', component:Gstr7TdsUnderGstComponent
  },
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GstReportRoutingModule { }
