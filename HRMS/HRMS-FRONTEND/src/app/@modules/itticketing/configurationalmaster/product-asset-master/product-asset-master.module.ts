import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductAssetMasterRoutingModule } from './product-asset-master-routing.module';
import { ProductAssetMasterComponent } from './product-asset-master.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { ProductActionComponent } from './product-action/product-action.component';
import { ProductDilogComponent } from './product-dilog/product-dilog.component';


@NgModule({
  declarations: [
    ProductAssetMasterComponent,
    ProductActionComponent,
    ProductDilogComponent

  ],
  imports: [
    CommonModule,
    ProductAssetMasterRoutingModule,
    MaterialModule,
    AgGridModule

  ]
})
export class ProductAssetMasterModule { }
