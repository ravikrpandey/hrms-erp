import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseComponent } from './warehouse.component';
import { CreateWarehouseComponent } from './create-warehouse/create-warehouse.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AgGridModule } from 'ag-grid-angular';
import { WarehouseActionComponent } from './warehouse-action/warehouse-action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WarehouseComponent,
    CreateWarehouseComponent,
    WarehouseActionComponent
  ],
  imports: [
    CommonModule,
    WarehouseRoutingModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class WarehouseModule { }
