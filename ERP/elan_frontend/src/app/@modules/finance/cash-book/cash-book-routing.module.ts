import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashBookComponent } from './cash-book.component';
import { CustomerAdvanceFormComponent } from './customer-advance-form/customer-advance-form.component';
import { MoneyOutFormComponent } from './money-out-form/money-out-form.component';


const routes: Routes = [
  {path:'', component:CashBookComponent},
  {
    path:'customer-advance-form',component:CustomerAdvanceFormComponent
  },
  
{
  path:'money-out-form', component:MoneyOutFormComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashBookRoutingModule { }
