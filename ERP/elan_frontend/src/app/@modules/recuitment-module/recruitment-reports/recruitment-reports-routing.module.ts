import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecruitmentReportsComponent } from './recruitment-reports.component';
import { JobDescriptionReportComponent } from './job-description-report/job-description-report.component';
import { RecruiterMonthReportComponent } from './recruiter-month-report/recruiter-month-report.component';
import { PositionTimeReportComponent } from './position-time-report/position-time-report.component';
import { RecruiterLocationReportComponent } from './recruiter-location-report/recruiter-location-report.component';
import { InterviewRoundReportComponent } from './interview-round-report/interview-round-report.component';
import { RecruiterProductivityReportComponent } from './recruiter-productivity-report/recruiter-productivity-report.component';
import { RecruiterRoundReportComponent } from './recruiter-round-report/recruiter-round-report.component';
import { BackoutsJdReportComponent } from './backouts-jd-report/backouts-jd-report.component';
import { InterviewerReportComponent } from './interviewer-report/interviewer-report.component';
import { MonthlyScheduledInterviewReportComponent } from './monthly-scheduled-interview-report/monthly-scheduled-interview-report.component';
import { InterviewStatusReportComponent } from './interview-status-report/interview-status-report.component';
import { OnboardingReportComponent } from './onboarding-report/onboarding-report.component';

const routes: Routes = [
  {
    path: '',
    component: RecruitmentReportsComponent,
    children: [
      {path: '',redirectTo: 'job-description-report',pathMatch:'full'},
      {path: 'job-description-report', component: JobDescriptionReportComponent},
      {path : 'recruiter-month-report', component : RecruiterMonthReportComponent},
      {path : 'position-time-report',component : PositionTimeReportComponent},
      {path : 'recruiter-location-report' , component : RecruiterLocationReportComponent},
      {path: 'interview-round-report', component : InterviewRoundReportComponent},
      {path: 'recruiter-productivity-report', component : RecruiterProductivityReportComponent},
      {path: 'recruiter-round-report', component : RecruiterRoundReportComponent},
      {path: 'jd-backouts-report', component : BackoutsJdReportComponent},
      {path: 'interviewer-report', component : InterviewerReportComponent},
      {path: 'monthly-scheduled-interview-report', component : MonthlyScheduledInterviewReportComponent},
      {path: 'interview-status-report', component : InterviewStatusReportComponent},
      {path: 'onboarding-report', component : OnboardingReportComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentReportsRoutingModule { }
