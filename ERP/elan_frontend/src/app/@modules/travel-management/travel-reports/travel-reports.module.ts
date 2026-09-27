import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelReportsRoutingModule } from './travel-reports-routing.module';
import { TravelReportsComponent } from './travel-reports.component';
import { EmployeeTravelReportComponent } from './employee-travel-report/employee-travel-report.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectFilterModule } from 'mat-select-filter';
import { TravelFiltersComponent } from './travel-filters/travel-filters.component';
import { ExpenceSummaryReportComponent } from './expence-summary-report/expence-summary-report.component';
import { TravelExpenseReportComponent } from './travel-expense-report/travel-expense-report.component';
import { DepartmentTravelExpenseReportComponent } from './department-travel-expense-report/department-travel-expense-report.component';
import { UnsubmitExpenseReportComponent } from './unsubmit-expense-report/unsubmit-expense-report.component';
import { ApprovalStatusReportComponent } from './approval-status-report/approval-status-report.component';
import { ReimbursementReportComponent } from './reimbursement-report/reimbursement-report.component';
import { ExpenseReimbursementReportComponent } from './expense-reimbursement-report/expense-reimbursement-report.component';
import { ExpenseTrendReportComponent } from './expense-trend-report/expense-trend-report.component';
import { DepartmentReportActionComponent } from './department-travel-expense-report/department-report-action/department-report-action.component';
import { MatIconModule } from '@angular/material/icon';
import { DepartmentCityDialogeComponent } from './department-travel-expense-report/department-city-dialoge/department-city-dialoge.component';
import { TopEmployeesActionComponent } from './department-travel-expense-report/top-employees-action/top-employees-action.component';
import { TopEmployeesDialogComponent } from './department-travel-expense-report/top-employees-dialog/top-employees-dialog.component';


@NgModule({
  declarations: [
    TravelReportsComponent,
    EmployeeTravelReportComponent,
    TravelFiltersComponent,
    ExpenceSummaryReportComponent,
    TravelExpenseReportComponent,
    DepartmentTravelExpenseReportComponent,
    UnsubmitExpenseReportComponent,
    ApprovalStatusReportComponent,
    ReimbursementReportComponent,
    ExpenseReimbursementReportComponent,
    ExpenseTrendReportComponent,
    DepartmentReportActionComponent,
    DepartmentCityDialogeComponent,
    TopEmployeesActionComponent,
    TopEmployeesDialogComponent
  ],
  imports: [
    CommonModule,
    TravelReportsRoutingModule,
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
    MatIconModule
  ]
})
export class TravelReportsModule { }
