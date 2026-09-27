import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateShortlistRoutingModule } from './candidate-shortlist-routing.module';
import { CandidateShortListComponent } from './candidate-short-list/candidate-short-list.component';
import {  CandidateShortCreateComponent } from './candidate-short-create/candidate-short-create.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ActionsComponent } from './actions/actions.component';
import { CandidaterespondComponent } from './candidaterespond/candidaterespond.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    CandidateShortListComponent,
    CandidateShortCreateComponent,
    ActionsComponent,
    CandidaterespondComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CandidateShortlistRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectFilterModule
  ]
})
export class CandidateShortlistModule { }
