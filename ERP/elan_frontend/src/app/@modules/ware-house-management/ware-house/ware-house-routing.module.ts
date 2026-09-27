import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WareHouseComponent } from './ware-house.component';
import { CreateWarehouseComponent } from './create-warehouse/create-warehouse.component';
import { WarehousestoreComponent } from './warehousestore/warehousestore.component';

const routes: Routes = [
  { path: '', component: WareHouseComponent },
  { path: 'create-warehouse', component: CreateWarehouseComponent },
  { path: 'warehousestore', component: WarehousestoreComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WareHouseRoutingModule { }
