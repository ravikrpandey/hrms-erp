import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { BillingComponent } from './billing/billing.component';
import { AddressInformationComponent } from './address-information/address-information.component';
import { DirectoryComponent } from './directory/directory.component';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { DocumentsComponent } from './documents/documents.component';
import { LedgerComponent } from './ledger/ledger.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CustomerDetailsComponent } from './customer-details.component';
import { customerDeliveryComponent } from './customerDelivery/customerDelivery.component';
import { BankComponent } from './bank/bank.component';
import { CustomerProductPriceComponent } from './customer-product-price/customer-product-price.component';
import { ApproveCustomerComponent } from './approve-customer/approve-customer.component';
import { AccountPayableDetailsComponent } from './account-payable-details/account-payable-details.component';
import { CustomerItemNameListComponent } from './customer-item-name-list/customer-item-name-list.component';
import { AdvanceCustomerComponent } from './advance-customer/advance-customer.component';
import { SuspenseAccountListComponent } from './suspense-account-customer/suspense-account-list/suspense-account-list.component';
const routes: Routes = [
  {
    path: '',
    component: CustomerDetailsComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'billing',
        component: BillingComponent,
      },
      {
        path: 'bank',
        component: BankComponent,
      },
      {
        path: 'customer-delivery',
        component: customerDeliveryComponent,
      },
      {
        path: 'address',
        component: AddressInformationComponent,
      },
      {
        path: 'directory',
        component: DirectoryComponent,
      },
      {
        path: 'business-details',
        component: BusinessDetailsComponent,
      },
      {
        path: 'documents',
        component: DocumentsComponent,
      },
      {
        path: 'ledger',
        component: LedgerComponent,
      },
      {
        path: 'invoice',
        component: InvoiceComponent,
      },
      {
        path: 'customer-product-price',
        component: CustomerProductPriceComponent,
      },
      {
        path: 'customer-item-name',
        component: CustomerItemNameListComponent,
      },
      {
        path: 'approve-customer',
        component: ApproveCustomerComponent,
      },
      {
        path:'account-receivable-details',component:AccountPayableDetailsComponent
      } ,
      {
        path:'advance-customer',component:AdvanceCustomerComponent
      },
     
     
    ],

  },
  {
    path: 'suspense-account-customer',
    loadChildren: () =>
      import('./suspense-account-customer/suspense-account-customer.module')
        .then(m => m.SuspenseAccountCustomerModule),
  },   
 
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerDetailsRoutingModule {}
