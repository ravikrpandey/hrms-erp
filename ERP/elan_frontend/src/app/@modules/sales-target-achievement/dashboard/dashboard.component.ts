import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  months = [
    'April 2026',
    'May 2026',
    'June 2026',
    'July 2026',
    'August 2026',
    'September 2026',
    'October 2026',
    'November 2026',
    'December 2026',
    'January 2027',
    'February 2027',
    'March 2027'
  ];

  selectedMonth: string = '';

  constructor() {
    this.setCurrentMonth();
  }

  setCurrentMonth(): void {
    const currentDate = new Date();

    const currentMonth = currentDate.toLocaleString('default', {
      month: 'long'
    });

    const currentYear = currentDate.getFullYear();

    const formattedMonth = `${currentMonth} ${currentYear}`;

    this.selectedMonth = this.months.includes(formattedMonth)
      ? formattedMonth
      : 'April 2026';
  }
  
  dashboardSummary = {
    totalTarget: 5000000,
    totalAchievement: 3200000,
    totalPending: 1800000,
    achievementPercentage: 64,
    totalEmployees: 12,
    activeTargets: 8
  };

  currentMonthTargets = [
    {
      employee_name: 'Amit Sharma',
      target_amount: 500000,
      achieved_amount: 380000,
      pending_amount: 120000,
      achievement_percentage: 76,
      status: 'Active'
    },
    {
      employee_name: 'Rahul Verma',
      target_amount: 600000,
      achieved_amount: 420000,
      pending_amount: 180000,
      achievement_percentage: 70,
      status: 'Active'
    },
    {
      employee_name: 'Neha Singh',
      target_amount: 400000,
      achieved_amount: 340000,
      pending_amount: 60000,
      achievement_percentage: 85,
      status: 'Active'
    },
    {
      employee_name: 'Pooja Yadav',
      target_amount: 350000,
      achieved_amount: 210000,
      pending_amount: 140000,
      achievement_percentage: 60,
      status: 'Pending'
    }
  ];

  weeklyPerformance = [70, 82, 55, 90];

  pendingApprovals = [
    {
      employee_name: 'Amit Sharma',
      request_type: 'Achievement Approval'
    },
    {
      employee_name: 'Rahul Verma',
      request_type: 'Achievement Approval'
    },
    {
      employee_name: 'Neha Singh',
      request_type: 'Achievement Approval'
    }
  ];

  // Future API Integration
  // this.dashboardService.getDashboardData().subscribe((response: any) => {
  //   this.dashboardSummary = response.summary;
  //   this.currentMonthTargets = response.targets;
  // });
}
