import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {
  tabs = [
    { key: 'time-logs', label: 'Time Logs' },
    { key: 'timesheets', label: 'Timesheets' },
    { key: 'jobs', label: 'Jobs' },
    { key: 'projects', label: 'Projects' },
    { key: 'expense-report', label: 'Expense & Budget Report' }
  ];

  activeTab: string = 'time-logs';

  constructor() {}

  ngOnInit(): void {}

  setActiveTab(key: string): void {
    this.activeTab = key;
  }
}
