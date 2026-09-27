import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllocatedCourseRoutingModule } from './allocated-course-routing.module';
import { AllocatedCourseComponent } from './allocated-course.component';
import { AllocateCourseDetailComponent } from './allocate-course-detail/allocate-course-detail.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    AllocatedCourseComponent,
    AllocateCourseDetailComponent,
    AssessmentComponent
  ],
  imports: [
    CommonModule,
    AllocatedCourseRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
  ]
})
export class AllocatedCourseModule { }
