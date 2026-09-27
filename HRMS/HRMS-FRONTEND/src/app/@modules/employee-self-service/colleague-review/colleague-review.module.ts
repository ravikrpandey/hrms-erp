import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColleagueReviewRoutingModule } from './colleague-review-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ActionColleagueReview } from './action/action.component';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
@NgModule({
  declarations: [
    ActionColleagueReview
  ],
  imports: [
    CommonModule,
    ColleagueReviewRoutingModule,
    MatIconModule,
    AgGridModule,
    MaterialModule,
    SearchFilterComponent
  ]
})
export class ColleagueReviewModule { }
