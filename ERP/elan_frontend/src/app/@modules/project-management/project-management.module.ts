import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProjectManagementRoutingModule } from './project-management-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectManagementComponent } from './project-management.component';
import { ShairedModule } from "../../@shared/shaired/shaired.module";
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AddProjectComponent } from './add-project/add-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionProjectListComponent } from './project-list/action-project-list/action-project-list.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { ActionMyProjectsComponent } from './my-projects/action-my-projects/action-my-projects.component';
import { ViewProjectComponent } from './my-projects/view-project/view-project.component';
import { TaskManagementComponent } from './task-management/task-management.component';
import { AssignedTaskComponent } from './task-management/assigned-task/assigned-task.component';
import { ActionTaskManagementComponent } from './task-management/action-task-management/action-task-management.component';
import { CreateTaskComponent } from './task-management/create-task/create-task.component';
import { MatRadioModule } from '@angular/material/radio';
import { RemarkDialogeComponent } from './task-management/remark-dialoge/remark-dialoge.component';
import { MatTableModule } from '@angular/material/table';
import { PriorityRendererComponent } from './task-management/priority-renderer/priority-renderer.component';
import { AssignedActionComponent } from './task-management/assigned-task/assigned-action/assigned-action.component';
import { AssignedTaskViewComponent } from './task-management/assigned-task/assigned-task-view/assigned-task-view.component';
import { TimesheetApprovalComponent } from './timesheet-approval/timesheet-approval.component';
import { ActionTimesheetComponent } from './timesheet-approval/action-timesheet/action-timesheet.component';
import { DialogTimesheetApprovalComponent } from './timesheet-approval/dialog-timesheet-approval/dialog-timesheet-approval.component';
import { ApprovedTimesheetComponent } from './timesheet-approval/approved-timesheet/approved-timesheet.component';
import { RejectedTimesheetComponent } from './timesheet-approval/rejected-timesheet/rejected-timesheet.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AllTimesheetComponent } from './timesheet-approval/all-timesheet/all-timesheet.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogeAllTimesheetComponent } from './timesheet-approval/all-timesheet/dialoge-all-timesheet/dialoge-all-timesheet.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { MatSelectFilterModule } from 'mat-select-filter';
@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectManagementComponent,
    AddProjectComponent,
    ActionProjectListComponent,
    MyProjectsComponent,
    ActionMyProjectsComponent,
    ViewProjectComponent,
    TaskManagementComponent,
    AssignedTaskComponent,
    ActionTaskManagementComponent,
    CreateTaskComponent,
    RemarkDialogeComponent,
    PriorityRendererComponent,
    AssignedActionComponent,
    AssignedTaskViewComponent,
    TimesheetApprovalComponent,
    ActionTimesheetComponent,
    DialogTimesheetApprovalComponent,
    ApprovedTimesheetComponent,
    RejectedTimesheetComponent,
    AllTimesheetComponent,
    DialogeAllTimesheetComponent,
    GanttChartComponent,
    ProjectDashboardComponent
  ],
  imports: [
    CommonModule,
    ProjectManagementRoutingModule,
    ShairedModule,
    AgGridModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ShairedModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDatepickerModule,
    CKEditorModule,
    MatSelectModule,
    MatRadioModule,
    MatTableModule,
    MatCheckboxModule,
    FullCalendarModule,
    NgChartsModule,
    Ng2GoogleChartsModule,
    NgChartsModule,
    MatSelectFilterModule
],
providers: [
  DatePipe, 
],
})
export class ProjectManagementModule { }
