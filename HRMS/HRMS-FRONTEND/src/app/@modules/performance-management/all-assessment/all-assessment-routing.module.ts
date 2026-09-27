import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllAssessmentListComponent } from './all-assessment-list/all-assessment-list.component';
import { RangeAssessmentComponent } from './range-assessment/range-assessment.component';
import { SendCommitteeReviewComponent } from './send-committee-review/send-committee-review.component';
import { DepartmentWiseComponent } from './department-wise-assessment/department-wise.component';

const routes: Routes = [
  {path:'' ,component:RangeAssessmentComponent},
  {path:'department' ,component:DepartmentWiseComponent},
  {path:'list' ,component:AllAssessmentListComponent},
  {path:'send-committee-review' ,component:SendCommitteeReviewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllAssessmentRoutingModule { }
