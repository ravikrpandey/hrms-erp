import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PurchaseReturnRoutingModule } from './purchase-return-routing.module';
import { PurchaseReturnComponent } from './purchase-return.component';
import { PurchaseReturnListComponent } from './components/purchase-return-list/purchase-return-list.component';
import { PurchaseReturnFormComponent } from './components/purchase-return-form/purchase-return-form.component';
import { PurchaseReturnViewComponent } from './components/purchase-return-view/purchase-return-view.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { ShippingAlertModule } from '../shipping-alert/shipping-alert.module';


@NgModule({
  declarations: [
    PurchaseReturnComponent,
    PurchaseReturnListComponent,
    PurchaseReturnFormComponent,
    PurchaseReturnViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PurchaseReturnRoutingModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    ShippingAlertModule
  ]
})
export class PurchaseReturnModule { }
