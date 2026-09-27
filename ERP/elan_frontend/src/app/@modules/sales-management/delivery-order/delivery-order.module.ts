import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryOrderRoutingModule } from './delivery-order-routing.module';
import { DeliveryOrderComponent } from './delivery-order.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { CreateDeliveryOrderComponent } from './create-delivery-order/create-delivery-order.component';
import { PendingDeliveryOrderComponent } from './pending-delivery-order/pending-delivery-order.component';
import { ApprovedDeliveryOrderComponent } from './approved-delivery-order/approved-delivery-order.component';
import { RejectedDeliveryOrderComponent } from './rejected-delivery-order/rejected-delivery-order.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { DeliveryActionComponent } from './delivery-action/delivery-action.component';
import { DeliveryStatusComponent } from './delivery-status/delivery-status.component';


@NgModule({
  declarations: [
    DeliveryOrderComponent,
    CreateDeliveryOrderComponent,
    PendingDeliveryOrderComponent,
    ApprovedDeliveryOrderComponent,
    RejectedDeliveryOrderComponent,
    DeliveryActionComponent,
    DeliveryStatusComponent
  ],
  imports: [
    CommonModule,
    DeliveryOrderRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    MatSelectFilterModule,

  ]
})
export class DeliveryOrderModule { }
