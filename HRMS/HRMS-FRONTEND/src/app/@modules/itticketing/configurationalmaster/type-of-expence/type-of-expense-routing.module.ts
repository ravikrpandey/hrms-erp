import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeOfExpenseComponent } from './type-of-expense.component';

const routes: Routes = [{ path: '', component: TypeOfExpenseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeOfExpenseRoutingModule { }
