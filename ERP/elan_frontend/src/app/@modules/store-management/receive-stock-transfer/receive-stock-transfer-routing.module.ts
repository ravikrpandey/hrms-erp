import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiveStockTransferComponent } from './receive-stock-transfer.component';
import { CreateReceiveStockTransferComponent } from './create-receive-stock-transfer/create-receive-stock-transfer.component';

const routes: Routes = [
  {path:'',component:ReceiveStockTransferComponent},
  {path:'create-receive-stock-transfer',component:CreateReceiveStockTransferComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiveStockTransferRoutingModule { }
