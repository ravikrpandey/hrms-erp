import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerDetailsRoutingModule } from './customer-details-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { BillingComponent } from './billing/billing.component';
import { AddressInformationComponent } from './address-information/address-information.component';
import { DirectoryComponent } from './directory/directory.component';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { DocumentsComponent } from './documents/documents.component';
import { LedgerComponent } from './ledger/ledger.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CustomerDetailsComponent } from './customer-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ComplaintModule } from '../../employee-self-service/complaint/complaint.module';
import { TimesheetModule } from '../../employee-self-service/timesheet/timesheet.module';
import { customerDeliveryComponent } from './customerDelivery/customerDelivery.component';
import { BankComponent } from './bank/bank.component';
import { CustomerProductPriceComponent } from './customer-product-price/customer-product-price.component';
import { DefineCreditLimitComponent } from './define-credit-limit/define-credit-limit.component';
import { DefineCreditLimitActionComponent } from './define-credit-limit/define-credit-limit-action/define-credit-limit-action.component';
import { ApproveCustomerComponent } from './approve-customer/approve-customer.component';
import { AccountPayableDetailsComponent } from './account-payable-details/account-payable-details.component';
import { CustomerItemNameListComponent } from './customer-item-name-list/customer-item-name-list.component';
import { CreateCreditLimitComponent } from './define-credit-limit/create-credit-limit/create-credit-limit.component';
import { AdvanceCustomerComponent } from './advance-customer/advance-customer.component';
@NgModule({
  declarations: [
    ProfileComponent,
    BillingComponent,
    customerDeliveryComponent,
    BankComponent,
    // ContactInformationComponent,
    AddressInformationComponent,
    DirectoryComponent,
    BusinessDetailsComponent,
    DocumentsComponent,
    LedgerComponent,
    InvoiceComponent,
    CustomerDetailsComponent,
    CustomerProductPriceComponent,
    DefineCreditLimitComponent,
    DefineCreditLimitActionComponent,
    ApproveCustomerComponent,
    AccountPayableDetailsComponent,
    CustomerItemNameListComponent,
    CreateCreditLimitComponent,
    AdvanceCustomerComponent
  ],
  imports: [
    CommonModule,
    CustomerDetailsRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSelectFilterModule,
    RouterOutlet,
    MaterialModule,
    MatDialogModule,
    MatCardModule,
    ComplaintModule,
    TimesheetModule,
    ShairedModule,
    MaterialModule,
    
  ]
})
export class CustomerAllDetailsModule { }
