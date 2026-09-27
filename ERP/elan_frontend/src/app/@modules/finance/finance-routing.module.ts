import { ProfitCenterLedgerDetailedComponent } from './profit-center-ledger-detailed/profit-center-ledger-detailed.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceComponent } from './finance.component';
import { ChartAccountComponent } from './chart-account/chart-account.component';
import { AddChartAccountComponent } from './add-chart-account/add-chart-account.component';
import { ViewChartComponent } from './view-chart/view-chart.component';
import { PostingPeriodComponent } from './posting-period/posting-period.component';
import { AddPostingPeriodComponent } from './add-posting-period/add-posting-period.component';
import { BankMasterComponent } from './bank-master/bank-master.component';
import { AddBankComponent } from './add-bank/add-bank.component';
import { BankViewComponent } from './bank-view/bank-view.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { AddBankAccountComponent } from './add-bank-account/add-bank-account.component';
import { ViewBankAccountComponent } from './view-bank-account/view-bank-account.component';
import { BankClearenceComponent } from './bank-clearence/bank-clearence.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { BankRecancelationComponent } from './bank-recancelation/bank-recancelation.component';
import { BankReconciliationStatementComponent } from './bank-reconciliation-statement/bank-reconciliation-statement.component';
import { JournalLedgerComponent } from './journal-ledger/journal-ledger.component';
import { ReportsComponent } from './reports/reports.component';
import { ProfitAndLossComponent } from './profit-and-loss/profit-and-loss.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { FinanceDashboardComponent } from './finance-dashboard/finance-dashboard.component';
import { BankLedgerComponent } from './bank-ledger/bank-ledger.component';
import { VendorLedgerComponent } from './vendor-ledger/vendor-ledger.component';
import { CustomerLedgerComponent } from './customer-ledger/customer-ledger.component';
import { CostCenterLedgerComponent } from './cost-center-ledger/cost-center-ledger.component';
import { ProfitCenterLedgerComponent } from './profit-center-ledger/profit-center-ledger.component';
import { TdsRegisterComponent } from './tds-register/tds-register.component';
import { RefurbishedBankStatementComponent } from './refurbished-bank-reconciliation-statement/refurbished-bank-reconciliation-statement.component';
import { ProfitAndLossClearanceComponent } from './profit-and-loss-clearance/profit-and-loss-clearance.component';
import { VatClearanceComponent } from './vat-clearance/vat-clearance.component';
import { AdjustmentTrackingComponent } from './adjustment-tracking/adjustment-tracking.component';
// import { AddGstIoReportComponent } from './gst-report/add-gst-io-report/add-gst-io-report.component';
// import { PurchaseCreditNoteListComponent } from './gst-report/purchase-credit-note-list/purchase-credit-note-list.component';



// const routes: Routes = [{ path: '', component: FinanceComponent }];


const routes: Routes = [
  {
    path: '', component: FinanceComponent,
    children: [
      // {
      //   path: '', redirectTo: 'account-receivable', pathMatch: 'full'
      // },

      {
       path:'reports/trial-balance', component:TrialBalanceComponent
      },

      {
        path:'reports/general_ledger', component:JournalLedgerComponent
       }
,
{
path:'bank-accounting/bank_reconciliation-statement', component:BankReconciliationStatementComponent
},
{
  path:'bank-accounting/refurbished-bank-reconciliation', component:RefurbishedBankStatementComponent
 },
      {
        path:'bank-accounting/bank-account', component:BankAccountComponent
       },

       {
        path:'bank-accounting/bank-clearence', component:BankClearenceComponent
       },

       {
        path:'add-bank-account', component:AddBankAccountComponent
       },

       {
        path:'view-bank-account', component: ViewBankAccountComponent
       },

      {
        path:'bank-accounting/bank',component:BankMasterComponent
       },

       {
        path:'view-bank',component:BankViewComponent
       },

       {
        path:'reports/trail-balance-simple',component:ReportsComponent
       },

       {
        path:'add-bank', component: AddBankComponent
       },

      {
        path:'posting-period',component:PostingPeriodComponent
      },

      {
        path:'add-posting-period',component:AddPostingPeriodComponent
      },
{
  path:'account-charts',component:ChartAccountComponent
},

{
  path:'add-chart-account', component:AddChartAccountComponent
},

{
  path:'view-chart', component:ViewChartComponent
},


{
  path: 'reports/profit-and-loss',
  component:ProfitAndLossComponent
},
 {
        path: 'profit-and-loss-clearance', component: ProfitAndLossClearanceComponent

       },

     {
        path:'gst-clearance',component:VatClearanceComponent
       },
{
  path: 'reports/bank-ledger',
  component:BankLedgerComponent
},
{
  path: 'reports/vendor-ledger',
  component:VendorLedgerComponent
},
{
  path: 'reports/customer-ledger',
  component:CustomerLedgerComponent
},
{
  path: 'reports/balance-sheet',
  component:BalanceSheetComponent
},
{
  path: 'reports/cost-center-ledger',
  component:CostCenterLedgerComponent
},
{
  path: 'reports/profit-center-ledger-detailed',
  component:ProfitCenterLedgerDetailedComponent
},
{
  path: 'reports/profit-center-ledger',
  component:ProfitCenterLedgerComponent
},
{
  path: 'reports/tds-register',
  component:TdsRegisterComponent
},
{
  path: 'reports/adjustment-tracking',
  component:AdjustmentTrackingComponent
},
{
  path: 'journal/journal-ledger',
  loadChildren: () => import('./journal-entry/journal-entry.module').then(m => m.JournalEntryModule),
},

{
  path: 'cash-books/cash-book',
  loadChildren: () => import('./cash-book/cash-book.module').then(m => m.CashBookModule),
},
{
  path:'finance-dashboard',component:FinanceDashboardComponent
},
{
  path: 'cash-books/fund_transfer',
  loadChildren: () => import('./cash-book/fund-transfer/fund-transfer.module').then(m => m.FundTransferModule),
},
{
  path: 'journal/scheduled-journals',
  loadChildren: () => import('./scheduled-journals/scheduled-journals.module').then(m => m.ScheduledJournalsModule),
},

      {
        path: 'account-receivable',
        loadChildren: () => import('./account-receivable/account-receivable.module').then(m => m.AccountReceivableModule),
      },

      {
        path: 'account-payable',
        loadChildren: () => import('./account-payable/account-payable.module').then(m => m.AccountPayableModule),
      },

      {
        path: 'budget-management',
        loadChildren: () => import('./budget-managment/budget-managment.module').then(m => m.BudgetManagmentModule),
      },
      {
        path: 'account-subtype',
        loadChildren: () => import('./account-subtype/account-subtype.module').then(m => m.AccountSubtypeModule),
      },
      {
        path: 'account-dashboard',
        loadChildren: () => import('./account-dashboard/account-dashboard.module').then(m => m.AccountDashboardModule),
      },
      {
        path: 'cost-center',
        loadChildren: () =>
          import('./cost-center/cost-center.module').then(
            (m) => m.
            CostCenterModule
          ),
      },
      {
        path: 'budget-revenue-date',
        loadChildren: () =>
          import('./budget-revenue/budget-revenue.module').then(
            (m) => m.
            BudgetRevenueModule
          ),
      },
      {
        path: 'budget-planning',
        loadChildren: () =>
          import('./budget-planning/budget-planning.module').then(
            (m) => m.
             BudgetPlanningModule
          ),
      },
      {
        path: 'advance-booking',
        loadChildren: () =>
          import('./bookadvance/bookadvance.module').then(
            (m) => m.
            BookadvanceModule),
          },
          {
        path: 'financial-year',
        loadChildren: () =>
          import('./financial-year/financial-year.module').then(
            (m) => m.
            FinancialYearModule
          ),
      },
      {
        path: 'income-statement',
        loadChildren: () =>
          import('./income-statement/income-statement.module').then(
            (m) => m.
            IncomeStatementModule
          ),
      },
      {
        path: 'bank-accounting/bank_reconciliation',
        loadChildren: () => import('./bank-recancelation/bank-recancelation.module').then(m => m.BankRecancelationModule),
      },
      {
        path: 'profit-center',
        loadChildren: () => import('./profit-center/profit-center.module').then(m => m.ProfitCenterModule),
      },
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule),
      },
      {
        path: 'gst-report',
        loadChildren: () => import('./gst-report/gst-report.module').then(m => m.GstReportModule),
      },
      {
        path: 'transactions-report',
        loadChildren: () => import('./transaction-report/transaction-report.module').then(m => m.TransactionReportModule),
      },
      {
        path: 'customer-record-payment',
        loadChildren: () => import('./record-payment/record-payment.module').then(m => m.RecordPaymentModule),
      },
      {
        path: 'vendor-record-payment',
        loadChildren: () => import('./record-vendor-payment/record-vendor-payment.module').then(m => m.RecordVendorPaymentModule),
      },
      {
        path:'payment-program',loadChildren:()=>import('./payment-program/payment-program.module').then(m => m.PaymentProgramModule)
      },
      {
        path:'grn-cost-mapping',loadChildren:()=>import('./grn-cost-mapping/grn-cost-mapping.module').then(m => m.GrnCostMappingModule)
      },
      {
        path:'rcm-reports',loadChildren:()=>import('./rcm-reports/rcm-reports.module').then(m => m.RcmReportsModule)
      },
      {
        path:'credit-debit-note',loadChildren:()=>import('./credit-debit-note/credit-debit-note.module').then(m => m.CreditDebitNoteModule)
      },

    ]
  },

];







@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }

