import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubcategoryCreateComponent } from './itemgroup-create/itemgroup-create.component';
import { SubcategoryComponent } from './itemgroup-component';

const routes: Routes = [
  { path: "", component: SubcategoryComponent},
  { path: "create-item", component: SubcategoryCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemGroupRoutingModule { }
