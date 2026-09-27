import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrollComponent } from './payroll.component';

const routes: Routes = [
  {
    path: '', component: PayrollComponent,
    children: [
      {
        path: 'statutory-components',
        loadChildren: () => import('./statutory/statutory.module').then((m) => m.StatutoryModule),
      },
      {
        path: 'salary-components',
        loadChildren: () => import('./salary/salary.module').then((m) => m.SalaryModule),
      },
      {
        path: 'salary-templates',
        loadChildren: () => import('./salary-template/salary-template.module').then((m) => m.SalaryTemplateModule),
      },
      {
        path: 'tax-slab',
        loadChildren: () => import('./tax-slab/tax-slab.module').then((m) => m.TaxSlabModule),
      },
      {
        path: 'declaration-form',
        loadChildren: () => import('./declaration-form/declaration-form.module').then((m) => m.DeclarationFormModule),
      },
      {
        path: 'payroll-cycle',
        loadChildren: () => import('./payroll-cycle/payroll-cycle.module').then((m) => m.PayrollCycleModule),
      },
      {
        path: 'pay-slip',
        loadChildren: () => import('./salary-process/salary-process.module').then((m) => m.SalaryProcessModule),
      },
      {
        path: 'salary-details',
        loadChildren: () =>
          import('./employee-attendance/employee-attendance.module').then(
            (m) => m.EmployeeAttendanceModule
          ),
      },
      
  {
    path: 'process-salary',
    loadChildren: () =>
      import('./pay-slip/pay-slip.module').then(
        (m) => m.PaySlipModule
      ),
  },
  {
    path: 'salary-approval',
    loadChildren: () =>
      import('./salery-approval-menu/salery-approval-menu.module').then(
        (m) => m.SaleryApprovalMenuModule
      ),
  },
  {
    path: 'payroll-salary-slip',
    loadChildren: () =>
      import('./payroll-salery-slip/payroll-salery-slip.module').then(
        (m) => m.PayrollSalerySlipModule
      ),
  },
  {
    path: 'process-allowance',
    loadChildren: () =>
      import('./process-allowance/process-allowance.module').then(
        (m) => m.ProcessAllowanceModule
      ),
  }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollRoutingModule { }
