import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetPlanningListComponent } from './budget-planning-list.component';
import { PlanningComponent } from './planning/planning.component';

const routes: Routes = [
  {
    path:'', component:BudgetPlanningListComponent,
    children:[
      {
        path: '', redirectTo: 'planning', pathMatch: 'full'
      },
      {
        path: 'planning',
        component: PlanningComponent
      },
      {
        path: 'pending-for-approval',
        component: PlanningComponent
      },
      {
        path: 'approved-by-me',
        component: PlanningComponent
      },
      {
        path: 'draft',
        component: PlanningComponent
      },
    ]
  },
    {
      path: 'all-task-form',
      component: PlanningComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetPlanningListRoutingModule { }