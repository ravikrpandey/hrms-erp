import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentFilterPipe } from './content-filter.pipe';
import { FilterCourseRequestPipe } from './filter-course-request.pipe';
import { FilterCourseAssignmentPipe } from './filter-course-assignment.pipe';
import { FilterPerformancePipe } from './filter-performance.pipe';
import { ToDoFilterPipe } from './to-do-filter.pipe';
import { RequestForFilterPipe } from './request-for-filter.pipe';
import { CategoryVideoSearchPipe } from './category-video-search.pipe';
import { SegmentVideoSearchPipe } from './segment-video-search.pipe';




@NgModule({
  declarations: [
    FilterCourseRequestPipe,
    FilterCourseAssignmentPipe,
    FilterPerformancePipe,
    ToDoFilterPipe,
    RequestForFilterPipe,
    CategoryVideoSearchPipe,
    SegmentVideoSearchPipe,
  ],
  imports: [
    CommonModule
  ],
  exports:[
  ]
})
export class FilterPipesModule { }
