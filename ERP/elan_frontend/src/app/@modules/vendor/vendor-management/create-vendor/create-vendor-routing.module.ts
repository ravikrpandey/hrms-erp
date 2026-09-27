import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateVendorComponent } from './create-vendor.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { DocumentsComponent } from './documents/documents.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { AccountPayleComponent } from './account-payble-detail/account-payle/account-payle.component';
import { TdsSectionsComponent } from '../tds-sections/tds-sections.component';
import { VendorAddressComponent } from './vendor-address/vendor-address.component';
import { VendorAdvanceAmountComponent } from './vendor-advance-amount/vendor-advance-amount.component';

const routes: Routes = [
  {
    path: '',
    component: CreateVendorComponent,
    children: [
      {
        path: '',
        redirectTo: 'basic-details',
        pathMatch: 'full',
      },
      {
        path: 'basic-details',
        component: BasicDetailsComponent,
      },
      {
        path: 'bank-details',
        component: BankDetailsComponent,
      },
      {
        path: 'address',
        component: VendorAddressComponent,
      },
      {
        path: 'documents',
        component: DocumentsComponent,
      },
      {
        path: 'account-payble',
        component:AccountPayleComponent,
      },  
      {
        path: 'tds-sections',
        component:TdsSectionsComponent,
      }, 
      {
        path: 'vendor-advance-amount',
        component:VendorAdvanceAmountComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateVendorRoutingModule {}
