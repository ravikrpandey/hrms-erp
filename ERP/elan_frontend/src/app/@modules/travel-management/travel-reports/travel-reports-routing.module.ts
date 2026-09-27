import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelReportsComponent } from './travel-reports.component';
import { EmployeeTravelReportComponent } from './employee-travel-report/employee-travel-report.component';
import { ExpenceSummaryReportComponent } from './expence-summary-report/expence-summary-report.component';
import { TravelExpenseReportComponent } from './travel-expense-report/travel-expense-report.component';
import { DepartmentTravelExpenseReportComponent } from './department-travel-expense-report/department-travel-expense-report.component';
import { UnsubmitExpenseReportComponent } from './unsubmit-expense-report/unsubmit-expense-report.component';
import { ApprovalStatusReportComponent } from './approval-status-report/approval-status-report.component';
import { ReimbursementReportComponent } from './reimbursement-report/reimbursement-report.component';
import { ExpenseReimbursementReportComponent } from './expense-reimbursement-report/expense-reimbursement-report.component';
import { ExpenseTrendReportComponent } from './expense-trend-report/expense-trend-report.component';

const routes: Routes = [
  {
    path: '',
    component: TravelReportsComponent,
    children: [
      {path: '',redirectTo: 'travel-report',pathMatch:'full'},
      {path: 'travel-report', component: EmployeeTravelReportComponent},
      {path: 'expence-summary-report', component: ExpenceSummaryReportComponent},
      {path: 'travel-expence-report', component: TravelExpenseReportComponent},
      {path: 'department-travel-report',component: DepartmentTravelExpenseReportComponent},
      {path: 'unsubmitted-expense-report',component: UnsubmitExpenseReportComponent},
      {path: 'approval-status-report',component: ApprovalStatusReportComponent},
      {path: 'reimbursement-report',component: ReimbursementReportComponent},
      {path: 'expense-reimbursement-report',component: ExpenseReimbursementReportComponent},
      {path: 'expense-trend-report',component: ExpenseTrendReportComponent},
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelReportsRoutingModule { }
