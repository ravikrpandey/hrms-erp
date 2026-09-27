import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: number[] = [];
  selectedMonth: string = this.months[new Date().getMonth()];
  selectedYear: number = new Date().getFullYear();
  calendarDays: any[] = [];
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  attendanceData: any[] = [];
  mainId: string | null = null;
  selectedEmployee: any;

  constructor(
    private http: HttpClient,
    private services: AttendanceService
  ) {
    this.generateYears();
  }

  ngOnInit() {
    this.generateCalendar();
    this.loadAttendanceData();
  }

  generateYears() {
    const startYear = 1990;
    const endYear = new Date().getFullYear() + 30;
    this.years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }

  onMonthChange() {
    this.generateCalendar();
    this.loadAttendanceData();
  }

  onYearChange() {
    this.generateCalendar();
    this.loadAttendanceData();
  }

  generateCalendar() {
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const firstDayOfMonth = new Date(this.selectedYear, monthIndex, 1).getDay();
    const daysInMonth = new Date(this.selectedYear, monthIndex + 1, 0).getDate();

    this.calendarDays = [];
    let week: any[] = [];

    // Fill initial empty days for alignment
    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push({ date: '', color: '' });
    }

    // Fill the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ date: day, color: '' });
      if ((firstDayOfMonth + day) % 7 === 0) {
        this.calendarDays.push(week);
        week = [];
      }
    }

    // Add the last week if it has remaining days
    if (week.length) {
      this.calendarDays.push(week);
    }
  }

  loadAttendanceData() {
    
    this.attendanceData = [];
    this.mainId = localStorage.getItem('EmpMainId');
   
    let financial_id = localStorage.getItem("financial_id"); // Assuming financial_id is stored in local storage.
    const employeeId = this.selectedEmployee ? this.selectedEmployee : this.mainId;
  
    if (this.mainId && financial_id && employeeId) {
      this.services.get_attendance(this.mainId, financial_id, employeeId).subscribe(
        response => {
          console.log('API Response Data:', response);
          if (response && response.data) {
            this.attendanceData = response.data;
            this.applyAttendanceData();
          } else {
            console.error('No attendance data found for the given month and year.');
          }
        },
        error => {
          console.error('Error fetching attendance data:', error);
        }
      );
    } else {
      console.error('Required parameters not found in local storage.');
    }
  }
  
  applyAttendanceData() {
    // Iterate over attendance data and map it to calendar days
    this.attendanceData.forEach(entry => {
      const attendanceDate = new Date(entry.attendance_date);
      const date = attendanceDate.getDate();
      const month = attendanceDate.toLocaleString('default', { month: 'long' });
      const year = attendanceDate.getFullYear();

      if (month === this.selectedMonth && year === this.selectedYear) {
        let color = '';

        // Determine color based on attendance status
        switch (entry.attendanceStatus) {
          case 'Present':
            color = '#808000';
            break;
          case 'Absent':
            color = '#f4d03f';
            break;
          case 'Halfday':
            color = '#26c1d1';
            break;
            case 'Paid_Leave':
            color = '#f99d2a';
            break;
            case 'Holiday':
            color = '#ff2e2e';
            break;
          default:
            color = 'white'; // Default color for statuses not specified
        }

        // Update the calendar days with color based on attendance status
        this.calendarDays.forEach(week => {
          week.forEach((dayCell: { date: number; color: string; }) => {
            if (dayCell.date === date) {
              dayCell.color = color;
            }
          });
        });
      }
    });
  }
}
