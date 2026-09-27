import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCourseComponent } from './common-course.component';
import { CommonCourseDetaileComponent } from './common-course-detaile/common-course-detaile.component';

const routes: Routes = [

  {
    path: '',
    component: CommonCourseComponent,
  },
  { path: 'course-detail', component: CommonCourseDetaileComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonCourseRoutingModule { }
