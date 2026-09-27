import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FixedInterviewRoutingModule } from './fixed-interview-routing.module';
import { FixedInterviewComponent } from './varification-list/varification-list.component';

import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { InterviewlistCreateComponent } from './interviewlist-create/interviewlist-create.component';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActionsComponent } from './actions/actions.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FixedinterviewDialogComponent } from './fixedinterview-dialog/fixedinterview-dialog.component';
import { SheduledialogComponent } from './sheduledialog/sheduledialog.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
  declarations: [
    FixedInterviewComponent,
    InterviewlistCreateComponent,
    ActionsComponent,
    FixedinterviewDialogComponent,
    SheduledialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FixedInterviewRoutingModule,
    AgGridModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    NgxMatTimepickerModule,
    MatSelectFilterModule
  ]
})
export class FixedInterviewModule { }
