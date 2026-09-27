import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AccessorySubcategoryComponent } from './accessory-subcategory.component';
import { AccessorySubcategoryRoutingModule } from './accessory-subcategory-routing.module';
import { AccessorySubcategoryActionComponent } from './accessory-subcategory-action/accessory-subcategory-action.component';
import { AccessorySubcategoryCreateComponent } from './accessory-subcategory-create/accessory-subcategory-create.component';
import { AccessorySubCategoryStatusComponent } from './accessory-subcategory-action/accessory-subcategory-status/accessory-subcategory-status.component';




@NgModule({
  declarations: [
    // SubcategoryComponent,
    // SubcategoryCreateComponent,
    // SubcategoryActionComponent,
    // SubCategoryStatusComponent,
    AccessorySubcategoryComponent,
    AccessorySubcategoryCreateComponent,
    AccessorySubcategoryActionComponent,
    AccessorySubCategoryStatusComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    AccessorySubcategoryRoutingModule
  ]
})
export class AccessorySubcategoryMasterModule { }
