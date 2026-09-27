import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LmsComponent } from './lms.component';

const routes: Routes = [
 { path: '',
    component: LmsComponent,
    children: [
      {
        path: 'course',
        loadChildren: () =>
          import('./all-courses/all-courses.module').then(
            (m) => m.AllCoursesModule
          )
      },
      {
        path:'assign-course',
        loadChildren :()=>
          import('./assign-course/assign-course.module').then(m=>m.AssignCourseModule)
      },
      {
        path: 'course-request',
        loadChildren: () =>
          import('./course-request/course-request.module').then(m=> m.CourseRequestModule)
      },
      {
        path: 'achievers',
        loadChildren: () =>
          import('./achivers/achivers-module').then(m=> m.AchiversModule)
      }
]
 }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LmsRoutingModule { }
