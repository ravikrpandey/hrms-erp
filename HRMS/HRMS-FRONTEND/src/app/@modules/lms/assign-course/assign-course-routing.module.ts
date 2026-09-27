import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignCourseComponent } from './assign-course.component';
import { AssignCourseDetailComponent } from './assign-course-detail/assign-course-detail.component';

const routes: Routes = [
  {
    path : '',component:AssignCourseComponent
  },
  {
    path : 'detail',component:AssignCourseDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignCourseRoutingModule { }
