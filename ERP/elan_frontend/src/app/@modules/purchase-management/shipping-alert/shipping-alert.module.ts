import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingAlertRoutingModule } from './shipping-alert-routing.module';
import { ShippingAlertComponent } from './shipping-alert.component';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ShippingAlertActionComponent } from './shipping-alert-action/shipping-alert-action.component';
import { ShippingUpdateComponent } from './shipping-update/shipping-update.component';
import { VendorShippingAlertComponent } from './vendor-shipping-alert/vendor-shipping-alert.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VendorShippingTrackingDetailsComponent } from './vendor-shipping-tracking-details/vendor-shipping-tracking-details.component';
import { VendorShippingTrackingHistoryComponent } from './vendor-shipping-tracking-history/vendor-shipping-tracking-history.component';
import { ShippingAlertStatusDialogComponent } from './shipping-alert-status-dialog/shipping-alert-status-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { VendorTopHeaderComponent } from './vendor-header/vendor-header.component';
import { VendorPolistComponent } from './vendor-polist/vendor-polist.component';
import { VendorRfplistComponent } from './vendor-rfplist/vendor-rfplist.component';
import { VendorNegotiationlistComponent } from './vendor-negotiationlist/vendor-negotiationlist.component';

@NgModule({
  declarations: [
    ShippingAlertComponent,
    ShippingAlertActionComponent,
    ShippingUpdateComponent,
    VendorShippingAlertComponent,
    VendorShippingTrackingDetailsComponent,
    VendorShippingTrackingHistoryComponent,
    ShippingAlertStatusDialogComponent,
    VendorDashboardComponent,
    VendorTopHeaderComponent,
    VendorPolistComponent,
    VendorRfplistComponent,
    VendorNegotiationlistComponent,
    
  ],
  imports: [
    CommonModule,
    ShippingAlertRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    ReactiveFormsModule,
    MaterialModule,
    MatProgressBarModule
  ],
  exports: [
    VendorTopHeaderComponent
  ]
})
export class ShippingAlertModule { }
