import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestedCourseComponent } from './requested-course.component';

const routes: Routes = [
  {path:'',component:RequestedCourseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestedCourseRoutingModule { }
