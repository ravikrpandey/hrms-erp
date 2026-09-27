import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateRequestComponent } from './create-request/create-request.component';
import { ToBeApprovedComponent } from './to-be-approved/to-be-approved.component';
import { ActionComponent } from './to-be-approved/action/action.component';
import { AttendenceDialogueComponent } from './attendence-dialogue/attendence-dialogue.component';
import { MatSelectFilterModule } from "mat-select-filter";
import { OvertimeApproveComponent } from './overtime-approve/overtime-approve.component';
import { OvertimeRejectComponent } from './overtime-reject/overtime-reject.component';
import { OvertimeRequestActionComponent } from './overtime-request-action/overtime-request-action.component';
import { OvertimeRequestListComponent } from './overtime-request-list/overtime-request-list.component';
import { OvertimeRequestRoutingModule } from './overtime-request-routing.module';
import { ALLOvertimeListActionComponent } from './all-overtime-list/all-overtime-list-action/all-overtime-list-action.component';
import { AllOvertimeListComponent } from './all-overtime-list/all-overtime-list.component';


@NgModule({
  declarations: [
    OvertimeRequestListComponent,
    AllOvertimeListComponent,
    OvertimeApproveComponent,
    OvertimeRejectComponent,
    CreateRequestComponent,
    ToBeApprovedComponent,
    ActionComponent,
    OvertimeRequestActionComponent,
    AttendenceDialogueComponent,
    ALLOvertimeListActionComponent
  ],
  imports: [
    CommonModule,
    OvertimeRequestRoutingModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectFilterModule
]
})
export class ExtraHourRequestModule { }
