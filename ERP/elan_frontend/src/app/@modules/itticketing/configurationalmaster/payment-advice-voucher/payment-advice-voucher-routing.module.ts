import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentAdviceVoucherListComponent } from './payment-advice-voucher-list/payment-advice-voucher-list.component';

const routes: Routes = [
  {
    path:'',component:PaymentAdviceVoucherListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentAdviceVoucherRoutingModule { }
