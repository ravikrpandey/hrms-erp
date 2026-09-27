import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherExpenseListComponent } from './other-expense-list.component';
import { AddOtherExpenseComponent } from './add-other-expense/add-other-expense.component';

const routes: Routes = [
  {path:'',redirectTo:'other-expense-list',pathMatch:'full'},
  {path:'other-expense-list',component:OtherExpenseListComponent},
  {path:'add-other-expense',component: AddOtherExpenseComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherExpenseRoutingModule { }



