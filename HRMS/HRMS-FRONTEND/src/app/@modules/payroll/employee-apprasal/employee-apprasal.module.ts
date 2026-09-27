import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeApprasalRoutingModule } from './employee-apprasal-routing.module';
import { EmployeeApprasalComponent } from './employee-apprasal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AppraisalFormComponent } from './appraisal-form/appraisal-form.component';
import { AllEmployessListComponent } from './all-employess-list/all-employess-list.component';
import { MyRequestListComponent } from './my-request-list/my-request-list.component';
import { PendingApprovelEmpComponent } from './pending-approvel-emp/pending-approvel-emp.component';
import { ApprovedListEmpComponent } from './approved-list-emp/approved-list-emp.component';
import { RejectListEmpComponent } from './reject-list-emp/reject-list-emp.component';
import { ApprovalLevelDialogComponent } from './approval-level-dialog/approval-level-dialog.component';
import { ActionAppraisalComponent } from './action-appraisal/action-appraisal.component';
import { UpdateApprisalEmpComponent } from './update-apprisal-emp/update-apprisal-emp.component';
import { ViewPerformanceEmpComponent } from './view-performance-emp/view-performance-emp.component';


@NgModule({
  declarations: [
    EmployeeApprasalComponent,
    AppraisalFormComponent,
    AllEmployessListComponent,
    MyRequestListComponent,
    PendingApprovelEmpComponent,
    ApprovedListEmpComponent,
    RejectListEmpComponent,
    ApprovalLevelDialogComponent,
    ActionAppraisalComponent,
    UpdateApprisalEmpComponent,
    ViewPerformanceEmpComponent
  ],
  imports: [
    CommonModule,
    EmployeeApprasalRoutingModule,
    FormsModule,
    ShairedModule,
    CommonModule,
    MaterialModule,
    AgGridModule,
    MatFormFieldModule,
    MatSelectFilterModule,
    ReactiveFormsModule

  ]
})
export class EmployeeApprasalModule { }
