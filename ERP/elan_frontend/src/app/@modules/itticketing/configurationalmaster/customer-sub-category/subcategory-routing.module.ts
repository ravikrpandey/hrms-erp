import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubcategoryComponent } from './subcategory.component';
import { SubcategoryCreateComponent } from './subcategory-create/subcategory-create.component';
import { SubcategoryViewComponent } from './subcategory-view/subcategory-view.component';
const routes: Routes = [
  { path: "", component: SubcategoryComponent},
  { path: "create-item", component: SubcategoryCreateComponent},
  { path: "view", component: SubcategoryViewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubcategoryRoutingModule { }
