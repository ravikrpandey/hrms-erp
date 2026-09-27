import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductAssetCreateComponent } from './product-asset-create.component';

const routes: Routes = [
  { path: "", component: ProductAssetCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductAssetCreateRoutingModule { }
