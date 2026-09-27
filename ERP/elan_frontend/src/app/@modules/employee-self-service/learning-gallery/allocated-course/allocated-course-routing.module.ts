import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllocatedCourseComponent } from './allocated-course.component';
import { AllocateCourseDetailComponent } from './allocate-course-detail/allocate-course-detail.component';
import { AssessmentComponent } from './assessment/assessment.component';

const routes: Routes = [
  {path:'',component:AllocatedCourseComponent},
  {path:'allocate-course-detail',component:AllocateCourseDetailComponent},
  {path:'assessment',component:AssessmentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllocatedCourseRoutingModule { }
