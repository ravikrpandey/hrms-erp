import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';

import { ProjectManagementRoutingModule } from './project-management-routing.module';
import { ProjectManagementComponent } from './project-management.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';
import { TaskReviewDialogComponent } from './components/task-review-dialog/task-review-dialog.component';
import { TaskActivityDialogComponent } from './components/task-activity-dialog/task-activity-dialog.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { TimesheetTimeLogsComponent } from './components/timesheet-time-logs/timesheet-time-logs.component';
import { TimesheetLogDialogComponent } from './components/timesheet-log-dialog/timesheet-log-dialog.component';
import { TimesheetFilterPanelComponent } from './components/timesheet-filter-panel/timesheet-filter-panel.component';
import { TimesheetTimesheetsComponent } from './components/timesheet-timesheets/timesheet-timesheets.component';
import { TimesheetJobsComponent } from './components/timesheet-jobs/timesheet-jobs.component';
import { TimesheetProjectsComponent } from './components/timesheet-projects/timesheet-projects.component';
import { TimesheetJobScheduleComponent } from './components/timesheet-job-schedule/timesheet-job-schedule.component';
import { TimesheetActionCellComponent } from './components/timesheet-action-cell/timesheet-action-cell.component';

import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AgGridModule } from 'ag-grid-angular';
import { ProjectActionCellComponent } from './components/project-action-cell/project-action-cell.component';
import { TaskActionCellComponent } from './components/task-action-cell/task-action-cell.component';
import { ExpenseReportComponent } from './components/expense-report/expense-report.component';

@NgModule({
  declarations: [
    ProjectManagementComponent,
    ProjectListComponent,
    ProjectActionCellComponent,
    ProjectCreateComponent,
    ProjectDetailComponent,
    TaskManagementComponent,
    TaskActionCellComponent,
    TaskDialogComponent,
    TaskReviewDialogComponent,
    TaskActivityDialogComponent,
    TimesheetComponent,
    TimesheetTimeLogsComponent,
    TimesheetLogDialogComponent,
    TimesheetFilterPanelComponent,
    TimesheetTimesheetsComponent,
    TimesheetActionCellComponent,
    TimesheetJobsComponent,
    TimesheetProjectsComponent,
    TimesheetJobScheduleComponent,
    ExpenseReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ShairedModule,
    AgGridModule,
    ProjectManagementRoutingModule
  ]
})
export class ProjectManagementModule { }

