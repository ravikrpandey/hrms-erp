import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'budget-master',
    loadChildren: () =>
      import('./budget-master/budget-master.module').then((m) => m.BudgetMasterModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetManagmentRoutingModule { }
