import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { SubcategoryComponent } from './subcategory.component';
import { SubcategoryCreateComponent } from './subcategory-create/subcategory-create.component';
import { SubcategoryActionComponent } from './subcategory-action/subcategory-action.component';
import { SubCategoryStatusComponent } from './subcategory-action/subcategory-status/subcategory-status.component';
import { SubcategoryViewComponent } from './subcategory-view/subcategory-view.component';
import { SubcategoryRoutingModule } from './subcategory-routing.module';


@NgModule({
  declarations: [
    SubcategoryComponent,
    SubcategoryCreateComponent,
    SubcategoryActionComponent,
    SubCategoryStatusComponent,
    SubcategoryViewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    SubcategoryRoutingModule
  ]
})
export class CustomerSubcategoryMasterModule { }
