import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessoryCategoryComponent } from './accessory-category.component';


const routes: Routes = [
  { path: "", component: AccessoryCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessoryCategoryRoutingModule { }
