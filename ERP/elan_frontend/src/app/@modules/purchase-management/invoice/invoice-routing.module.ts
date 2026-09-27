import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './invoice.component';
import { CreateGrnInvoiceComponent } from './create-grn-invoice/create-grn-invoice.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { CreateMultiPoInvoiceComponent } from './create-multi-po-invoice/create-multi-po-invoice.component';

const routes: Routes = [
  { path: '', component: InvoiceComponent },
  { path: 'po-details-invoice', component: CreateGrnInvoiceComponent },
  { path: 'create-invoice', component: CreateInvoiceComponent },
  { path: "create-multi-po-invoice", component: CreateMultiPoInvoiceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
