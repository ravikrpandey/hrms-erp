import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CustomerMicroCategoryComponent } from './customer-micro-category.component';
import { CustomerMicroCategoryCreateComponent } from './customer-micro-category-create/customer-micro-category-create.component';
import { CustomerMicroCategoryStatusComponent } from './customer-micro-category-action/customer-micro-category-status/customer-micro-category-status.component';
import { CustomerMicroCategoryActionComponent } from './customer-micro-category-action/customer-micro-category-action.component'
import { CustomerCategoryRoutingModule } from '../customer-category/customer-category-routing.module';
import { CustomerCategoryComponent } from '../customer-category/customer-category.component';
import { CustomerCategoryCreateComponent } from '../customer-category/customer-category-create/customer-category-create.component';
import { CustomerCategoryViewComponent } from '../customer-category/customer-category-view/customer-category-view.component';
import { CustomerMicroCategoryRoutingModule } from './customer-micro-category-routing.module';
@NgModule({
  declarations: [
    CustomerMicroCategoryComponent,
    CustomerMicroCategoryActionComponent,
    CustomerMicroCategoryStatusComponent,
    CustomerMicroCategoryCreateComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    CustomerMicroCategoryRoutingModule
  ]
})
export class CustomerMicroCategoryMasterModule { }
