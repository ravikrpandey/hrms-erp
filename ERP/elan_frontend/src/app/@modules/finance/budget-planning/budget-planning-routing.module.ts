import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetPlanningComponent } from './budget-planning.component';
import { BudgetPlanningCreateComponent } from './budget-planning-create/budget-planning-create.component';
import { BudgetPlanningListComponent } from './budget-planning-list/budget-planning-list.component';

const routes: Routes = [
  { path: "", component: BudgetPlanningComponent},
  { path: "create-budget-planning", component: BudgetPlanningCreateComponent},
  {
    path: 'budget-planning-list',
    loadChildren: () =>
      import('./budget-planning-list/budget-planning-list.module').then(
        (m) => m.BudgetPlanningListModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostCenterRoutingModule { }
