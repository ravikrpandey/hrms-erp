import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalaryComponent } from './salary/salary.component';

const routes: Routes = [
  {path:'',component:SalaryComponent,
    children: [
      {
        path: '',
        redirectTo: 'earnings',
        pathMatch: 'full',
      },
      {
        path: 'earnings',
        loadChildren: () => import('./earnings/earnings.module').then((m) => m.EarningsModule),
      },
      {
        path: 'deductions',
        loadChildren: () => import('./deductions/deductions.module').then((m) => m.DeductionsModule),
      },
      {
        path: 'reimbursements',
        loadChildren: () => import('./reimbursements/reimbursements.module').then((m) => m.ReimbursementsModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryRoutingModule { }
