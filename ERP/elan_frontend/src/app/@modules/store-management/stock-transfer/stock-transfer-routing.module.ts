import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockTransferComponent } from './stock-transfer.component';
import { CreateStockTransferComponent } from './create-stock-transfer/create-stock-transfer.component';

const routes: Routes = [
  {path:'',component:StockTransferComponent},
  {path:'create-stock-transfer',component: CreateStockTransferComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockTransferRoutingModule { }
