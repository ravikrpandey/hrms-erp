import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduledJournalsRoutingModule } from './scheduled-journals-routing.module';
import { ScheduledJournalsComponent } from '../scheduled-journals/scheduled-journals.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ScheduledJournalDetailsComponent } from './scheduled-journal-details/scheduled-journal-details.component';


@NgModule({
  declarations: [
    ScheduledJournalsComponent,
    ScheduledJournalDetailsComponent
  ],
  imports: [
    CommonModule,
    ScheduledJournalsRoutingModule,
    CommonModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class ScheduledJournalsModule { }
