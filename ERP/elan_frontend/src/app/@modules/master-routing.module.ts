import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './master.component';
import { AuthGuard } from '../@auth/auth-material/auth.guard';
import { ChangePasswordComponent } from '../@shared/components/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      {
        path: 'hrms',
        loadChildren: () =>
          import('./hrms/hrms.module').then((m) => m.HrmsModule),
        canLoad: [AuthGuard],
      },
      {
        path: 'ess',
        loadChildren: () =>
          import('./employee-self-service/employee-self-service.module').then(
            (m) => m.EmployeeSelfServiceModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'configurational-master',
        loadChildren: () =>
          import('./itticketing/configurationalmaster/configurationalmaster.module').then(
            (m) => m.ConfigurationalmasterModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'recruitment',
        loadChildren: () =>
          import('./recuitment-module/recuitment-module.module').then(
            (m) => m.RecuitmentModuleModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'dashboard-main',
        loadChildren: () =>
          import('./dashboard-main/dashboard-main.module').then(
            (m) => m.DashboardMainModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'finance',
        loadChildren: () =>
          import('./finance/finance.module').then((m) => m.FinanceModule),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'production',
        loadChildren: () =>
          import('./production/production.module').then(
            (m) => m.ProductionModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'workflow',
        loadChildren: () =>
          import('./work-flow/work-flow.module').then((m) => m.WorkFlowModule),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'entity',
        loadChildren: () =>
          import('./entity/entity.module').then((m) => m.EntityModule),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'vendor',
        loadChildren: () =>
          import('./vendor/vendor-management/vendor-management.module').then(
            (m) => m.VendorManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'purchase-management',
        loadChildren: () =>
          import('./purchase-management/purchase-management.module').then(
            (m) => m.PurchaseManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'business-intelligence',
        loadChildren: () =>
          import('./buisness-intelligence/buisness-intelligence.module').then(
            (m) => m.BuisnessIntelligenceModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'asset-management',
        loadChildren: () =>
          import('./asset-management/asset-management.module').then(
            (m) => m.AssetManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'performance',
        loadChildren: () =>
          import('./performance-management/performance-management.module').then(
            (m) => m.PerformanceManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'expense-management',
        loadChildren: () =>
          import('./expense-management/expense-management.module').then(
            (m) => m.ExpenseManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'travel-management',
        loadChildren: () =>
          import('./travel-management/travel-management.module').then(
            (m) => m.TravelManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'warehouse-management',
        loadChildren: () =>
          import('./ware-house-management/ware-house-management.module').then(
            (m) => m.WareHouseManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'store-management',
        loadChildren: () =>
          import('./store-management/store-management.module').then(
            (m) => m.StoreManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'project-management',
        loadChildren: () =>
          import('./project-management/project-management.module').then(
            (m) => m.ProjectManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'payroll',
        loadChildren: () =>
          import('./payroll/payroll.module').then((m) => m.PayrollModule),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'quality-management',
        loadChildren: () =>
          import('./quality-management/quality-management.module').then(
            (m) => m.QualityManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'crm',
        loadChildren: () => import('./crm/crm.module').then((m) => m.CRMModule),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./sales/sales.module').then((m) => m.SalesModule),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'sales-target-achievement',
        loadChildren: () =>
          import('./sales-target-achievement/sales-target-achievement.module').then(
            (m) => m.SalesTargetAchievementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'sales-management',
        loadChildren: () =>
          import('./sales-management/sales-management.module').then(
            (m) => m.SalesManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'breakdown-management',
        loadChildren: () =>
          import('./breakdown-management/breakdown-management.module').then(
            (m) => m.BreakdownManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'maintenance-management',
        loadChildren: () =>
          import('./maintenance-management/maintenance-management.module').then(
            (m) => m.MaintenanceManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'crm-service',
        loadChildren: () =>
          import('./crm-service/crm-service.module').then(
            (m) => m.CrmServiceModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'inventory-management',
        loadChildren: () =>
          import('./inventory-management/inventory-management.module').then(
            (m) => m.InventoryManagementModule,
          ),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./report/report.module').then((m) => m.ReportModule),
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'transport-management',
        loadChildren: () =>
          import('./transport-management/transport-management.module').then(
            (m) => m.TransportManagementModule,
          ),
      },
      {
        path: 'menu-management',
        loadChildren: () =>
          import('./menu-management/menu-management.module').then(
            (m) => m.MenuManagementModule,
          ),
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        canLoad: [AuthGuard], // Apply AuthGuard
      },
      {
        path: 'third-party',
        loadChildren: () =>
          import('./third-party/third-party.module').then(
            (m) => m.ThirdPartyModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
