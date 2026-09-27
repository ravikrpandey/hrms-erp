import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReimbursementExpenseComponent } from './reimbursement-expense.component';
import { CreateReimburesementExpenseComponent } from './create-reimburesement-expense/create-reimburesement-expense.component';

const routes: Routes = [
  { path: '', component: ReimbursementExpenseComponent },
  { path: 'create', component: CreateReimburesementExpenseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReimbursementExpenseRoutingModule { }
