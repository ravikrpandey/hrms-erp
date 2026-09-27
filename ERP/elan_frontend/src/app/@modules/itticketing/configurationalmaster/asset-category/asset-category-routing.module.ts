import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetCategoryComponent } from './asset-category.component';

const routes: Routes = [
  { path: "", component: AssetCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetCategoryRoutingModule { }
