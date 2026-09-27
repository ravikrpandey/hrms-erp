import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduledInterviewListComponent } from './scheduled-interview-list/scheduled-interview-list.component';
import { InterviewComponent } from './interview/interview.component';

const routes: Routes = [
  { path: '', component: ScheduledInterviewListComponent },
  { path: 'interview', component: InterviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduledInterviewRoutingModule { }
