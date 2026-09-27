import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WareHouseManagementComponent } from './ware-house-management.component';
import { DispatchListComponent } from './dispatch-list/dispatch-list.component';
import { DispatchedProductComponent } from './dispatch-list/dispatched-product/dispatched-product.component';
import { DispatchListFormComponent } from './dispatch-list/dispatch-list-form/dispatch-list-form.component';
import { OrderDispatchDetailsViewComponent } from './dispatch-list/order-dispatch-details-view/order-dispatch-details-view.component';
import { StockTransferNewComponent } from './stock-transfer-new/stock-transfer-new.component';
import { AddStockTransferComponent } from './stock-transfer-new/add-stock-transfer/add-stock-transfer.component';
import { ProceedToDispatchComponent } from './dispatch-list/proceed-to-dispatch/proceed-to-dispatch.component';
import { DeliveryListComponent } from './delivery-management/delivery-list.component';
import { AcknowledgePlanningComponent } from './acknowledge-planning/acknowledge-planning.component';

const routes: Routes = [
  {
    path: '', component: WareHouseManagementComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./inventory-dashboard/inventory-dashboard.module').then(m => m.InventoryDashboardModule),
      },

      { path: 'warehouse', loadChildren: () => import('../inventory-management/warehouse/warehouse.module').then(m => m.WarehouseModule) },
      { path: 'warehouse-bifurcation', loadChildren: () => import('../inventory-management/warehouse-bifurcation/warehouse-bifurcation.module').then(m => m.WarehouseBifurcationModule) },
      {
        path: 'add-stock',
        loadChildren: () => import('../inventory-management/add-stock/add-stock.module').then(m => m.AddStockModule)
      },
      { path: 'stock-acknowledgement', loadChildren: () => import('../inventory-management/stock-acknowledgement/stock-acknowledgement.module').then(m => m.StockAcknowledgementModule) },
      { path: 'total-fg', loadChildren: () => import('../inventory-management/total-fg/total-fg.module').then(m => m.TotalFgModule) },
      // {
      //   path: 'warehouse-bifurcation',
      //   loadChildren: () => import('./warehouse-management-system/warehouse-management-system.module').then(m => m.WarehouseManagementSystemModule),
      // },
      // {
      //   path: 'stock-transfer',
      //   loadChildren: () => import('./stock-transfer/stock-transfer.module').then(m => m.StockTransferModule),
      // },
      {
        path: 'receive-stock-transfer',
        loadChildren: () => import('./receive-stock-transfer/receive-stock-transfer.module').then(m => m.ReceiveStockTransferModule),
      },
      {
        path: 'goods-inventory',
        loadChildren: () => import('./goods-inventory/goods-inventory.module').then(m => m.GoodsInventoryModule),
      },
      // {
      //   path: 'add-stock',
      //   loadChildren: () => import('./addstock/addstock.module').then(m => m.AddstockModule)
      // },
      {
        path: 'dispatch',
        component: DispatchListComponent
      },
      {
        path: 'dispatched-product',
        component: DispatchedProductComponent
      },
      {
        path: 'dispatch-list-form/:order_no_id',
        component: DispatchListFormComponent
      },
      {
        path: 'order-dispatch-details-view',
        component: OrderDispatchDetailsViewComponent
      },
      {
        path: 'dispatch-list-form',
        component: DispatchListFormComponent
      },
      {
        path: 'proceed-to-dispatch',
        component: ProceedToDispatchComponent  // old stock
      },
      {
        path: 'stock-transfer',
        component: StockTransferNewComponent  // new stock transfer
      },
      // {
      //   path: 'create-stock-transfer',
      //   component: CreateStockTransferComponent  // old
      // },
      {
        path: 'create-stock-transfer',
        component: AddStockTransferComponent  // new
      },
      { path: 'vehicle-planning', loadChildren: () => import('./vehicle-planning/vehicle-planning.module').then(m => m.VehiclePlanningModule) },
      { path: 'gate-inward-outward', loadChildren: () => import('./gate-inward-outward/gate-inward-outward.module').then(m => m.GateInwardOutwardModule), data: { label: 'inward' } },
      { path: 'get-out-word', loadChildren: () => import('./gate-inward-outward/gate-inward-outward.module').then(m => m.GateInwardOutwardModule), data: { label: 'outward' } },
      { path: 'pick-list', loadChildren: () => import('./pick-list/pick-list.module').then(m => m.PickListModule) },
      { path: 'lorry-receipt', loadChildren: () => import('./lorry-receipt/lorry-receipt.module').then(m => m.LorryReceiptModule) }
      , {
        path: 'delivery-list',
        component: DeliveryListComponent
      },
      { path: 'acknowledge', component: AcknowledgePlanningComponent },
      {
        path: 'generate-irn',
        loadChildren: () => import('./generate-irn/generate-irn.module').then(m => m.GenerateIrnModule),
      },
      {
        path: 'e-invoice-list',
        loadChildren: () => import('./e-invoice/e-invoice.module').then(m => m.EInvoiceModule

        ),
      },
      // {
      //   path: 'e-way-list',
      //   loadChildren: () => import('./e-way/e-way.module').then(m => m.EWayModule),
      // },
      { 
        path: 'e-way-list',
        loadChildren: () => import('./e-way-list/e-way-list.module').then(m => m.EWayListModule) 
      }, 
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WareHouseManagementRoutingModule { }
