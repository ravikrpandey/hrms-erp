import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordPaymentListComponent } from './record-payment-list/record-payment-list.component';
import { CreateRecordPaymentComponent } from './create-record-payment/create-record-payment.component';

const routes: Routes = [
  {
    path:'',component:RecordPaymentListComponent
  },
  {
    path:'create-record-payment',component:CreateRecordPaymentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordPaymentRoutingModule { }
