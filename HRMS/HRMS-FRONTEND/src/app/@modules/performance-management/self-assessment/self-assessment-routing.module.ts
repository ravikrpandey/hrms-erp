import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelfAssessmentListComponent } from './self-assessment-list/self-assessment-list.component';
import { CreateSelfAssessmentComponent } from './create-self-assessment/create-self-assessment.component';
import { ApprovalManagerComponent } from './approval-manager/approval-manager.component';

const routes: Routes = [
  { path: '', component: SelfAssessmentListComponent },
  { path: 'create-assessement', component: CreateSelfAssessmentComponent },
  { path: 'Approval-Manager', component: ApprovalManagerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelfAssessmentRoutingModule { }
