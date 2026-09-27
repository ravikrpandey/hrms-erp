import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LorryReceiptRoutingModule } from './lorry-receipt-routing.module';
import { LorryReceiptComponent } from './lorry-receipt.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ActionButtonComponent } from './action-button/action-button.component';
import { LorryDetailsComponent } from './lorry-details/lorry-details.component';
import { ItemMapDetailsComponent } from './item-map-details/item-map-details.component';


@NgModule({
  declarations: [
    LorryReceiptComponent,
    ActionButtonComponent,
    LorryDetailsComponent,
    ItemMapDetailsComponent
  ],
  imports: [
    CommonModule,
    LorryReceiptRoutingModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
  ]
})
export class LorryReceiptModule { }
