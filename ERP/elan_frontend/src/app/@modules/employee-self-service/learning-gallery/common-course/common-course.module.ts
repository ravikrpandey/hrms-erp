import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCourseRoutingModule } from './common-course-routing.module';
import { CommonCourseComponent } from './common-course.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonCourseDetaileComponent } from './common-course-detaile/common-course-detaile.component';
import {MaterialModule} from "../../../../@shared/material/material.module";


@NgModule({
  declarations: [
    CommonCourseComponent,
    CommonCourseDetaileComponent
  ],
    imports: [
        CommonModule,
        CommonCourseRoutingModule,
        MatIconModule,
        MaterialModule
    ]
})
export class CommonCourseModule { }
