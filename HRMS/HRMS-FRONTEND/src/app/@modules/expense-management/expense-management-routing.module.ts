import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseManagementComponent } from './expense-management.component';


const routes: Routes = [
  {
    path: '', component: ExpenseManagementComponent,
    children: [
      {
        path: 'travel-expense',
        loadChildren: () => import('./travel-expense/travel-expense.module').then(m => m.TravelExpenseModule),
      },
      {
        path: 'other-expense',
        loadChildren: () => import('./other-expense/other-expense.module').then(m => m.OtherExpenseModule),
      },
      { path: 'reimbursement-expense', loadChildren: () => import('./reimbursement-expense/reimbursement-expense.module').then(m => m.ReimbursementExpenseModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseManagementRoutingModule { }
