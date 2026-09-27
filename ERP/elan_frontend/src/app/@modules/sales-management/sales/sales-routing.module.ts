import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesComponent } from './sales.component';
import { RejectedSalesInvoiceComponent } from './rejected-sales-invoice/rejected-sales-invoice.component';
import { PendingSalesInvoiceComponent } from './pending-sales-invoice/pending-sales-invoice.component';
import { ApprovedSalesInvoiceComponent } from './approved-sales-invoice/approved-sales-invoice.component';
import { CreateSalesInvoiceComponent } from './create-sales-invoice/create-sales-invoice.component';

const routes: Routes = [
  {path:'',component:SalesComponent},
  {path:'rejected-sales-invoice',component:RejectedSalesInvoiceComponent},
  {path:'pending-sales-invoice',component:PendingSalesInvoiceComponent},
  {path:'approved-sales-invoice',component:ApprovedSalesInvoiceComponent},
  {path:'create-sales-invoice',component:CreateSalesInvoiceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
