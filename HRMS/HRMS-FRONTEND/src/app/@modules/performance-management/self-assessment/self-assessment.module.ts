import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelfAssessmentRoutingModule } from './self-assessment-routing.module';
import { SelfAssessmentListComponent } from './self-assessment-list/self-assessment-list.component';
// import { CreateAssessmentComponent } from './create-assessment/create-assessment.component';
// import { ActionAssessmentComponent } from './action-assessment/action-assessment.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { HrmsModule } from '../../hrms/hrms.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActionAssessmentComponent } from './action-assessment/action-assessment.component';
import { CreateSelfAssessmentComponent } from './create-self-assessment/create-self-assessment.component';
import { ViewAssessmentComponent } from './view-assessment/view-assessment.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS, CustomDateAdapter } from 'src/app/@shared/adapter/custom-date-adapter';
import { ApprovalManagerComponent } from './approval-manager/approval-manager.component';
@NgModule({
  declarations: [
    SelfAssessmentListComponent,
    ActionAssessmentComponent,
    CreateSelfAssessmentComponent,
    ViewAssessmentComponent,
    ApprovalManagerComponent
  ],
  imports: [
    CommonModule,
    SelfAssessmentRoutingModule,
    MaterialModule,
    HrmsModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    CKEditorModule
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
})
export class SelfAssessmentModule { }
