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
import { MyTimesheetComponent } from './my-timesheet/my-timesheet.component';
import { CreateTimesheetComponent } from './my-timesheet/create-timesheet/create-timesheet.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogeMyTimesheetComponent } from './my-timesheet/dialoge-my-timesheet/dialoge-my-timesheet.component';

@NgModule({
  declarations: [
    TimesheetCreateComponent,
    TimesheetListComponent,
    TimesheetActionComponent,
    TimesheetDialogComponent,
    StatusComponent,
    MyTimesheetComponent,
    CreateTimesheetComponent,
    DialogeMyTimesheetComponent
  ],
  imports: [
    CommonModule,
    TimesheetRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    // MatTimepickerModule,
    NgxMatTimepickerModule,
    FullCalendarModule

  ]
})
export class TimesheetModule { }
