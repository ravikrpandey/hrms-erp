import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LmsCourseCategoryComponent } from './lms-course-category.component';

const routes: Routes = [
  {path:"",component:LmsCourseCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LmsCourseCategoryRoutingModule { }
