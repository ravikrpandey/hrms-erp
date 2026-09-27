import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationRoutingModule } from './registration-routing.module';
import { RegistrationLinkComponent } from './registration-link/registration-link.component';
import { PaymentLinkComponent } from './payment-link/payment-link.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from '../@shared/material/material.module';


@NgModule({
  declarations: [
    RegistrationLinkComponent,
    PaymentLinkComponent
  ],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RegistrationModule { }
