import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordPaymentComponent } from './record-payment.component';
import { RejectedRecordPaymentComponent } from './rejected-record-payment/rejected-record-payment.component';
import { ApprovedRecordPaymentComponent } from './approved-record-payment/approved-record-payment.component';
import { CreateRecordPaymentComponent } from './create-record-payment/create-record-payment.component';
import { PendingRecordPaymentComponent } from './pending-record-payment/pending-record-payment.component';

const routes: Routes = [
  {path:'',component:RecordPaymentComponent},
  {path:'rejected-record-payment',component:RejectedRecordPaymentComponent},
  {path:'pending-record-payment',component:PendingRecordPaymentComponent},
  {path:'approved-record-payment',component:ApprovedRecordPaymentComponent},
  {path:'create-record-payment',component:CreateRecordPaymentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordPaymentRoutingModule { }
