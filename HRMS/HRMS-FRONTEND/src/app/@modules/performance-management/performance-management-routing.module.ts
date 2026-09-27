import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceManagementComponent } from './performance-management.component';

const routes: Routes = [
  {
    path: '', component: PerformanceManagementComponent,
    children: [
      {
        path: 'pms-dashboard',
        loadChildren: () =>
          import('./pms-dashboard/pms-dashboard.module').then(
            (m) => m.
            PmsDashboardModule
          ),
      },
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
      },
      {
        path: 'kpa-master',
        loadChildren: () => import('../hrms/kpa/kpa.module').then((m) => m.KpaModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceManagementRoutingModule { }
