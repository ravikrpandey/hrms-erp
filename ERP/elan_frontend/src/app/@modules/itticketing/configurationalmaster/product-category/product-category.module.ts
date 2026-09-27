import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductCategoryRoutingModule } from './product-category-routing.module';
import { ProductCategoryListComponent } from './product-category-list/product-category-list.component';
import { ProductCategoryCreateComponent } from './product-category-create/product-category-create.component';
import { AgGridModule } from 'ag-grid-angular';
import { ProductStatusComponent } from './product-status/product-status.component';
import { ProductActionComponent } from './product-action/product-action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProductCategoryListComponent,
    ProductCategoryCreateComponent,
    ProductStatusComponent,
    ProductActionComponent
  ],
  imports: [
    CommonModule,
    ProductCategoryRoutingModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProductCategoryModule { }
