import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfferOnboardingComponent } from './offer-onboarding.component';

const routes: Routes = [
  {path:'', component:OfferOnboardingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferOnboardingRoutingModule { }
