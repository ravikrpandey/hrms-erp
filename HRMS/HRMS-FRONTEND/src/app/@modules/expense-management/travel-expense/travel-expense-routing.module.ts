import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelExpenseListComponent } from './travel-expense-list.component';
import { AddTravelExpenseComponent } from './add-travel-expense/add-travel-expense.component';
 

const routes: Routes = [
{path:'',redirectTo:'travel-expense-list',pathMatch:'full'},
{path:'travel-expense-list',component:TravelExpenseListComponent},
{path:'add-travel-expense',component:AddTravelExpenseComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelExpenseRoutingModule { }
