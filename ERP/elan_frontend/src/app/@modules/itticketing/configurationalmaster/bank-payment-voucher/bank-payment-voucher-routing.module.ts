import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankPaymentListComponent } from './bank-payment-list/bank-payment-list.component';

const routes: Routes = [
  {
    path: '',
    component: BankPaymentListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankPaymentVoucherRoutingModule { }
