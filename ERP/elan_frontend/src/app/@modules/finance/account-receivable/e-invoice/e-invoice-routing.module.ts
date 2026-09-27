import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EInvoiceComponent } from './e-invoice.component';
import { InvoicePdfComponent } from './invoice-pdf/invoice-pdf.component';

const routes: Routes = [{ path: '', component: EInvoiceComponent }
,
{
  path: 'invocie_pdf', component: InvoicePdfComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EInvoiceRoutingModule { }
