import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateFormRoutingModule } from './candidate-form-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE } from '@angular/material/core';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CandidateFormRoutingModule,
    MatCardModule,
    MatButtonModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class CandidateFormModule { }
