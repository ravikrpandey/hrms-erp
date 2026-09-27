import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetWarrantyListRoutingModule } from './asset-warranty-list-routing.module';
import { WarrantyListComponent } from './warranty-list/warranty-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AddWarrantyComponent } from './add-warranty/add-warranty.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActionWarrantyComponent } from './action-warranty/action-warranty.component';


@NgModule({
  declarations: [
    WarrantyListComponent,
    AddWarrantyComponent,
    ActionWarrantyComponent
  ],
  imports: [
    CommonModule,
    AssetWarrantyListRoutingModule,
    AgGridModule,
    ShairedModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AssetWarrantyListModule { }
