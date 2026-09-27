import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdjustmentVoucherListComponent } from './adjustment-voucher-list/adjustment-voucher-list.component';
import { AddAdjustmentVoucherComponent } from './add-adjustment-voucher/add-adjustment-voucher.component';

const routes: Routes = [
  {
    path:'',component:AdjustmentVoucherListComponent
  },
  {
    path:'add-adjustment-voucher',component:AddAdjustmentVoucherComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdjustmentVoucherRoutingModule { }
