import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CustomerCategoryComponent } from './customer-category.component';
import { CustomerCategoryCreateComponent } from './customer-category-create/customer-category-create.component';
import { CustomercategoryActionComponent } from './customer-category-action/customer-category-action.component';
import { CustomerCategoryStatusComponent } from './customer-category-action/customer-category-status/customer-category-status.component';
import { CustomerCategoryDilogComponent } from './customer-category-dilog/customer-category-dilog.component';
import { CustomerCategoryRoutingModule } from './customer-category-routing.module';
import { CustomerCategoryViewComponent } from './customer-category-view/customer-category-view.component';
@NgModule({
  declarations: [
    CustomerCategoryComponent,
    CustomerCategoryCreateComponent,
    CustomercategoryActionComponent,
    CustomerCategoryStatusComponent,
    CustomerCategoryDilogComponent,
    CustomerCategoryViewComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    CustomerCategoryRoutingModule
  ]
})
export class CustomerCategoryMasterModule { }
