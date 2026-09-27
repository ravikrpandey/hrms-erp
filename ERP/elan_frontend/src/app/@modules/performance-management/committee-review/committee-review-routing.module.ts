import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendCommitteeReviewComponent } from './send-committee-review/send-committee-review.component';
import { CommitteeReviewListComponent } from './committee-review-list/committee-review-list.component';
const routes: Routes = [
  {path:'' ,component:CommitteeReviewListComponent},
  {path:'send' ,component:SendCommitteeReviewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommitteeReviewRoutingModule { }
