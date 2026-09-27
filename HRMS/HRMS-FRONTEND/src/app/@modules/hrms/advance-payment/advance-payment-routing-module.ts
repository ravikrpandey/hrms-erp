import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvancePaymentList } from './advance-payment-list/advance-payment-list';
import { AdvancePaymentCreate } from './advance-payment-create/advance-payment-create';
import { AdvancePaymentAction } from './advance-payment-action/advance-payment-action';

const routes: Routes = [
  { path:'', component:AdvancePaymentList },
  { path:'create', component: AdvancePaymentCreate },
  { path:'action', component: AdvancePaymentAction },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvancePaymentRoutingModule { }
