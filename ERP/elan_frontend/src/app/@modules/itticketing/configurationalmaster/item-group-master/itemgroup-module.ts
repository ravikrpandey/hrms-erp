import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';

import { SubcategoryCreateComponent } from './itemgroup-create/itemgroup-create.component';
import { SubcategoryActionComponent } from './itemgroup-action/itemgroup-action.component';
import { SubCategoryStatusComponent } from './itemgroup-action/itemgroup-status/itemgroup-status.component';

import { SubcategoryComponent } from './itemgroup-component';
import { ItemGroupRoutingModule } from './itemgroup-routing.module';



@NgModule({
  declarations: [
    SubcategoryComponent,
    SubcategoryCreateComponent,
    SubcategoryActionComponent,
    SubCategoryStatusComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    ItemGroupRoutingModule
  ]
})
export class ItemGroupMasterModule { }
