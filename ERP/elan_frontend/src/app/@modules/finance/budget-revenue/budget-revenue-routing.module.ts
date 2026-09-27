import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetRevenueComponent } from './budget-revenue.component';

const routes: Routes = [{ path: '', component: BudgetRevenueComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRevenueRoutingModule { }
