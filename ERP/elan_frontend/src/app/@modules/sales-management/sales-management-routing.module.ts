import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesManagementComponent } from './sales-management.component';


const routes: Routes = [
  {
    path: '', component: SalesManagementComponent,
    children: [
      {
        path: 'proforma',
        loadChildren: () => import('./performa/performa-routing.module').then(m => m.PerformaRoutingModule)
      },
      {
        path: 'sales',
        loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule)
      },
      {
        path: 'delivery-order',
        loadChildren: () => import('./delivery-order/delivery-order.module').then(m => m.DeliveryOrderModule)
      },
      {
        path: 'record-payments',
        loadChildren: () => import('./record-payment/record-payment.module').then(m => m.RecordPaymentModule)
      },
      {
        path: 'quotation',
        loadChildren: () =>import('./quotations/quotations.module').then((m) => m.QuotationsModule),
      },
      {
        path: 'create-quotation',
        loadChildren: () =>import('././quotations/create-quotations/create-quotations.module').then((m) => m.CreateQuotationsModule),
      },
      {
        path: 'pending-quotations',
        loadChildren: () =>
          import('././quotations/pending-quotations/pending-quotations.module').then((m) => m.PendingQuotationsModule),
      },
      {
        path: 'approved-quotations',
        loadChildren: () =>
          import('././quotations/approved-quotations/approved-quotations.module').then((m) => m.ApprovedQuotationsModule),
      },
      {
        path: 'rejected-quotations',
        loadChildren: () =>import('././quotations/rejected-quotations/rejected-quotations.module').then((m) => m.RejectedQuotationsModule),
      },
     

    ]
  }




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesManagementRoutingModule { }
