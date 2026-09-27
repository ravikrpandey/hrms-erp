import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { FinanceComponent } from './finance.component';
import { FinanceRoutingModule } from './finance-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WorkFlowListPopupComponent } from './income-statement/work-flow-list-popup/work-flow-list-popup.component';
import { AddChartAccountComponent } from './add-chart-account/add-chart-account.component';
import { ChartAccountActionComponent } from './chart-account-action/chart-account-action.component';
import { ViewChartComponent } from './view-chart/view-chart.component';
import { ChartAccountComponent } from './chart-account/chart-account.component';
import { ChartOfAccountHierarchyViewComponent } from './chart-of-account-hierarchy-view/chart-of-account-hierarchy-view.component';
import { CoaHierarchyActionComponent } from './coa-hierarchy-action/coa-hierarchy-action.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { PostingPeriodComponent } from './posting-period/posting-period.component';
import { PostingPeriodActionComponent } from './posting-period-action/posting-period-action.component';
import { AddPostingPeriodComponent } from './add-posting-period/add-posting-period.component';
import { BankMasterComponent } from './bank-master/bank-master.component';
import { AddBankComponent } from './add-bank/add-bank.component';
import { BankViewComponent } from './bank-view/bank-view.component';
import { BankActionComponent } from './bank-action/bank-action.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { AddBankAccountComponent } from './add-bank-account/add-bank-account.component';
import { BankAccountActionComponent } from './bank-account-action/bank-account-action.component';
import { ViewBankAccountComponent } from './view-bank-account/view-bank-account.component';
import { BankClearenceComponent } from './bank-clearence/bank-clearence.component';
import { CustomDatePickerComponent } from './custom-date-picker/custom-date-picker.component';
import { TrialBalanceReportComponent } from './trial-balance-report/trial-balance-report.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { BankReconciliationStatementComponent } from './bank-reconciliation-statement/bank-reconciliation-statement.component';
import { MatMenuModule } from '@angular/material/menu';
import { JournalLedgerComponent } from './journal-ledger/journal-ledger.component';
import { ReportsComponent } from './reports/reports.component';
import { ProfitAndLossComponent } from './profit-and-loss/profit-and-loss.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { FinanceDashboardComponent } from './finance-dashboard/finance-dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { NgImageSliderModule } from 'ng-image-slider';
import { BankLedgerComponent } from './bank-ledger/bank-ledger.component';
import { VendorLedgerComponent } from './vendor-ledger/vendor-ledger.component';
import { CustomerLedgerComponent } from './customer-ledger/customer-ledger.component';
import { CostCenterLedgerComponent } from './cost-center-ledger/cost-center-ledger.component';
import { ProfitCenterLedgerComponent } from './profit-center-ledger/profit-center-ledger.component';
import { PurchaseCreditNoteListComponent } from './gst-report/purchase-credit-note-list/purchase-credit-note-list.component';
import { TdsRegisterComponent } from './tds-register/tds-register.component';
import { BankStatementUploadComponent } from './bank-statement-upload/bank-statement-upload.component';
import { RefurbishedBankStatementComponent } from './refurbished-bank-reconciliation-statement/refurbished-bank-reconciliation-statement.component';
import { ProfitAndLossClearanceComponent } from './profit-and-loss-clearance/profit-and-loss-clearance.component';
import { VatClearanceComponent } from './vat-clearance/vat-clearance.component';
import { AdjustmentTrackingComponent } from './adjustment-tracking/adjustment-tracking.component';
import { ProfitCenterLedgerDetailedComponent } from './profit-center-ledger-detailed/profit-center-ledger-detailed.component';
// import { AddGstIoReportComponent } from './gst-report/add-gst-io-report/add-gst-io-report.component';

@NgModule({
  declarations: [
    FinanceComponent,
    WorkFlowListPopupComponent,
    ChartAccountActionComponent,
    ViewChartComponent,
    ChartAccountComponent,
    AddChartAccountComponent,
    ChartOfAccountHierarchyViewComponent,
    CoaHierarchyActionComponent,
    PostingPeriodComponent,
    PostingPeriodActionComponent,
    AddPostingPeriodComponent,
    BankMasterComponent,
    AddBankComponent,
    RefurbishedBankStatementComponent,
    BankStatementUploadComponent,
    BankViewComponent,
    BankActionComponent,
    BankAccountComponent,
    AddBankAccountComponent,
    BankAccountActionComponent,
    ViewBankAccountComponent,
    BankClearenceComponent,
    CustomDatePickerComponent,
    TrialBalanceReportComponent,
    TrialBalanceComponent,
    BankReconciliationStatementComponent,
    JournalLedgerComponent,
    ReportsComponent,
    ProfitAndLossComponent,
    BalanceSheetComponent,
    FinanceDashboardComponent,
    BankLedgerComponent,
    VendorLedgerComponent,
    CustomerLedgerComponent,
    CostCenterLedgerComponent,
    ProfitCenterLedgerComponent,
    // AddGstIoReportComponent
    PurchaseCreditNoteListComponent,
    TdsRegisterComponent,
    ProfitAndLossClearanceComponent,
    VatClearanceComponent,
    AdjustmentTrackingComponent,
    ProfitCenterLedgerDetailedComponent
  
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    FinanceRoutingModule,
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
    NgChartsModule,
    NgImageSliderModule
  ],
   
})
export class FinanceModule { }
