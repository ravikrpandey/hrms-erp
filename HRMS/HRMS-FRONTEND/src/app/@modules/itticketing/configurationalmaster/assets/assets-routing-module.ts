import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Assets } from './assets';
import { AssetCategory } from './asset-category/asset-category';
import { AssetSubcategory } from './asset-subcategory/asset-subcategory';
import { AssetMaster } from './asset-master/asset-master';

const routes: Routes = [
  { path: '', component: Assets },
  { path: 'asset-category', component: AssetCategory },
  { path: 'asset-sub-category', component: AssetSubcategory },
  { path: 'asset-master', component: AssetMaster },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
