import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubcategoryComponent } from './subcategory.component';
import { SubcategoryCreateComponent } from './subcategory-create/subcategory-create.component';
const routes: Routes = [
  { path: "", component: SubcategoryComponent},
  { path: "create-item", component: SubcategoryCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubcategoryRoutingModule { }
