import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionBatchAllocationComponent } from './production-batch-allocation/production-batch-allocation.component';
import { ProductionSerialAllocationComponent } from './production-serial-allocation/production-serial-allocation.component';
import { ProductionTotalInventoryListComponent } from './production-total-inventory-list/production-total-inventory-list.component';
import { ProductionInventoryAllocationComponent } from './production-inventory-allocation.component';
import { ViewProductionInventoryComponent } from './view-production-inventory/view-production-inventory.component';
const routes: Routes = [
  {
    path:'', component:ProductionInventoryAllocationComponent,
    children:[
      {
        path: '', redirectTo: 'production-total-inventory-list', pathMatch: 'full'
      },
      {
        path: 'production-total-inventory-list',
        component: ProductionTotalInventoryListComponent
      },
      {
        path: 'production-batch-allocation',
        component: ProductionBatchAllocationComponent
      },
      {
        path: 'production-serial-allocation',
        component: ProductionSerialAllocationComponent
      },
      {
        path: 'view-production-inventory',
        component: ViewProductionInventoryComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionInventoryAllocationRoutingModule { }
