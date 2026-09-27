import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShippingAlertComponent } from './shipping-alert.component';
import { VendorShippingTrackingHistoryComponent } from './vendor-shipping-tracking-history/vendor-shipping-tracking-history.component';

const routes: Routes = [{ path: '', component: ShippingAlertComponent },
  {path:'shipping-history',component:VendorShippingTrackingHistoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingAlertRoutingModule { }
