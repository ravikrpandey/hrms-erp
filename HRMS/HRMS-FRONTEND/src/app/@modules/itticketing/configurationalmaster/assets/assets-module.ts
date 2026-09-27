import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsRoutingModule } from './assets-routing-module';
import { RouterModule } from '@angular/router';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Assets } from './assets';
import { AssetCategory } from './asset-category/asset-category';
import { AssetSubcategory } from './asset-subcategory/asset-subcategory';
import { AssetMaster } from './asset-master/asset-master';
import { AssetcategoryDialog } from './asset-category/assetcategory-dialog/assetcategory-dialog';
import { AssetcategoryAction } from './asset-category/assetcategory-action/assetcategory-action';
import { AssetcategoryStatus } from './asset-category/assetcategory-status/assetcategory-status';
import { AssetsubcategoryAction } from './asset-subcategory/assetsubcategory-action/assetsubcategory-action';
import { AssetsubcategoryDialog } from './asset-subcategory/assetsubcategory-dialog/assetsubcategory-dialog';
import { AssetsubcategoryStatus } from './asset-subcategory/assetsubcategory-status/assetsubcategory-status';
import { AssetMasterAction } from './asset-master/asset-master-action/asset-master-action';
import { AssetMasterDialog } from './asset-master/asset-master-dialog/asset-master-dialog';
import { AssetMasterStatus } from './asset-master/asset-master-status/asset-master-status';


@NgModule({
  declarations: [
    Assets,
    AssetCategory,
    AssetcategoryAction,
    AssetcategoryDialog,
    AssetcategoryStatus,
    AssetSubcategory,
    AssetsubcategoryAction,
    AssetsubcategoryDialog,
    AssetsubcategoryStatus,
    AssetMaster,
    AssetMasterAction,
    AssetMasterDialog,
    AssetMasterStatus
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatSidenavModule
  ]
})
export class AssetsModule { }
