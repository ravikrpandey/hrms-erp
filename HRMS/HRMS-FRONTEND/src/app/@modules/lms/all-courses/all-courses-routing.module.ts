import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllCoursesComponent } from './all-courses.component';
import { AddCoursesComponent } from './add-courses/add-courses.component';
import { AddContentComponent } from './add-content/add-content.component';
import { AddAssesmentComponent } from './add-assesment/add-assesment.component';

const routes: Routes = [
  {
  path:'',component:AllCoursesComponent
},
{
  path: 'add_course',component :AddCoursesComponent
},
{
  path: 'add_content',component :AddContentComponent
},
{
  path: 'add_assesment',component :AddAssesmentComponent
}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllCoursesRoutingModule { }
