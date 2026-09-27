import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankRecancelationComponent } from './bank-recancelation.component';

const routes: Routes = [
  {path:'',component:BankRecancelationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankRecancelationRoutingModule { }
