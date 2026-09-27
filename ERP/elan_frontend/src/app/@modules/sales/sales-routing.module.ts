import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesComponent } from './sales.component';
import { DiscountRequestComponent } from '../crm/pages/proposal/discount-request/discount-request.component';
import { ClosedDealsComponent } from '../crm/pages/proposal/closed-deals/closed-deals.component';
import { AllProposalComponent } from '../crm/pages/proposal/all-proposal/all-proposal.component';
import { LeadSummaryComponent } from '../crm/pages/lead-summary/lead-summary.component';
import { QuotationComponent } from './quotation/quotation.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { ExistingCustomerComponent } from './customer-list/existing-customer/existing-customer.component';
import { ProductionListComponent } from './production-list/production-list.component';
import { AddDoComponent } from './production-list/add-do/add-do.component';
import { ViewOrderComponent } from './production-list/view-order/view-order.component';
import { DOHistoryComponent } from './production-list/do-history/do-history.component';
import { SalesDashboardComponent } from './sales-dashboard/sales-dashboard.component';
import { SalesInvoiceListComponent } from './sales-invoice/sales-invoice-list/sales-invoice-list.component';
import { CreateSalesInvoiceComponent } from './sales-invoice/create-sales-invoice/create-sales-invoice.component';
import { DeliveryChallanListComponent } from './delivery-challan-list/delivery-challan-list.component';
import { CreateDeliveryChallanComponent } from './create-delivery-challan/create-delivery-challan.component';
import { ApprovedSalesInvoiceListComponent } from './sales-invoice/approved-sales-invoice-list/approved-sales-invoice-list.component';
import { AllDoList } from './delivery-order-management/all-do-list/all-do-list.component';
import { EWayList } from './delivery-order-management/e-way-do-list/e-way-do-list.component';
import { GenerateIRN } from './delivery-order-management/generateIrn/generate-irn.component';
import { GenerateEwayComponent } from './sales-invoice/generate-eway/generate-eway.component';
import { ViewEwayChallanComponent } from './delivery-order-management/e-way-do-list/view-eway-challan/view-eway-challan.component';
import { CreateDirectDeliveryChallanComponent } from './create-direct-delivery-challan/create-direct-delivery-challan.component';
import { CreateDirectEwayComponent } from './create-direct-eway/create-direct-eway.component';
import { CreateDirectInvoiceComponent } from './sales-invoice/create-direct-invoice/create-direct-invoice.component';
import { BankComponent } from './customer-details/bank/bank.component';
import { DefineCreditLimitComponent } from './customer-details/define-credit-limit/define-credit-limit.component';
import { ProspectListComponent } from './prospect-list/prospect-list.component';
import { CreateProposalComponent } from '../crm/pages/proposal/create-proposal/create-proposal.component';
import { CreateProposalNewComponent } from '../crm/pages/proposal/create-proposal-new/create-proposal.component';
import { ViewDeliveryChallanComponent } from './production-list/view-delivery-challan/view-delivery-challan.component';
import { CreateCreditLimitComponent } from './customer-details/define-credit-limit/create-credit-limit/create-credit-limit.component';
import { CustomerAgingReportComponent } from './customer-aging-report/customer-aging-report.component';
import { CollectionReportsComponent } from './collection-reports/collection-reports.component';
import { CustomerAgingListComponent } from './customer-aging-report/customer-aging-list/customer-aging-list.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent,
    children: [
      {
        path: 'discount-request',
        component: DiscountRequestComponent,
      },
      {
        path: 'closed-deals',
        component: ClosedDealsComponent,
      },
      {
        path: 'all-proposal',
        component: AllProposalComponent,
      },
      {
        path: 'quotation',
        component: QuotationComponent,
      },
      {
        path: 'customer-list/customer-list',
        component: CustomerListComponent,
      },
      {
        path: 'customer-list/prospect-list',
        component: ProspectListComponent,
      },
      {
        path: 'customer-list/define-credit-limit',
        component: DefineCreditLimitComponent,
      },

      {
        path: 'customer-list/add-credit-limit',
        component: BankComponent //CreateCreditLimitComponent
      },

      {
        path: 'add-existing-customer',
        component: ExistingCustomerComponent,
      },
      {
        path: 'sales-order-list',
        component: ProductionListComponent,
      },
      {
        path: 'add-DO',
        component: AddDoComponent,
      },
      {
        path: 'view-order',
        component: ViewOrderComponent,
      },
      {
        path:'view-delivery-challan',
        component:ViewDeliveryChallanComponent
      },
      {
        path: 'DO-history',
        component: DOHistoryComponent,
      },
      {
        path: 'dashboard',
        component: SalesDashboardComponent,
      },
      {
        path: 'sales-invoice-list',
        component: SalesInvoiceListComponent,
      },
      {
        path: 'approved-sales-invoice-list',
        component: ApprovedSalesInvoiceListComponent,
      },
      {
        path: 'create-sales-invoice',
        component: CreateSalesInvoiceComponent,
      },
      {
        path: 'delivery-challan',
        component: DeliveryChallanListComponent,
      },
      {
        path: 'create-delivery-challan',
        component: CreateDeliveryChallanComponent,
      },
      {
        path: 'create-direct-delivery-challan',
        component: CreateDirectDeliveryChallanComponent,
      },
      {
        path: 'delivery-challan-list',
        component: AllDoList,
      },
      {
        path: 'delivery-e-way-list',
        component: EWayList,
      },
      {
        path: 'create-direct-eway',
        component: CreateDirectEwayComponent,
      },
      {
        path: 'create-direct-invoice',
        component: CreateDirectInvoiceComponent,
      },
      {
        path: 'view-delivery-e-way',
        component: ViewEwayChallanComponent,
      },
      {
        path: 'generate-IRN',
        component: GenerateIRN,
      },
      {
        path: 'generate-e-way-bill',
        component: GenerateEwayComponent,
      },
      {
        path: 'customer-list',
        loadChildren: () =>
          import('./customer-details/customer-details.module').then(
            (m) => m.CustomerAllDetailsModule
          ),
      },
      {
        path: 'customer-details',
        loadChildren: () =>
          import('./customer-details/customer-details.module').then(
            (m) => m.CustomerAllDetailsModule
          ),
      },
    
      {
        path: 'so',
        loadChildren: () => import('./so/so.module').then((m) => m.SoModule),
      },
      {
        path: 'proforma-invoice',
        loadChildren: () =>
          import(
            '../../../app/@modules/crm/pages/proforma-invoice/proforma-invoice.module'
          ).then((m) => m.ProformaInvoiceModule),
      },
      {
        path: 'sales-booking',
        loadChildren: () =>
          import(
            '../../../app/@modules/crm/pages/sales-booking/sales-booking.module'
          ).then((m) => m.SalesBookingModule),
      },
      {
        path: 'create-proposal',
        component: CreateProposalComponent,
      },
      {
        path: 'create-proposal-new',
        component: CreateProposalNewComponent,
      },

      {
        path: 'invoice-list',
        loadChildren: () =>
          import(
            '../../../app/@modules/sales/invoice/invoice.module'
          ).then((m) => m.InvoiceModule),
      },
      {
        path: 'return',
        loadChildren: () =>
          import(
            '../../../app/@modules/sales/sales-return/sales-return.module'
          ).then((m) => m.SalesReturnModule),
      },

      {
        path:'report/customer-aging-reports', component:CustomerAgingReportComponent
      },
      { path: 'report/customer-aging/:id', component: CustomerAgingListComponent },

      {
        path:'report/collection-reports', component:CollectionReportsComponent
      }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
