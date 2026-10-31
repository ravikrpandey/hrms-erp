import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './master.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      {
        path: 'hrms',
        loadChildren: () =>
          import('./hrms/hrms.module').then((m) => m.HrmsModule),
      },
      {
        path: 'ess',
        loadChildren: () =>
          import('./employee-self-service/employee-self-service.module').then(
            (m) => m.EmployeeSelfServiceModule
          ),
      },
      {
        path: 'configurational-master',
        loadChildren: () =>
          import(
            './itticketing/configurationalmaster/configurationalmaster.module'
          ).then((m) => m.ConfigurationalmasterModule),
      },
      {
        path: 'recruitment',
        loadChildren: () =>
          import('./recuitment-module/recuitment-module.module').then(
            (m) => m.RecuitmentModuleModule
          ),
      },
      {
        path: 'dashboard-main',
        loadChildren: () =>
          import('./dashboard-main/dashboard-main.module').then(
            (m) => m.DashboardMainModule
          ),
      },

      {
        path: 'production',
        loadChildren: () =>
          import('./production/production.module').then(
            (m) => m.ProductionModule
          ),
      },
      // {
      //   path: 'workflow',
      //   loadChildren: () =>
      //     import('./work-flow/work-flow.module').then((m) => m.WorkFlowModule),
      // },


      {
        path: 'expense-management',
        loadChildren: () =>
          import('./expense-management/expense-management.module').then(
            (m) => m.ExpenseManagementModule
          ),
      },
      {
        path: 'travel-management',
        loadChildren: () =>
          import('./travel-management/travel-management.module').then(
            (m) => m.TravelManagementModule
          ),
      },
      {
        path: 'payroll',
        loadChildren: () =>
          import('./payroll/payroll.module').then((m) => m.PayrollModule),
      },
      {
        path: 'performance',
        loadChildren: () =>
          import('./performance-management/performance-management.module').then(
            (m) => m.PerformanceManagementModule
          ),
      },
      {
        path: 'performance-assessment',
        loadChildren: () =>
          import('./performance-assessment/performance-assessment.module').then(
            (m) => m.PerformanceAssessmentModule
          ),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./notifications/notifications.module').then(
            (m) => m.NotificationsModule
          ),
      },

      {
        path: 'lms',
        loadChildren: () => import('./lms/lms.module').then((m) => m.LmsModule),
      },

      {
        path: 'ticket-management',
        loadChildren: () =>
          import('./ticket-management/ticket-management.module').then(
            (m) => m.TicketManagementModule
          ),
      },
      {
        path: 'comp-off',
        loadChildren: () =>
          import('./assign-comp-off/assign-comp-off.module').then(
            (m) => m.AssignCompOffModule
          ),
      },
      {
        path: 'compliances',
        loadChildren: () =>
          import('./compliances/compliances-module').then(
            (m) => m.CompliancesModule
          ),
      },
      {
        path: 'document-management-system',
        loadChildren: () =>
          import('./document-management-system/document-management-system-module').then(
            (m) => m.DocumentManagementSystemModule
          ),
      },
      {
        path: 'asset-management',
        loadChildren: () =>
          import('./asset-allotment/asset-allotment-module').then(
            (m) => m.AssetAllotmentModule
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./attendance-report/attendance-report.module').then(
            (m) => m.AttendanceReportModule
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports-module').then(
            (m) => m.ReportsModule
          ),
      },
      {
        path: 'finance',
        loadChildren: () =>
          import('./finance/finance.module').then(m => m.FinanceModule)
      },
      {
        path: 'project-management',
        loadChildren: () =>
          import('./project-management/project-management.module').then(
            (m) => m.ProjectManagementModule
          ),
      },
      {
        path: 'projects',
        redirectTo: 'project-management/projects',
        pathMatch: 'full'
      },
      {
        path: 'tasks',
        redirectTo: 'project-management/tasks',
        pathMatch: 'full'
      },
      {
        path: 'timesheet',
        redirectTo: 'project-management/timesheet',
        pathMatch: 'full'
      },
      {
        path: 'timesheets',
        redirectTo: 'project-management/timesheet',
        pathMatch: 'full'
      },
      {
        path: 'expenses',
        redirectTo: 'expense-management/expenses',
        pathMatch: 'full'
      },
      {
        path: 'expense-report',
        redirectTo: 'project-management/expense-report',
        pathMatch: 'full'
      }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule { }
