import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseMastersRoutingModule } from './purchase-masters-routing.module';
import { PurchaseMastersComponent } from './purchase-masters.component';
import { VendorTypeMasterComponent } from './vendor-type-master/vendor-type-master.component';


@NgModule({
  declarations: [
    PurchaseMastersComponent,
    VendorTypeMasterComponent
  ],
  imports: [
    CommonModule,
    PurchaseMastersRoutingModule
  ]
})
export class PurchaseMastersModule { }
