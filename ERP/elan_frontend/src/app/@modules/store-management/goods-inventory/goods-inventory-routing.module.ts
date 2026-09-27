import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsInventoryComponent } from './goods-inventory.component';
import { AddGoodsInventoryComponent } from './add-goods-inventory/add-goods-inventory.component';
import { ItemlistDialogComponent } from './view-details/itemlist-dialog/itemlist-dialog.component';

const routes: Routes = [
  {
    path:'',component:GoodsInventoryComponent
  },
  {
    path:'add-goods-inventory',component:AddGoodsInventoryComponent
  },
  {
    path:'item-details',component:ItemlistDialogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoodsInventoryRoutingModule { }
