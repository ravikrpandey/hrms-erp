import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryOrderComponent } from './delivery-order.component';
import { CreateDeliveryOrderComponent } from './create-delivery-order/create-delivery-order.component';
import { PendingDeliveryOrderComponent } from './pending-delivery-order/pending-delivery-order.component';
import { ApprovedDeliveryOrderComponent } from './approved-delivery-order/approved-delivery-order.component';
import { RejectedDeliveryOrderComponent } from './rejected-delivery-order/rejected-delivery-order.component';

const routes: Routes = [
  {path:'',component:DeliveryOrderComponent},
  {path:'create-delivery-order',component:CreateDeliveryOrderComponent},
  {path:'pending-delivery-order',component:PendingDeliveryOrderComponent},
  {path:'approved-delivery-order',component:ApprovedDeliveryOrderComponent},
  {path:'rejected-delivery-order',component:RejectedDeliveryOrderComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryOrderRoutingModule { }
