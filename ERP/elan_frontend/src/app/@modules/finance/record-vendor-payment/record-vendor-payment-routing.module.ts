import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorPaymentListComponent } from './vendor-payment-list/vendor-payment-list.component';
import { CreateVendorPaymentComponent } from './create-vendor-payment/create-vendor-payment.component';

const routes: Routes = [
  {
    path:'',component:VendorPaymentListComponent
  },
  {
    path:'create-vendor-payment',component:CreateVendorPaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordVendorPaymentRoutingModule { }
