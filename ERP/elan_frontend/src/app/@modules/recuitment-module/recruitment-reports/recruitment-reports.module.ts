import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecruitmentReportsRoutingModule } from './recruitment-reports-routing.module';
import { RecruitmentReportsComponent } from './recruitment-reports.component';
import { JobDescriptionReportComponent } from './job-description-report/job-description-report.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectFilterModule } from 'mat-select-filter';
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


@NgModule({
  declarations: [
    RecruitmentReportsComponent,
    JobDescriptionReportComponent,
    RecruiterMonthReportComponent,
    PositionTimeReportComponent,
    RecruiterLocationReportComponent,
    InterviewRoundReportComponent,
    RecruiterProductivityReportComponent,
    RecruiterRoundReportComponent,
    BackoutsJdReportComponent,
    InterviewerReportComponent,
    MonthlyScheduledInterviewReportComponent,
    InterviewStatusReportComponent,
    OnboardingReportComponent
  ],
  imports: [
    CommonModule,
    RecruitmentReportsRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSelectFilterModule
    ]
})
export class RecruitmentReportsModule { }
