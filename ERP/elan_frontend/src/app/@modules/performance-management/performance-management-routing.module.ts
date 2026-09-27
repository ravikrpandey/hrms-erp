import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceManagementComponent } from './performance-management.component';

const routes: Routes = [
  {
    path: '', component: PerformanceManagementComponent,
    children: [
      // {
      //   path: '', redirectTo: 'account-receivable', pathMatch: 'full'
      // },
      {
        path: 'yearly-assessment',
        loadChildren: () =>
          import('./yearly-assessment/yearly-assessment.module').then(
            (m) => m.
            YearlyAssessmentModule
          ),
      },
      {
        path: 'team-performance-assessment',
        loadChildren: () =>
          import('./self-assessment/self-assessment.module').then(
            (m) => m.
            SelfAssessmentModule
          ),
      },
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
      },
      {
        path: 'final-assessment',
        loadChildren: () =>
          import('./final-assessment/final-assessment.module').then(
            (m) => m.
            FinalAssessmentModule
          ),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceManagementRoutingModule { }
