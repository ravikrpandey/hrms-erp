import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AccessoryItemComponent } from './accessory-item.component';
import { AccessoryItemViewComponent } from './accessory-item-view/accessory-item-view.component';
import { AccessoryItemCreateComponent } from './accessory-item-create/accessory-item-create.component';
import { AccessoryItemActionComponent } from './accessory-item-action/accessory-item-action.component';
import { AccessoryItemRoutingModule } from './accessory-item-routing.module';


@NgModule({
  declarations: [
    AccessoryItemComponent,
    AccessoryItemViewComponent,
    AccessoryItemCreateComponent,
    AccessoryItemActionComponent,
  ],
  imports: [
    CommonModule,
    AccessoryItemRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule
  ]
})
export class AccessoryItemModule { }
