import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllAssessmentListComponent } from './all-assessment-list/all-assessment-list.component';
import { RangeAssessmentComponent } from './range-assessment/range-assessment.component';
import { DepartmentWiseComponent } from './department-wise-assessment/department-wise.component';
import { FinalComponent } from './final/final.component';

const routes: Routes = [
  {path:'' ,component:RangeAssessmentComponent},
  {path:'department' ,component:DepartmentWiseComponent},
  {path:'list' ,component:AllAssessmentListComponent},
  {path:'final' ,component:FinalComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinalAssessmentRoutingModule { }
