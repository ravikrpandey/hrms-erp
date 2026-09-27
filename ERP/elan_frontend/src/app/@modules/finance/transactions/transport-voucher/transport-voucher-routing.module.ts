import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportVoucherListComponent } from './transport-voucher-list/transport-voucher-list.component';
import { AddTransportVoucherComponent } from './add-transport-voucher/add-transport-voucher.component';
import { DownloadTransportVoucherComponent } from './download-transport-voucher/download-transport-voucher.component';

const routes: Routes = [
  {
    path:'',component:TransportVoucherListComponent
  },
  {
    path:'add-transport-voucher',component:AddTransportVoucherComponent
  },
   {
    path:'download-transport-voucher',component:DownloadTransportVoucherComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportVoucherRoutingModule { }
