import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceAssessmentComponent } from './performance-assessment.component';

const routes: Routes = [
  {
    path: '', component: PerformanceAssessmentComponent,
    children: [
      // {
      //   path: '', redirectTo: 'account-receivable', pathMatch: 'full'
      // },
      {
        path: 'all-assessment',
        loadChildren: () =>
          import('./all-assessment/all-assessment.module').then(
            (m) => m.
            AllAssessmentModule
          ),
      },
      {
        path: 'committee-review',
        loadChildren: () =>
          import('./committee-review/committee-review.module').then(
            (m) => m.
            CommitteeReviewModule
          ),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceAssessmentRoutingModule { }
