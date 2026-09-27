import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColleagueReviewRoutingModule } from './colleague-review-routing.module';
import { ColleagueReviewComponent } from './colleague-review/colleague-review.component';
import { ColleagueReviewListComponent } from './colleague-review-list/colleague-review-list.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ColleagueReviewRoutingModule
  ]
})
export class ColleagueReviewModule { }
