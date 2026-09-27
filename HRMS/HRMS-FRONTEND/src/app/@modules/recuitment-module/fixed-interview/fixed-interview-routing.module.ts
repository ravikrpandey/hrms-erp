import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { BvgListComponent } from './bvg-list/bvg-list.component';
import { InterviewlistCreateComponent } from './interviewlist-create/interviewlist-create.component';
import { FixedInterviewComponent} from './varification-list/varification-list.component';

const routes: Routes = [
  {path:'fixed-interview', component : FixedInterviewComponent},
  {path:'interviewlist-create', component:InterviewlistCreateComponent},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FixedInterviewRoutingModule { }
