import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalEntryRoutingModule } from './journal-entry-routing.module';
import { JournalEntryComponent } from './journal-entry.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { GeneralListComponent } from './general-list/general-list.component';
import { JournalActionComponent } from './journal-action/journal-action.component';
import { RepeatFrequencyComponent } from './repeat-frequency/repeat-frequency.component';
import { MatSelectFilterModule } from 'mat-select-filter';
// import { NumberCommaDirective } from 'src/app/@shared/directives/number-comma.directive';

@NgModule({
  declarations: [
    JournalEntryComponent,
    GeneralListComponent,
    JournalActionComponent,
    RepeatFrequencyComponent,
    // NumberCommaDirective
  ],
  imports: [
    CommonModule,
    JournalEntryRoutingModule,
    CommonModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectFilterModule
  ]
})
export class JournalEntryModule { }
