import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetCreateComponent } from './timesheet-create/timesheet-create.component';
import { TimesheetListComponent } from './timesheet-list/timesheet-list.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { TimesheetActionComponent } from './timesheet-list/timesheet-action/timesheet-action.component';
import { TimesheetDialogComponent } from './timesheet-list/timesheet-dialog/timesheet-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatTimepickerModule } from 'mat-timepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { StatusComponent } from './timesheet-list/status/status.component';

@NgModule({
  declarations: [
    TimesheetCreateComponent,
    TimesheetListComponent,
    TimesheetActionComponent,
    TimesheetDialogComponent,
    StatusComponent
  ],
  imports: [
    CommonModule,
    TimesheetRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    // MatTimepickerModule,
    NgxMatTimepickerModule

  ]
})
export class TimesheetModule { }
