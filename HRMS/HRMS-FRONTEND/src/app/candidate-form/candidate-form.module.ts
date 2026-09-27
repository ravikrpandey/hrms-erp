import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateFormRoutingModule } from './candidate-form-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ViewDocumentDialogComponent } from './view-document-dialog/view-document-dialog.component';
import { MaterialModule } from '../@shared/material/material.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    ViewDocumentDialogComponent
  ],
  imports: [
    CommonModule,
    CandidateFormRoutingModule,
    MatCardModule,
    MatButtonModule,
    MaterialModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class CandidateFormModule { }
