import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductAssetMasterComponent } from './product-asset-master.component';

const routes: Routes = [
  { path: "", component: ProductAssetMasterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductAssetMasterRoutingModule { }
