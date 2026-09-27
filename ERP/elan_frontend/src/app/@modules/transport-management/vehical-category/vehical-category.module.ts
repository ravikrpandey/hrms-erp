import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicalCategoryRoutingModule } from './vehical-category-routing.module';
import { VehicalCategoryComponent } from './vehical-category.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateVehicalCategoryComponent } from './create-vehical-category/create-vehical-category.component';
import { VehicalCategoryActionComponent } from './vehical-category-action/vehical-category-action.component';
import { VehicalCategoryStatsuComponent } from './vehical-category-statsu/vehical-category-statsu.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    VehicalCategoryComponent,
    CreateVehicalCategoryComponent,
    VehicalCategoryActionComponent,
    VehicalCategoryStatsuComponent
  ],
  imports: [
    CommonModule,
    VehicalCategoryRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ]
})
export class VehicalCategoryModule { }
