import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
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
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { FinancialYearRoutingModule } from '../financial-year/financial-year-routing.module';
import { BankRecieptComponent } from './bank-reciept/bank-reciept.component';
import { BankPaymentComponent } from './bank-payment/bank-payment.component';
import { BankTransferComponent } from './bank-transfer/bank-transfer.component';
import { ChequeReturnComponent } from './cheque-return/cheque-return.component';
import { CashReceiptComponent } from './cash-receipt/cash-receipt.component';
import { CashPaymentComponent } from './cash-payment/cash-payment.component';
import { AdjustmentJournalComponent } from './adjustment-journal/adjustment-journal.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { SalesJournalComponent } from './sales-journal/sales-journal.component';
import { AddSalesJournalComponent } from './sales-journal/add-sales-journal/add-sales-journal.component';
import { PurchaseJournalComponent } from './purchase-journal/purchase-journal.component';
import { AddPurchaseJournalComponent } from './purchase-journal/add-purchase-journal/add-purchase-journal.component';
import { AddBankRecieptComponent } from './bank-reciept/add-bank-reciept/add-bank-reciept.component';
import { AddBankPaymentComponent } from './bank-payment/add-bank-payment/add-bank-payment.component';
import { PaymentAdviceActionComponent } from './add-transaction/payment-advice-action/payment-advice-action.component';
import { BankRecieptActionComponent } from './bank-reciept/bank-reciept-action/bank-reciept-action.component';
import { AddCashRecieptComponent } from './cash-receipt/add-cash-reciept/add-cash-reciept.component';
import { CashRecieptActionComponent } from './cash-receipt/cash-reciept-action/cash-reciept-action.component';
import { AddCashPaymentComponent } from './cash-payment/add-cash-payment/add-cash-payment.component';
import { CashPaymentActionComponent } from './cash-payment/cash-payment-action/cash-payment-action.component';
import { BankPaymentActionComponent } from './bank-payment/bank-payment-action/bank-payment-action.component';
import { ServiceVoucherComponent } from './service-voucher/service-voucher.component';
import { AddServiceVoucherComponent } from './service-voucher/add-service-voucher/add-service-voucher.component';
import { InvoiceDetailsComponent } from './add-transaction/invoice-details/invoice-details.component';
import { ServiceVoucherActionComponent } from './service-voucher/service-voucher-action/service-voucher-action.component';
import { PurchaseJournalActionsComponent } from './purchase-journal/purchase-journal-actions/purchase-journal-actions.component';
import { MatIconModule } from '@angular/material/icon';
import { PurchaseServiceVoucherComponent } from './purchase-service-voucher/purchase-service-voucher.component';
import { AddPurchaseServiceVoucherComponent } from './purchase-service-voucher/add-purchase-service-voucher/add-purchase-service-voucher.component';
import { PurchaseServiceActionComponent } from './purchase-service-voucher/purchase-service-action/purchase-service-action.component';
import { SalesJournalActionComponent } from './sales-journal/sales-journal-action/sales-journal-action.component';


@NgModule({
  declarations: [
    TransactionsComponent,
    BankRecieptComponent,
    BankPaymentComponent,
    BankTransferComponent,
    ChequeReturnComponent,
    CashReceiptComponent,
    CashPaymentComponent,
    AdjustmentJournalComponent,
    AddTransactionComponent,
    SalesJournalComponent,
    AddSalesJournalComponent,
    PurchaseJournalComponent,
    AddPurchaseJournalComponent,
    AddBankRecieptComponent,
    AddBankPaymentComponent,
    PaymentAdviceActionComponent,
    BankRecieptActionComponent,
    AddCashRecieptComponent,
    CashRecieptActionComponent,
    AddCashPaymentComponent,
    CashPaymentActionComponent,
    BankPaymentActionComponent,
    ServiceVoucherComponent,
    AddServiceVoucherComponent,
    InvoiceDetailsComponent,
    ServiceVoucherActionComponent,
    PurchaseJournalActionsComponent,
    PurchaseServiceVoucherComponent,
    AddPurchaseServiceVoucherComponent,
    PurchaseServiceActionComponent,
    SalesJournalActionComponent

  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    FinancialYearRoutingModule,
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
    MatSelectFilterModule,
    MatIconModule
  ]
})
export class TransactionsModule { }
