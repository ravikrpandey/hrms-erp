import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicePaymentComponent } from './invoice-payment.component';
import { CreatePaymentComponent } from './create-payment/create-payment.component';

const routes: Routes = [
  { path: '', component: InvoicePaymentComponent },
  { path: 'payment', component: CreatePaymentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicePaymentRoutingModule { }
