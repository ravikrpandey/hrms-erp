import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetManagementComponent } from './asset-management.component';
import { AuthGuard } from 'src/app/@auth/auth-material/auth.guard';
import { AssetSaleWriteoffComponent } from './asset-sale-writeoff/asset-sale-writeoff.component';
import { AssetTransferNodeListComponent } from './asset-list/asset-transfer-node-list/asset-transfer-node-list.component';
import { AssetDashboardComponent } from './asset-dashboard/asset-dashboard.component';
import { AssetRevaluationComponent } from './asset-revaluation/asset-revaluation.component';

const routes: Routes = [
  {
    path: '',
    component: AssetManagementComponent,
    children: [
      // {
      //   path: 'depreciation',
      //   loadChildren: () =>
      //     import('./depreciation-forecast/depreciation-forecast.module').then(
      //       (m) => m.DepreciationForecastModule
      //     ),
      // },
      {
        path:'asset-list',
        canActivate:[AuthGuard],
        loadChildren:()=>
          import('./asset-list/asset-list.module').then(
            (m) => m.AssetListModule
          )
      },
      {
        path:'depreciation-master',
        canActivate:[AuthGuard],
        loadChildren:()=>
          import('./company-depreciation-maste/company-depreciation-maste.module').then(
            (m) => m.CompanyDepreciationMasteModule
          )
      },
      {
        path: 'warranty-list',
        loadChildren: () => import('../asset-warranty/asset-warranty.module').then(
          m => m.AssetWarrantyModule)
      },
      {
        path: 'maintenance',
        loadChildren: () => import('../asset-maintenance/asset-maintenance.module').then(
          m => m.AssetMaintenanceModule)
      },
      {
        path: 'asset-allocate-list',
        loadChildren: () => import('../asset-management/asset-allocated-list/asset-allocated-list.module').then(
          m => m.AssetAllocatedListModule)
      },
      {
        path: 'writeoff-asset-approval',
        loadChildren: () => import('../asset-management/asset-write-off-approval/asset-write-off-approval.module').then(
          m => m.AssetWriteOffApprovalModule)
      },
      {
        path: 'sale-asset-approval',
        loadChildren: () => import('../asset-management/asset-sold-approval/asset-sold-approval.module').then(
          m => m.AssetSoldApprovalModule)
      },
      
      {path:'asset-sale-writeoff',component:AssetSaleWriteoffComponent},
      // {path:'writeoff-asset-approval',component:AssetSaleWriteoffComponent},
      // {path:'sale-asset-approval',component:AssetSaleWriteoffComponent},
      {path:'asset-revaluation',component:AssetRevaluationComponent},
      {path:'asset-transfer-note',component:AssetTransferNodeListComponent},
      {path:'asset-dashboard',component:AssetDashboardComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetManagementRoutingModule { }
