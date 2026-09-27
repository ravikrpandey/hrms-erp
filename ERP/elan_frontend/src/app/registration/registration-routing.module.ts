import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationLinkComponent } from './registration-link/registration-link.component';
import { PaymentLinkComponent } from './payment-link/payment-link.component';

const routes: Routes = [
  {path:"registration-link",component:RegistrationLinkComponent},
  {path:"payment-link",component:PaymentLinkComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
