import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

import { CreateVendorRoutingModule } from './create-vendor-routing.module';
import { CreateVendorComponent } from './create-vendor.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { BankActionComponent } from './bank-details/bank-action/bank-action.component';

import { DocumentsComponent } from './documents/documents.component';
import { RejectRemarkComponent } from './reject-remark/reject-remark.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { BankDailogComponent } from './bank-details/bank-dailog/bank-dailog.component';
import { CountryPipe } from 'src/app/@shared/pipe/filterPipes/country.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AccountPayleComponent } from './account-payble-detail/account-payle/account-payle.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { VendorAddressComponent } from './vendor-address/vendor-address.component';
import { VendorAdvanceAmountComponent } from './vendor-advance-amount/vendor-advance-amount.component';


@NgModule({
  declarations: [
    CreateVendorComponent,
    BasicDetailsComponent,
    BankDetailsComponent, 
    DocumentsComponent,
    RejectRemarkComponent,
    BankActionComponent,
    BankDailogComponent,
    CountryPipe,
    AccountPayleComponent,
    VendorAddressComponent,
    VendorAdvanceAmountComponent

  ],
  imports: [
    CommonModule,
    CreateVendorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AgGridModule,
    MatSelectFilterModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ShairedModule,
    AsyncPipe,
    NgxIntlTelInputModule,


  ],
  
})
export class CreateVendorModule { }
