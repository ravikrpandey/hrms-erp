import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyExpenseRoleComponent } from './my-expense-role/my-expense-role.component';

const routes: Routes = [
  {path:'',component:MyExpenseRoleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyExpenseRoleRoutingModule { }
