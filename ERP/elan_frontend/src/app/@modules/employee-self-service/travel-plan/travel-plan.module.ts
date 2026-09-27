import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelPlanRoutingModule } from './travel-plan-routing.module';
import { TravelPlanComponent } from './travel-plan.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TravelPlanComponent
  ],
  imports: [
    CommonModule,
    TravelPlanRoutingModule,
    ShairedModule,
    ReactiveFormsModule
  ]
})
export class TravelPlanModule { }
