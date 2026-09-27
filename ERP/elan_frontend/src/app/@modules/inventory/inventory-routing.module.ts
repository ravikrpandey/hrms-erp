import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { TotalInventoryComponent } from './total-inventory/total-inventory.component';
import { MaterialRequestApprovalComponent } from './material-request-approval/material-request-approval.component';
const routes: Routes = [
  {
    path: '', component: InventoryComponent,
    children: [
      {
        path: 'total-inventory',
        loadChildren: () =>
          import('./total-inventory/total-inventory.module').then(
            (m) => m.TotalInventoryModule
          ),
      },
      {
        path: 'inventory-allocation',
        loadChildren: () =>
          import('./production-inventory-allocation/production-inventory-allocation.module').then(
            (m) => m.ProductionInventoryAllocationModule
          ),
      },
      {
        path: 'store-management',
        loadChildren: () =>
          import('./store-management/store-management.module').then(
            (m) => m.StoreManagementModule
          ),
      },
      {
        path: 'material-request-list',
        loadChildren: () =>
          import('./material-request/material-request.module').then(
            (m) => m.MaterialRequestModule
          ),
      },
      { path: 'material-request-approval', component: MaterialRequestApprovalComponent,}
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }