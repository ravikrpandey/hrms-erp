import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColleagueReviewListComponent } from './colleague-review-list/colleague-review-list.component';
import { ColleagueReviewComponent } from './colleague-review/colleague-review.component';

const routes: Routes = [
  {path:'',component:ColleagueReviewListComponent},
  {path:'add', component:ColleagueReviewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ColleagueReviewRoutingModule { }
