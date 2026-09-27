import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPayableComponent } from './account-payable.component';

 const routes: Routes = [
  {path:'',component:AccountPayableComponent},
  // { path: '', redirectTo:'all-recived-invoice',pathMatch:'full'},
  //  {
  //   path: 'invoice-request',
  //   loadChildren: () =>
  //     import('./invoice-request/invoice-request.module').then((m) => m.InvoiceRequestModule),
  // },
  // {
  //   path: 'e-invoice',
  //   loadChildren: () =>
  //     import('./e-invoice/e-invoice.module').then((m) => m.EInvoiceModule),
  // },
  // {
  //   path: 'shared-invoice',
  //   loadChildren: () =>
  //     import('./shared-invoice/shared-invoice.module').then((m) => m.SharedInvoiceModule),
  // } 
  {
    path: 'all-recived-invoice',
     loadChildren: () =>
       import('./all-recived-invoice/all-recived-invoice.module').then((m) => m.AllRecivedInvoiceModule),
   } ,
   {
    path: 'all-payable',
     loadChildren: () =>
       import('./all-payable/all-payable.module').then((m) => m.AllPayableModule),
   } 
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountPayableRoutingModule { }
