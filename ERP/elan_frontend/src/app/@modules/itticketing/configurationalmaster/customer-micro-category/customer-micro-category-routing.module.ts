import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerMicroCategoryComponent } from './customer-micro-category.component';
import { CustomerMicroCategoryCreateComponent } from './customer-micro-category-create/customer-micro-category-create.component';
const routes: Routes = [
  { path: "", component: CustomerMicroCategoryComponent},
  { path: "create-item", component: CustomerMicroCategoryCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerMicroCategoryRoutingModule { }
