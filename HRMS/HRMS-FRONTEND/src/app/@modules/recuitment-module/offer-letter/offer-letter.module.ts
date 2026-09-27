import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferLetterComponent } from './offer-letter/offer-letter.component';
import { OfferLetterRoutingModule } from './offer-letter-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectFilterModule } from 'mat-select-filter';
import { OfferLetterActionComponent } from './offer-letter-action/offer-letter-action.component';

@NgModule({
  declarations: [
    OfferLetterComponent,
    OfferLetterActionComponent,
  ],
  imports: [
    CommonModule,
    OfferLetterRoutingModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatSelectFilterModule
  ],
})
export class OfferLetterModule { }
