import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRequestRoutingModule } from './purchase-request-routing.module';
import { PurchaseRequestComponent } from './purchase-request.component';
import { PrListActionComponent } from './pr-list-action/pr-list-action.component';
import { RouterModule } from '@angular/router';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CreatePurchaseRequestComponent } from './create-purchase-request/create-purchase-request.component';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    PurchaseRequestComponent,
    PrListActionComponent,
    CreatePurchaseRequestComponent,
  ],
  imports: [
    CommonModule,
    PurchaseRequestRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule
  ]
})
export class PurchaseRequestModule { }
