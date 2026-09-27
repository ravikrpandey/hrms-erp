import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsInventoryComponent } from './goods-inventory.component';
import { AddGoodsInventoryComponent } from './add-goods-inventory/add-goods-inventory.component';

const routes: Routes = [
  {
    path:'',component:GoodsInventoryComponent
  },
  {
    path:'add-goods-inventory',component:AddGoodsInventoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsInventoryRoutingModule { }
