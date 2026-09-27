import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentAdviseReportComponent } from './payment-advise-report/payment-advise-report.component';
import { BankRecieptReportComponent } from './bank-reciept-report/bank-reciept-report.component';
import { BankPaymentReportComponent } from './bank-payment-report/bank-payment-report.component';
import { CashPaymentReportComponent } from './cash-payment-report/cash-payment-report.component';
import { CashRecieptReportComponent } from './cash-reciept-report/cash-reciept-report.component';

const routes: Routes = [
  {
    path:'payment-advice-report',component:PaymentAdviseReportComponent
  },
  {
    path:'bank-receipt-report',component:BankRecieptReportComponent
  },
  {
    path:'bank-payment-report',component:BankPaymentReportComponent
  },
   {
    path:'cash-payment-report',component:CashPaymentReportComponent
  }, 
  {
    path:'cash-reciept-report',component:CashRecieptReportComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionReportRoutingModule { }
