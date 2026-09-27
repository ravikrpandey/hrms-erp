import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrollComponent } from '../payroll/payroll.component';
import { Reports } from './reports';

const routes: Routes = [
  {
    path: '',
    component: Reports,
    children: [
      {
        path: 'payroll-reports',
        loadChildren: () =>
          import('./payroll-reports/payroll-reports-module').then(
            (m) => m.PayrollReportsModule
          ),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
