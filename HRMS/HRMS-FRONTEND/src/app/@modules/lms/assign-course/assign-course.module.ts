import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignCourseRoutingModule } from './assign-course-routing.module';
import { AssignCourseComponent } from './assign-course.component';
import { DialogAllocateCourseComponent } from './dialog-allocate-course/dialog-allocate-course.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';
import { AssignCourseActionComponent } from './assign-course-action/assign-course-action.component';
import { AssignCourseDetailComponent } from './assign-course-detail/assign-course-detail.component';
import { AssignAssessmentActionComponent } from './assign-course-detail/assign-assessment-action/assign-assessment-action.component';
import { AssignAssessmentDialogComponent } from './assign-course-detail/assign-assessment-dialog/assign-assessment-dialog.component';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AssignCourseComponent,
    DialogAllocateCourseComponent,
    AssignCourseActionComponent,
    AssignCourseDetailComponent,
    AssignAssessmentActionComponent,
    AssignAssessmentDialogComponent
  ],
  imports: [
    CommonModule,
    AssignCourseRoutingModule,
    MatDialogModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    AgGridModule,
    MatListModule,
    MatTabsModule,
    MatTooltipModule,
    SearchFilterComponent,
    MatCheckboxModule,
  ]
})
export class AssignCourseModule { }
