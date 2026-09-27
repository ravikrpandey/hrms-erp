import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderComponent } from './purchase-order.component';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { PoListActionComponent } from './po-list-action/po-list-action.component';
import { CreatePoFormComponent } from './create-po-form/create-po-form.component';


@NgModule({
  declarations: [
    PurchaseOrderComponent,
    PoListActionComponent,
    CreatePoFormComponent
  ],
  imports: [
    CommonModule,
    PurchaseOrderRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PurchaseOrderModule { }
