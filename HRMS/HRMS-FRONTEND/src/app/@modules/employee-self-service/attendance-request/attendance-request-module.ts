import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceRequestRoutingModule } from './attendance-request-routing-module';
import { AttendanceRequest } from './attendance-request';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AttendanceRequestForm } from './attendance-request-form/attendance-request-form';
import { AttendanceRequestList } from './attendance-request-list/attendance-request-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';



@NgModule({
  declarations: [
    AttendanceRequest,
    AttendanceRequestForm,
    AttendanceRequestList
  ],
  imports: [
    CommonModule,
    AttendanceRequestRoutingModule,
    MaterialModule,
    FormsModule,
    AgGridModule,
    ReactiveFormsModule

  ]
})
export class AttendanceRequestModule { }
