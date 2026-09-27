import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BvgListComponent } from './bvg-list/bvg-list.component';
import { InterviewUpdateComponent } from './interview-update/interview-update.component';
import { InterviewStatusListComponent} from './varification-list/varification-list.component';

const routes: Routes = [
  {path:'interview-status-list', component : InterviewStatusListComponent},
  {path:'interview-status', component : BvgListComponent},
  {path:'interview-update', component : InterviewUpdateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterviewStatusRoutingModule { }
