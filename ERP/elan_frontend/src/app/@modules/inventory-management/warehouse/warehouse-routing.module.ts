import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseComponent } from './warehouse.component';
import { CreateWarehouseComponent } from './create-warehouse/create-warehouse.component';

const routes: Routes = [
  { path: '', component: WarehouseComponent },
  { path: 'create', component: CreateWarehouseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
