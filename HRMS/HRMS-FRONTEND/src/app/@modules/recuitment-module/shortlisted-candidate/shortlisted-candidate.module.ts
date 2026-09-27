import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortlistedCandidateListComponent } from './shortlisted-candidate-list/shortlisted-candidate-list.component';
import { ShortlistedCondidateRoutingModule } from './shortlisted-candidate-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CKEditorModule } from 'ckeditor4-angular';
import { ShortlistedCandidateActionComponent } from './shortlisted-candidate-action/shortlisted-candidate-action.component';
import { CreateCandidateOfferLetterComponent } from './create-candidate-offer-letter/create-candidate-offer-letter.component';

@NgModule({
  declarations: [
    ShortlistedCandidateListComponent,
    ShortlistedCandidateActionComponent,
    CreateCandidateOfferLetterComponent,
  ],
  imports: [
    CommonModule,
    ShortlistedCondidateRoutingModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatSelectFilterModule,
    CKEditorModule,
  ],
})
export class ShortlistedCandidateModule { }
