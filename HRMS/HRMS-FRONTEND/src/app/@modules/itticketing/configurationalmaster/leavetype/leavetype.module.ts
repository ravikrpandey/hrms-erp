import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';

import { LeavetypeRoutingModule } from './leavetype-routing.module';
import { LeavetypeComponent } from './leavetype.component';
import { LeaveTypeActionComponent } from './leave-type-action/leave-type-action.component';
import { LeaveTypeDialogComponent } from './leave-type-dialog/leave-type-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeaveStatusComponent } from './leave-status/leave-status.component';


@NgModule({
  declarations: [
    LeavetypeComponent,
    LeaveTypeActionComponent,
    LeaveTypeDialogComponent,
    LeaveStatusComponent
  ],
  imports: [
    CommonModule,
    LeavetypeRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LeavetypeModule { }
