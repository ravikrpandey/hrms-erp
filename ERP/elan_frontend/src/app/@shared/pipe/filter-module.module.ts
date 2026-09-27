import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrDashboardPipePipe } from './hr-dashboard-pipe.pipe';
import { HRPipe } from './my_pending_task_pipe/hr.pipe';
import { SafePipePipe } from './lms user-management/safe-pipe.pipe';
import { PlaylistPipe } from './lms user-management/playlist.pipe';
import { AssignedCoursesPipe } from './lms user-management/assigned-courses.pipe';
import { ItTicketingPipe } from './my_pending_task_pipe/it-ticketing.pipe';
import { DatepipePipe } from './datepipe.pipe';
// import { DatepipePipe } from './datepipe.pipe';




@NgModule({
  declarations: [
    HrDashboardPipePipe,
    HRPipe,
    SafePipePipe,
    PlaylistPipe,
    AssignedCoursesPipe,
    ItTicketingPipe,

     ],
  imports: [
    CommonModule
  ],
  exports:[
  ]
})
export class FilterPipeModule { }
