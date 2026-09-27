import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreManagementComponent } from './store-management.component';

const routes: Routes = [
  {
    path: '', component: StoreManagementComponent,
    children: [
      {
        path: 'store',
        loadChildren: () => import('./store/store.module').then(m => m.StoreModule),
      },
      {
        path: 'stock-dashboard',
        loadChildren: () => import('./store-dashboard/store-dashboard.module').then(m => m.StoreDashboardModule),
      },
      {
        path: 'goods-inventory',
        loadChildren: () => import('./goods-inventory/goods-inventory.module').then(m => m.GoodsInventoryModule),
      },
      {
        path: 'stock-transfer',
        loadChildren: () => import('./stock-transfer/stock-transfer.module').then(m => m.StockTransferModule),
      },
      {
        path: 'receive-stock-transfer',
        loadChildren: () => import('./receive-stock-transfer/receive-stock-transfer.module').then(m => m.ReceiveStockTransferModule),
      },
      {
        path: 'store-stock-acknowledge',
        loadChildren: () => import('./store-stock-acknowledge/store-stock-acknowledge.module').then(m => m.StoreStockAcknowledgeModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreManagementRoutingModule { }
