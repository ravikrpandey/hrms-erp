import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceApprovalRoutingModule } from './attendance-approval-routing-module';
import { AttendanceApproval } from './attendance-approval';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { AttendanceApprovalStatus } from './attendance-approval-status/attendance-approval-status';
import { ActionAttendanceApprovalComponent } from './action-attendance-approval/action-attendance-approval';
import { ActionAttendanceApprovalDialog } from './action-attendance-approval-dialog/action-attendance-approval-dialog';


@NgModule({
  declarations: [
    AttendanceApproval,
    AttendanceApprovalStatus,
    ActionAttendanceApprovalComponent,
    ActionAttendanceApprovalDialog,
  ],
  imports: [
    CommonModule,
    AttendanceApprovalRoutingModule,
    MaterialModule,
    AgGridModule,

  ]
})
export class AttendanceApprovalModule { }
