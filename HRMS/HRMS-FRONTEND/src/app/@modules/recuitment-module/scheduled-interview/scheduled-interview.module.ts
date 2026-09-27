import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduledInterviewListComponent } from './scheduled-interview-list/scheduled-interview-list.component';
import { ScheduledInterviewRoutingModule } from './scheduled-interview-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ScheduleInterviewActionComponent } from './schedule-interview-action/schedule-interview-action.component';
import { InterviewComponent } from './interview/interview.component';
import { InterviewRoundDialogComponent } from './interview-round-dialog/interview-round-dialog.component';

@NgModule({
  declarations: [
    ScheduledInterviewListComponent,
    ScheduleInterviewActionComponent,
    InterviewComponent,
    InterviewRoundDialogComponent
  ],
  imports: [
    CommonModule,
    ScheduledInterviewRoutingModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatSelectFilterModule
  ],
})
export class ScheduledInterviewModule { }
