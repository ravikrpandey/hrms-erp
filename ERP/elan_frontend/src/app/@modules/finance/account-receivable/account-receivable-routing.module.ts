import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountReceivableComponent } from './account-receivable.component';

 const routes: Routes = [
  { path: '', component: AccountReceivableComponent },
   {
    path: 'invoice-request',
    loadChildren: () =>
      import('./invoice-request/invoice-request.module').then((m) => m.InvoiceRequestModule),
  },
  {
    path: 'e-invoice',
    loadChildren: () =>
      import('./e-invoice/e-invoice.module').then((m) => m.EInvoiceModule),
  },
  {
    path: 'shared-invoice',
    loadChildren: () =>
      import('./shared-invoice/shared-invoice.module').then((m) => m.SharedInvoiceModule),
  } 
 
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountReceivableRoutingModule { }
