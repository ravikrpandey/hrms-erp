import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetCategoryComponent } from './budget-category.component';

const routes: Routes = [{ path: '', component: BudgetCategoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetCategoryRoutingModule { }
