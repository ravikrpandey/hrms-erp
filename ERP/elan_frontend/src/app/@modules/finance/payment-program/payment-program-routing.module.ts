import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentProgramListComponent } from './payment-program-list/payment-program-list.component';

const routes: Routes = [
  {
    path:'',component:PaymentProgramListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentProgramRoutingModule { }
