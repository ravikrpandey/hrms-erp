import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseApprovalRoutingModule } from './course-approval-routing.module';
import { CourseApprovalActionComponent } from './course-approval-action/course-approval-action.component';
import { CourseApprovalDialogComponent } from './course-approval-dialog/course-approval-dialog.component';
import { CourseApprovalComponent } from './course-approval.component';
import { PendingComponent } from './pending/pending.component';
import { ApprovedComponent } from './approved/approved.component';
import { RejectedComponent } from './rejected/rejected.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    CourseApprovalActionComponent,
    CourseApprovalDialogComponent,
    CourseApprovalComponent,
    PendingComponent,
    ApprovedComponent,
    RejectedComponent
  ],
  imports: [
    CommonModule,
    CourseApprovalRoutingModule,
     MatDialogModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    AgGridModule
  ]
})
export class CourseApprovalModule { }
