import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from '../@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CandidateOfferLetterReceiveComponent } from './candidate-offer-letter-receive.component';
import { CandidateOfferLetterReceiveRoutingModule } from './candidate-offer-letter-receive-routing.module';

@NgModule({
  declarations: [
    CandidateOfferLetterReceiveComponent
  ],
  imports: [
    CommonModule,
    CandidateOfferLetterReceiveRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class CandidateOfferLetterModule { }
