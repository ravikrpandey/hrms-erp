import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { RangeAssessmentComponent } from './range-assessment/range-assessment.component';
import { DepartmentWiseComponent } from './department-wise-assessment/department-wise.component';
import { AllAssessmentListComponent } from './all-assessment-list/all-assessment-list.component';
import { SendCommitteeReviewComponent } from './send-committee-review/send-committee-review.component';
import { AllAssessmentRoutingModule } from './all-assessment-routing.module';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS, CustomDateAdapter } from 'src/app/@shared/adapter/custom-date-adapter';
import { MatSelectFilterModule } from 'mat-select-filter';
@NgModule({
  declarations: [
    RangeAssessmentComponent,
    DepartmentWiseComponent,
    AllAssessmentListComponent,
    SendCommitteeReviewComponent,
    ActionAssessmentComponent,
  ],
  imports: [
    CommonModule,
    AllAssessmentRoutingModule,
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
    CKEditorModule,
    MatSelectFilterModule
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
})
export class AllAssessmentModule { }
