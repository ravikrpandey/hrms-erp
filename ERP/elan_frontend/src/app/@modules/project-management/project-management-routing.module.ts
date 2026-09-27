import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectManagementComponent } from './project-management.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { ViewProjectComponent } from './my-projects/view-project/view-project.component';
import { TaskManagementComponent } from './task-management/task-management.component';
import { AssignedTaskComponent } from './task-management/assigned-task/assigned-task.component';
import { CreateTaskComponent } from './task-management/create-task/create-task.component';
import { AssignedTaskViewComponent } from './task-management/assigned-task/assigned-task-view/assigned-task-view.component';
import { TimesheetApprovalComponent } from './timesheet-approval/timesheet-approval.component';
import { ApprovedTimesheetComponent } from './timesheet-approval/approved-timesheet/approved-timesheet.component';
import { RejectedTimesheetComponent } from './timesheet-approval/rejected-timesheet/rejected-timesheet.component';
import { AllTimesheetComponent } from './timesheet-approval/all-timesheet/all-timesheet.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';

const routes: Routes = [
  {
    path: '', component: ProjectManagementComponent,
    children: [
      {
        path: 'project-list',
        component: ProjectListComponent
      },
      {
        path: 'add-project',
        component: AddProjectComponent
      },
      {
        path: 'my-projects',
        component: MyProjectsComponent
      },
      {
        path:'my-project',
        component: ViewProjectComponent
      },
      {
        path:'task-management',
        component:TaskManagementComponent
      },
      {
        path: 'assigned-task',
        component : AssignedTaskComponent
      },
      {
        path: 'create-task',
        component: CreateTaskComponent
      },
      {
        path:'update-status',
        component: AssignedTaskViewComponent
      },
      {
        path: 'timesheet-approval',
        component: TimesheetApprovalComponent
      },
      {
        path:'approved-timesheet',
        component: ApprovedTimesheetComponent
      },
      {
        path: 'rejected-timesheet',
        component: RejectedTimesheetComponent
      },
      {
        path: 'all-timesheet',
        component : AllTimesheetComponent
      },
      {
        path: 'gantt-chart',
        component: GanttChartComponent
      },
      {
        path: 'dashboard',
        component: ProjectDashboardComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagementRoutingModule { }
