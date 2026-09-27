import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-recruitment-reports',
  templateUrl: './recruitment-reports.component.html',
  styleUrls: ['./recruitment-reports.component.scss']
})
export class RecruitmentReportsComponent {
currentReport: string = '';

  reportMap: { [key: string]: string } = {
    '/master/recruitment/reports/job-description-report': 'Job Description Report',
    '/master/recruitment/reports/recruiter-month-report': 'Recruiter/Month Report',
    '/master/recruitment/reports/position-time-report': 'Position Time Report',
    '/master/recruitment/reports/recruiter-location-report': 'Recruiter Location Report',
    '/master/recruitment/reports/interview-round-report': 'Interview Round Report',
    '/master/recruitment/reports/recruiter-productivity-report': 'Recruiter Productivity Report',
    '/master/recruitment/reports/recruiter-round-report': 'Recruiter Round Report',
    '/master/recruitment/reports/jd-backouts-report': 'JD Backouts Report',
    '/master/recruitment/reports/interviewer-report': 'Interviewer Report',
    '/master/recruitment/reports/monthly-scheduled-interview-report': 'Monthly Scheduled Interview Report',
    '/master/recruitment/reports/interview-status-report': 'Status-Wise Interviewer Report',
    '/master/recruitment/reports/onboarding-report': 'Onboarding & Induction Report'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateCurrentReport(); 

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateCurrentReport();
      }
    });
  }

  updateCurrentReport(): void {
    const currentRoute = this.router.url;
    this.currentReport = this.reportMap[currentRoute] || 'Unknown Report'; 
  }
}
