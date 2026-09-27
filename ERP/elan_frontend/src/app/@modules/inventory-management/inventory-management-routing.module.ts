import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryManagementComponent } from './inventory-management.component';
import { InventoryDashboardComponent } from './inventory-dashboard/inventory-dashboard.component';
import { InventoryStockListComponent } from './inventory-stock-list/inventory-stock-list.component';
import { InventoryLedgerListComponent } from './inventory-ledger-list/inventory-ledger-list.component';
import { AddDirectInventoryComponent } from './add-direct-inventory/add-direct-inventory.component';

const routes: Routes = [
  {
    path: '', component: InventoryManagementComponent,
    children: [
      { path: 'dashboard', component: InventoryDashboardComponent },
      { path: 'stock-list',
        children: [
          {
            path: '',
            component: InventoryStockListComponent
          },
          {
            path: 'inventory-ledger',
            component: InventoryLedgerListComponent
          },
          {
            path: 'add-inventory',
            component: AddDirectInventoryComponent
          }
        ] 
      },
      { path: 'warehouse', loadChildren: () => import('./warehouse/warehouse.module').then(m => m.WarehouseModule) },
      { path: 'warehouse-bifurcation', loadChildren: () => import('./warehouse-bifurcation/warehouse-bifurcation.module').then(m => m.WarehouseBifurcationModule) },
      { path: 'add-stock', loadChildren: () => import('./add-stock/add-stock.module').then(m => m.AddStockModule) },
      { path: 'stock-acknowledgement', loadChildren: () => import('./stock-acknowledgement/stock-acknowledgement.module').then(m => m.StockAcknowledgementModule) },
      { path: 'total-fg', loadChildren: () => import('./total-fg/total-fg.module').then(m => m.TotalFgModule) },
      { path: 'stock-in-transit', loadChildren: () => import('./stock-in-transit/stock-in-transit.module').then(m => m.StockInTransitModule) },
    ]
  },
  { path: 'stock-transfer', loadChildren: () => import('./stock-transfer/stock-transfer.module').then(m => m.StockTransferModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryManagementRoutingModule { }
