import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetListComponent } from './asset-list/asset-list.component';
import { BasicDetailsComponent } from './asset-view/asset-header/basic-details/basic-details.component';
import { DocsComponent } from './asset-view/asset-header/docs/docs.component';
import { DepreciationComponent } from './asset-view/asset-header/depreciation/depreciation.component';
import { HistoryComponent } from './asset-view/asset-header/history/history.component';
import { PoViewComponent } from './asset-view/po-view/po-view.component';
import { MaintenanceComponent } from './asset-view/asset-header/maintenance/maintenance.component';
import { WarrantyComponent } from './asset-view/asset-header/warranty/warranty.component';
import { CreateDirectAssetComponent } from './direct-asset/create-direct-asset/create-direct-asset.component';

const routes: Routes = [
  {path:'',component:AssetListComponent},
  {path:'list',component:AssetListComponent},
  {path:'basic-details',component:BasicDetailsComponent},
  {path:'docs',component:DocsComponent},
  {path:'depreciation',component:DepreciationComponent},
  {path:'history',component:HistoryComponent},
  {path:'maintenance',component:MaintenanceComponent},
  {path:'warranty',component:WarrantyComponent},
  {path:'po-view',component:PoViewComponent},
  {path:'create-direct-asset',component:CreateDirectAssetComponent},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetListRoutingModule { }
