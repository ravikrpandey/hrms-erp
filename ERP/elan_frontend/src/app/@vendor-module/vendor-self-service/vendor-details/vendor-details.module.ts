import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorDetailsRoutingModule } from './vendor-details-routing.module';
import { VendorDetailsComponent } from './vendor-details.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    VendorDetailsComponent,
    BasicDetailsComponent,
    BankDetailsComponent,
    DocumentDetailsComponent,
    AccountDetailsComponent
  ],
  imports: [
    CommonModule,
    VendorDetailsRoutingModule,
    MaterialModule,
    MatCardModule
  ]
})
export class VendorDetailsModule { }
