import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { BankRecieptComponent } from './bank-reciept/bank-reciept.component';
import { BankPaymentComponent } from './bank-payment/bank-payment.component';
import { BankTransferComponent } from './bank-transfer/bank-transfer.component';
import { ChequeReturnComponent } from './cheque-return/cheque-return.component';
import { CashReceiptComponent } from './cash-receipt/cash-receipt.component';
import { CashPaymentComponent } from './cash-payment/cash-payment.component';
import { AdjustmentJournalComponent } from './adjustment-journal/adjustment-journal.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { SalesJournalComponent } from './sales-journal/sales-journal.component';
import { AddSalesJournalComponent } from './sales-journal/add-sales-journal/add-sales-journal.component';
import { PurchaseJournalComponent } from './purchase-journal/purchase-journal.component';
import { AddPurchaseJournalComponent } from './purchase-journal/add-purchase-journal/add-purchase-journal.component';
import { AddBankRecieptComponent } from './bank-reciept/add-bank-reciept/add-bank-reciept.component';
import { AddBankPaymentComponent } from './bank-payment/add-bank-payment/add-bank-payment.component';
import { AddCashRecieptComponent } from './cash-receipt/add-cash-reciept/add-cash-reciept.component';
import { AddCashPaymentComponent } from './cash-payment/add-cash-payment/add-cash-payment.component';
import { ServiceVoucherComponent } from './service-voucher/service-voucher.component';
import { AddServiceVoucherComponent } from './service-voucher/add-service-voucher/add-service-voucher.component';
import { PurchaseServiceVoucherComponent } from './purchase-service-voucher/purchase-service-voucher.component';
import { AddPurchaseServiceVoucherComponent } from './purchase-service-voucher/add-purchase-service-voucher/add-purchase-service-voucher.component';

const routes: Routes = [
  {
    path:'payment-advice',component:TransactionsComponent
  },
  {
    path:'bank-receipt',component:BankRecieptComponent
  },
  {
    path:'bank-payment',component:BankPaymentComponent
  },
  {
    path:'bank-transfer',component:BankTransferComponent
  },
  {
    path:'cheque-return',component:ChequeReturnComponent
  },
   {
    path:'cash-receipt',component:CashReceiptComponent
  },
  {
    path:'cash-payment',component:CashPaymentComponent
  },
  {
    path:'adjustment-journal',component:AdjustmentJournalComponent
  },
  {
    path:'sales-journal',component:SalesJournalComponent
  },
  {
    path:'add-transactions',component:AddTransactionComponent
  },
  {
    path:'add-sales-journal',component:AddSalesJournalComponent
  },
  {
    path:'purchase-journal',component:PurchaseJournalComponent
  },
  {
    path:'add-purchase-journal',component:AddPurchaseJournalComponent
  },
  {
    path:'purchase-service-voucher',component:PurchaseServiceVoucherComponent
  },
  {
    path:'add-purchase-service-voucher',component:AddPurchaseServiceVoucherComponent
  },
   {
    path:'add-bank-reciept',component:AddBankRecieptComponent
  },
    {
    path:'add-bank-payment',component:AddBankPaymentComponent
  },
  {
    path:'add-cash-reciept',component:AddCashRecieptComponent
  },
{
    path:'add-cash-payment',component:AddCashPaymentComponent
  },
  {
    path:'service-voucher',component:ServiceVoucherComponent
  },
{
    path:'add-service-voucher',component:AddServiceVoucherComponent
  },

  {
    path: 'transport-voucher',
    loadChildren: () => import('./transport-voucher/transport-voucher.module').then(m => m.TransportVoucherModule),
  },
  {
    path: 'adjustment-voucher',
    loadChildren: () => import('./adjustment-voucher/adjustment-voucher.module').then(m => m.AdjustmentVoucherModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
