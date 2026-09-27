import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankReceiptVoucherListComponent } from './bank-receipt-voucher-list/bank-receipt-voucher-list.component';

const routes: Routes = [
  {
    path:'',component:BankReceiptVoucherListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankReceiptVoucherRoutingModule { }
