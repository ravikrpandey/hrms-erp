import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-travel-reports',
  templateUrl: './travel-reports.component.html',
  styleUrls: ['./travel-reports.component.scss']
})
export class TravelReportsComponent {
  currentReport: string = '';

  reportMap: { [key: string]: string } = {
    '/master/travel-management/reports/travel-report': 'Travel Report',
    '/master/travel-management/reports/expence-summary-report': 'Expense Summary Report',
    '/master/travel-management/reports/travel-expence-report': 'Employee Travel Expense Report',
    '/master/travel-management/reports/department-travel-report': 'Department-wise Travel & Expense Report',
    '/master/travel-management/reports/unsubmitted-expense-report': 'Unsubmitted Expenses Report',
    '/master/travel-management/reports/approval-status-report': 'Approval Status Report',
    '/master/travel-management/reports/reimbursement-report': 'Reimbursement Report',
    '/master/travel-management/reports/expense-reimbursement-report': 'Expense Reimbursement Cycle Time Report',
    '/master/travel-management/reports/expense-trend-report': 'Expense Trend Analysis Report',
  };
  

  constructor(
    private router: Router
  ) { }

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
