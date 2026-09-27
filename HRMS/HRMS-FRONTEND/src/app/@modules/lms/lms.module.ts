import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LmsRoutingModule } from './lms-routing.module';
import { AllCoursesModule } from './all-courses/all-courses.module';
import { LmsComponent } from './lms.component';
import { ShairedModule } from "../../@shared/shaired/shaired.module";
import { CourseRequestComponent } from './course-request/course-request.component';



@NgModule({
  declarations: [
    LmsComponent
  ],
  imports: [
    CommonModule,
    LmsRoutingModule,
    AllCoursesModule,
    ShairedModule
    
]
})
export class LmsModule { }
