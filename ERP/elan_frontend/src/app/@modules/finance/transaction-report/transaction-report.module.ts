import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionReportRoutingModule } from './transaction-report-routing.module';
import { PaymentAdviseReportComponent } from './payment-advise-report/payment-advise-report.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { BankRecieptReportComponent } from './bank-reciept-report/bank-reciept-report.component';
import { BankPaymentReportComponent } from './bank-payment-report/bank-payment-report.component';
import { CashPaymentReportComponent } from './cash-payment-report/cash-payment-report.component';
import { CashRecieptReportComponent } from './cash-reciept-report/cash-reciept-report.component';


@NgModule({
  declarations: [
    PaymentAdviseReportComponent,
    BankRecieptReportComponent,
    BankPaymentReportComponent,
    CashPaymentReportComponent,
    CashRecieptReportComponent
  ],
  imports: [
    CommonModule,
    TransactionReportRoutingModule,
    MaterialModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    MatSelectFilterModule
  ]
})
export class TransactionReportModule { }
