import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductAssetCreateRoutingModule } from './product-asset-create-routing.module';
import { ProductAssetCreateComponent } from './product-asset-create.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProductAssetCreateComponent
  ],
  imports: [
    CommonModule,
    ProductAssetCreateRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProductAssetCreateModule { }
