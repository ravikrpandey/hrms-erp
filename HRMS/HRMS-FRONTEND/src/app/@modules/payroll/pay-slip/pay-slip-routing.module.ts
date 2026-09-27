import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaySlipListComponent } from './pay-slip-list/pay-slip-list.component';
import { PaySlipDetailComponent } from './pay-slip-detail/pay-slip-detail.component';
import { PaySlipProcessedComponent } from './pay-slip-processed/pay-slip-processed.component';
import { SaleryUpdatedEmpComponent } from './salery-updated-emp/salery-updated-emp.component';
import { PendingPaySlipComponent } from './pending-pay-slip/pending-pay-slip.component';

const routes: Routes = [
  {
    path: '', component: PendingPaySlipComponent,
  },
  {
    path: 'hold-slip-detail', component: PaySlipListComponent,
  },
  {
    path: 'processed', component: PaySlipProcessedComponent,
  },
  {
    path: 'pay-slip-detail', component: PaySlipDetailComponent,
  },

  {
    path: 'salery-update', component: SaleryUpdatedEmpComponent,
  },
  {
    path: 'pending-payslip', component: PendingPaySlipComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaySlipRoutingModule { }
