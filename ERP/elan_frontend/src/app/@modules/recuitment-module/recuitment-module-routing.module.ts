import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecuitmentModuleComponent } from './recuitment-module.component';
import { AllCandidateListComponent } from './all-candidate-list/all-candidate-list.component';
import { RequestNewPositionComponent } from './request-new-position/request-new-position.component';
import { RequestNewPositionCreateComponent } from './request-new-position/request-new-position-create/request-new-position-create.component';
import { BvgListComponent } from './background-varification/bvg-list/bvg-list.component';
import { InterviewUpdateComponent } from './interview-status/interview-update/interview-update.component';
import { InterviewStatusListComponent } from './interview-status/varification-list/varification-list.component';
import { VarificationListComponent } from './background-varification/varification-list/varification-list.component';
import { CandidateProfileCreateComponent } from './candidate-profile/candidate-profile-create/candidate-profile-create.component';
import { CandidateProfileListComponent } from './candidate-profile/candidate-profile-list/candidate-profile-list.component';
import { CandidateShortCreateComponent } from './candidate-shortlist/candidate-short-create/candidate-short-create.component';
import { CandidateShortListComponent } from './candidate-shortlist/candidate-short-list/candidate-short-list.component';
import { InterviewlistCreateComponent } from './fixed-interview/interviewlist-create/interviewlist-create.component';
import { FixedInterviewComponent } from './fixed-interview/varification-list/varification-list.component';
import { HrDashboardComponent } from './hr-dashboard/hr-dashboard-list/hr-dashboard-list.component';
import { JobDescriptionCreateComponent } from './job-description-main/job-description-create/job-description-create.component';
import { JobDescriptionListComponent } from './job-description/job-description-list/job-description-list.component';
import { JobDescriptionComponent } from './job-description/job-description.component';
import { OnBoardingComponent } from './on-boarding/on-boarding.component';
import { PostOpeningCreateComponent } from './post-vacancy-opening/post-opening-create/post-opening-create.component';
import { PostOpeningListComponent } from './post-vacancy-opening/post-opening-list/post-opening-list.component';
import { RecruitmentDashboardComponent } from './recruitment-dashboard/recruitment-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: RecuitmentModuleComponent,
    children: [
      { path: 'all-candidates', component: AllCandidateListComponent },
      { path: 'interview-status-list', component: InterviewStatusListComponent },
      { path: 'interview-status', component: BvgListComponent },
      { path: 'interview-update', component: InterviewUpdateComponent },

      { path: 'verification-list', component: VarificationListComponent },
      {
        path: 'profile-list',
        component: CandidateProfileListComponent,
      },
      {
        path: 'profile-create',
        component: CandidateProfileCreateComponent,
      },
      { path: 'candidate-short-list', component: CandidateShortListComponent },
      { path: 'candidate-short-create', component: CandidateShortCreateComponent },
      { path: 'bvg-list', component: BvgListComponent, },
      { path: 'bvg', component: BvgListComponent },
      { path: 'request-new-position', component: RequestNewPositionCreateComponent },
      { path: 'fixed-interview', component: FixedInterviewComponent },
      { path: 'interviewlist-create', component: InterviewlistCreateComponent },
      { path: 'hr-dashboard', component: HrDashboardComponent },
      { path: 'bvg-list', component: BvgListComponent },
      { path: 'dialog/:candidate_id', component: BvgListComponent },
      { path: 'job-list', component: JobDescriptionListComponent },
      { path: 'job-create', component: JobDescriptionCreateComponent },
      { path: 'on-boarding', component: OnBoardingComponent },
      { path: 'post-opening-list', component: PostOpeningListComponent },
      { path: 'post-opening-create', component: PostOpeningCreateComponent },
      { path : 'dashboard',component:RecruitmentDashboardComponent},
      {
        path: 'offer-onboarding',
        loadChildren: () =>
          import(
            './offer-onboarding/offer-onboarding.module'
          ).then((m) => m.OfferOnboardingModule),
      },
      {
        path: 'job-discription-main',
        loadChildren: () =>
          import(
            './job-description-main/job-description-main.module'
          ).then((m) => m.JobDescriptionMainModule),
      },
      {
        path: 'candidate-profile',
        loadChildren: () =>
          import(
            './condidate-profile/condidate-profile.module'
          ).then((m) => m.CondidateProfileModule),
      },
      {
        path: 'scheduled-interview',
        loadChildren: () =>
          import(
            './scheduled-interview/scheduled-interview.module'
          ).then((m) => m.ScheduledInterviewModule),
      },
      {
        path: 'bgv',
        loadChildren: () =>
          import(
            './bgv/bgv.module'
          ).then((m) => m.BgvModule),
      },
      {
        path: 'shortlisted-candidate',
        loadChildren: () =>
          import(
            './shortlisted-candidate/shortlisted-candidate.module'
          ).then((m) => m.ShortlistedCandidateModule),
      },
      {
        path: 'offer-letter',
        loadChildren: () =>
          import(
            './offer-letter/offer-letter.module'
          ).then((m) => m.OfferLetterModule),
      },
      {
        path:'reports',
        loadChildren :()=> import('./recruitment-reports/recruitment-reports.module').then((m)=> m.RecruitmentReportsModule)
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecuitmentModuleRoutingModule { }
