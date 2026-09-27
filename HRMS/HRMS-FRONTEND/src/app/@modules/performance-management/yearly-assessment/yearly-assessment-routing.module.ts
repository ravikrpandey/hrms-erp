import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAssessmentComponent } from './list-assessment/list-assessment.component';

const routes: Routes = [
  {path:'' ,component:ListAssessmentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YearlyAssessmentRoutingModule { }
