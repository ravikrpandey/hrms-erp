import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddStockRoutingModule } from './add-stock-routing.module';
import { AddStockComponent } from './add-stock.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AddStockActionComponent } from './add-stock-action/add-stock-action.component';
import { GrnWarehouseAllocationFormComponent } from './grn-warehouse-allocation-form/grn-warehouse-allocation-form.component';


@NgModule({
  declarations: [
    AddStockComponent,
    AddStockActionComponent,
    GrnWarehouseAllocationFormComponent
  ],
  imports: [
    CommonModule,
    AddStockRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddStockModule { }
