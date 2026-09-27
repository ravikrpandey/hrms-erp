import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TotalInventoryListComponent } from './total-inventory-list/total-inventory-list.component';;
import { SerialAllocationComponent } from './serial-allocation/serial-allocation.component';
import { BatchAllocationComponent } from './batch-allocation/batch-allocation.component';
import { TotalInventoryComponent } from './total-inventory.component';
import { DashboardComponent } from './dashboard/dashboard.component';
const routes: Routes = [
  {
    path:'', component:TotalInventoryComponent,
    children:[
      {
        path: '', redirectTo: 'total-inventory-list', pathMatch: 'full'
      },
      {
        path: 'total-inventory-list',
        component: TotalInventoryListComponent
      },
      {
        path: 'batch-allocation',
        component: BatchAllocationComponent
      },
      {
        path: 'serial-allocation',
        component: SerialAllocationComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotalInventoryRoutingModule { }
