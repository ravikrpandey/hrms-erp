import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseRequestComponent } from './course-request.component';
import { CourseRequestAllocateComponent } from './course-request-allocate/course-request-allocate.component';

const routes: Routes = [
  {
    path: '',component : CourseRequestComponent,
  },
  {
    path: 'course-request-allocate',component : CourseRequestAllocateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRequestRoutingModule { }
