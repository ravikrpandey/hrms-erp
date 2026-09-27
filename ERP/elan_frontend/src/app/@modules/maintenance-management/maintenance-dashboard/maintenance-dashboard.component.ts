import { Component, ChangeDetectorRef } from '@angular/core';

interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
}
@Component({
  selector: 'app-maintenance-dashboard',
  templateUrl: './maintenance-dashboard.component.html',
  styleUrls: ['./maintenance-dashboard.component.scss']
})
export class MaintenanceDashboardComponent {
  currentYear: number = 2010; // Default year
  currentMonth: number = 8;
  date = new Date(); // September (Months are 0-indexed in JavaScript)
  events: CalendarEvent[] = [
    {
      title: 'Workstation Name (Vendor || Inhouse)',
      startDate: new Date(2010, 8, 8),
      endDate: new Date(2010, 8, 10),
      color: 'red'
    },
    {
      title: 'Workstation Name (Vendor || Inhouse)',
      startDate: new Date(2010, 8, 14),
      endDate: new Date(2010, 8, 14),
      color: 'green'
    },
    {
      title: 'Workstation Name (Vendor || Inhouse)',
      startDate: new Date(2010, 8, 17),
      endDate: new Date(2010, 8, 17),
      color: 'yellow'
    }
  ];

  // Generate days for the current month
  getDaysInMonth() {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null); // Empty slots before the first day
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      days.push(date);
    }

    return days;
  }

  // Check if a date has events
  getEventsForDate(date: any) {
    return this.events.filter((event) => {
      return date >= event.startDate && date <= event.endDate;
    });
  }

  // Navigation
  changeMonth(delta: number) {
    this.currentMonth += delta;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
  }
  getMonthName(month: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  }
  getStartColumn(startDate: any): number {
    const start = new Date(startDate);
    const refDate = new Date(this.date);

    if (isNaN(start.getTime()) || isNaN(refDate.getTime())) {
      console.error('Invalid date format');
      return 0;
    }

    return Math.ceil((start.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  getEndColumn(endDate: any): number {
    const end = new Date(endDate);
    const refDate = new Date(this.date);

    if (isNaN(end.getTime()) || isNaN(refDate.getTime())) {
      console.error('Invalid date format');
      return 0;
    }

    return Math.ceil((end.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }


}
