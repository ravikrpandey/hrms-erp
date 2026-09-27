import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterVoucherListComponent } from './master-voucher-list/master-voucher-list.component';
import { AddVoucherMasterComponent } from './add-voucher-master/add-voucher-master.component';

const routes: Routes = [
  {
    path:'',component:MasterVoucherListComponent
  },
  {
    path:'add-master-voucher',component:AddVoucherMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterVoucherTypeRoutingModule { }
