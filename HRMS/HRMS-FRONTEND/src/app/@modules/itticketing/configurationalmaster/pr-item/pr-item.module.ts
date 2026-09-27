import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrItemRoutingModule } from './pr-item-routing.module';
import { PrItemComponent } from './pr-item.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { PrItemActionComponent } from './pr-item-action/pr-item-action.component';
import { PrItemDilogComponent } from './pr-item-dilog/pr-item-dilog.component';
import { PrItemCreateComponent } from './pr-item-create/pr-item-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemMasterStatusComponent } from './pr-item-action/item-master-status/item-master-status.component';
import { PrItemViewComponent } from './pr-item-view/pr-item-view.component';



@NgModule({
  declarations: [
    PrItemComponent,
    PrItemActionComponent,
    PrItemDilogComponent,
    PrItemCreateComponent,
    ItemMasterStatusComponent,
    PrItemViewComponent
  ],
  imports: [
    CommonModule,
    PrItemRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PrItemModule { }
