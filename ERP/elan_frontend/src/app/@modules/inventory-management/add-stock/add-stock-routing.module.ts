import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStockComponent } from './add-stock.component';
import { GrnWarehouseAllocationFormComponent } from './grn-warehouse-allocation-form/grn-warehouse-allocation-form.component';

const routes: Routes = [
  { path: '', component: AddStockComponent },
  { path: 'grn-warehouse-allocation', component: GrnWarehouseAllocationFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddStockRoutingModule { }
