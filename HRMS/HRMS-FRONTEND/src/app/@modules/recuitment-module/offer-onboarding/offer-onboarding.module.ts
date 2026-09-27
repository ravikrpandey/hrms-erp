import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfferOnboardingRoutingModule } from './offer-onboarding-routing.module';
import { OfferOnboardingComponent } from './offer-onboarding.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { OfferActionComponent } from './offer-action/offer-action.component';
import { OfferDailogComponent } from './offer-dailog/offer-dailog.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OfferOnboardingComponent,
    OfferActionComponent,
    OfferDailogComponent
  ],
  imports: [
    CommonModule,
    OfferOnboardingRoutingModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class OfferOnboardingModule { }
