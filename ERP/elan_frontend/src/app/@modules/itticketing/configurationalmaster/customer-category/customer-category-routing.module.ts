import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerCategoryComponent } from './customer-category.component';
import { CustomerCategoryCreateComponent } from './customer-category-create/customer-category-create.component';
import { CustomerCategoryViewComponent } from './customer-category-view/customer-category-view.component';
const routes: Routes = [
  { path: "", component: CustomerCategoryComponent},
  { path: "create-item", component: CustomerCategoryCreateComponent},
  { path: "view", component:CustomerCategoryCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCategoryRoutingModule { }
