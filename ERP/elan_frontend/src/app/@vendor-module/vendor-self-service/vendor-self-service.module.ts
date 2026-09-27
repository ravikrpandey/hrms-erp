import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorSelfServiceRoutingModule } from './vendor-self-service-routing.module';
import { VendorSelfServiceComponent } from './vendor-self-service.component';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';


@NgModule({
  declarations: [
    VendorSelfServiceComponent,
    VendorDashboardComponent
  ],
  imports: [
    CommonModule,
    VendorSelfServiceRoutingModule,
    ShairedModule
  ]
})
export class VendorSelfServiceModule { }
