import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseManagementComponent } from './purchase-management.component';
import { ChaListComponent } from './cha-list/cha-list.component';
import { ForwarderListComponent } from './forwarder-list/forwarder-list.component';
import { ChaForwarderFormComponent } from './cha-forwarder-form/cha-forwarder-form.component';
import { GateInwardListComponent } from './gate-inward-list/gate-inward-list.component';
import { TransportListComponent } from './transport-list/transport-list.component';
import { VendorAgingReportComponent } from './vendor-aging-report/vendor-aging-report.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseManagementComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./purchase-dashboard/purchase-dashboard.module').then(
            (m) => m.PurchaseDashboardModule,
          ),
      },
      {
        path: 'purchase-request',
        loadChildren: () =>
          import('./purchase-request/purchase-request.module').then(
            (m) => m.PurchaseRequestModule,
          ),
      },
      {
        path: 'rfp',
        loadChildren: () => import('./rfp/rfp.module').then((m) => m.RfpModule),
      },
      {
        path: 'purchase-order',
        loadChildren: () =>
          import('./purchase-order/purchase-order.module').then(
            (m) => m.PurchaseOrderModule,
          ),
      },
      {
        path: 'vendor-quotation',
        loadChildren: () =>
          import('./vendor-quotation-approval/vendor-quotation-approval.module').then(
            (m) => m.VendorQuotationApprovalModule,
          ),
      },
      {
        path: 'negotiation',
        loadChildren: () =>
          import('./negotiation/negotiation.module').then(
            (m) => m.NegotiationModule,
          ),
      },
      {
        path: 'shipping-alert',
        loadChildren: () =>
          import('./shipping-alert/shipping-alert.module').then(
            (m) => m.ShippingAlertModule,
          ),
      },
      {
        path: 'forwarder-list',
        loadChildren: () =>
          import('./forwarder-list/forwarder-list.module').then(
            (m) => m.ForwarderListModule,
          ),
      },
      {
        path: 'transport-list',
        loadChildren: () =>
          import('./transport-list/transport-list.module').then(
            (m) => m.TransportListModule,
          ),
      },
      {
        path: 'cha-list',
        loadChildren: () =>
          import('./cha-list/cha-list.module').then((m) => m.CHAListModule),
      },
      { path: 'cha-forwarder-form', component: ChaForwarderFormComponent },
      { path: 'gateinward-list', component: GateInwardListComponent },
      {
        path: 'purchase-reports/vendor-aging',
        component: VendorAgingReportComponent,
      },
      {
        path: 'grn',
        loadChildren: () => import('./grn/grn.module').then((m) => m.GrnModule),
      },
      {
        path: 'invoice',
        loadChildren: () =>
          import('./invoice/invoice.module').then((m) => m.InvoiceModule),
      },
      {
        path: 'invoice-payment',
        loadChildren: () =>
          import('./invoice-payment/invoice-payment.module').then(
            (m) => m.InvoicePaymentModule,
          ),
      },
      {
        path: 'purchase-return',
        loadChildren: () =>
          import('./purchase-return/purchase-return.module').then(
            (m) => m.PurchaseReturnModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseManagementRoutingModule {}
