import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { BudgetExtendListComponent } from './budget-extend-list/budget-extend-list.component';

const routes: Routes = [
  { path: '', component: BudgetListComponent },
  { path: 'extend-list', component: BudgetExtendListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetMasterRoutingModule { }
