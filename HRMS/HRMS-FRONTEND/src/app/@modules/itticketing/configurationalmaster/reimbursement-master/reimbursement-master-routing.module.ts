import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelTypeComponent } from './travel-type/travel-type.component';
import { AddTravelTypeComponent } from './travel-type/add-travel-type/add-travel-type.component';
import { BudgetLimitComponent } from './budget-limit/budget-limit.component';
import { CreateTravelBudgetComponent } from './budget-limit/create-travel-budget/create-travel-budget.component';
import { ReimbursementMasterComponent } from './reimbursement-master/reimbursement-master.component';
import { ReimbursementBudgetMasterComponent } from './reimbursement-budget-master/reimbursement-budget-master.component';
import { CreateReimbursementComponent } from './reimbursement-master/create-reimbursement/create-reimbursement.component';
import { CreateReimbursementBudgetComponent } from './reimbursement-budget-master/create-reimbursement-budget/create-reimbursement-budget.component';
import { ReimburseMasterComponent } from './reimbursement-master.component';

const routes: Routes = [
  {
    path: '',
    component: ReimburseMasterComponent,
    children: [
      { path: 'travel-type', component: TravelTypeComponent },
      { path: 'add-travel-type', component: AddTravelTypeComponent },
      { path: 'budget-limit', component: BudgetLimitComponent },
      { path: 'create-budget-limit', component: CreateTravelBudgetComponent },
      { path: 'reimbursement', component: ReimbursementMasterComponent },
      { path: 'reimbursement/create', component: CreateReimbursementComponent },
      { path: 'reimbursement-budget', component: ReimbursementBudgetMasterComponent },
      { path: 'reimbursement-budget/create', component: CreateReimbursementBudgetComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReimbursementMasterRoutingModule {}
