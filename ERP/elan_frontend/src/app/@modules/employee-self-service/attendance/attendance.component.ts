import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { MatDialog } from '@angular/material/dialog';
import { AttendanceDetailDialogComponent } from '../attendance-detail-dialog/attendance-detail-dialog.component';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';

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
    private services: AttendanceService,
    public dialog: MatDialog,
    private $miscellaneous: MiscellaneousService
  ) {
    this.generateYears();
  }

  ngOnInit() {
    this.getFinancialYear();
    this.get_attendanceBYmonth();
  }

  generateYears() {
    const startYear = 1990;
    const endYear = new Date().getFullYear() + 30;
    this.years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }

  onMonthChange() {
    this.generateCalendar();
  }

  onYearChange() {
    this.generateCalendar();
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


  get_attendanceBYmonth() {
    try {
      
      const monthIndex = this.months?.findIndex((month: any) => month === this.selectedMonth);
      console.log(this.selectedMonth);
      console.log(this.selectedYear);
      this.attendanceData = [];
      let entity_id = localStorage.getItem("selectedEntityId");
      this.mainId = localStorage.getItem('EmpMainId');
      let financial_id = localStorage.getItem("financial_id"); // Assuming financial_id is stored in local storage.
      const employeeId = this.selectedEmployee ? this.selectedEmployee : this.mainId;

      let req = {
        att_month: monthIndex + 1,
        att_year: this.selectedYear,
        entity_id: entity_id,
        employee_id: employeeId,
        financial_year_id: financial_id,
      }
      this.generateCalendar();
      this.services.get_attendanceBYmonth(req).subscribe(
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
    } catch (err) {
      console.log(err)
    }
  }

  applyAttendanceData() {
    
    this.attendanceData.forEach(entry => {
      const attendanceDate: any = new Date(entry?.att_datetime);
      const date = attendanceDate.getDate();
      const month = attendanceDate.toLocaleString('default', { month: 'long' });
      const year = attendanceDate.getFullYear();

      let color = '';

      switch (entry?.attendance_status) {
        case 'P':
          color = '#28a745';
          break;
        case 'A':
          color = '#dc3545';
          break;
        case 'PL':
          color = '#007bff';
          break;
        case 'UL':
          color = '#fd7e14';
          break;
        case 'DA':
          color = '#6c757d';
          break;
        case 'DP':
          color = '#d4edda';
          break;
        case 'HD':
          color = '#ffc107';
          break;
        case 'PHL':
          color = '#cce5ff';
          break;
        case 'UHL':
          color = '#ffe5b4';
          break;
        default:
          color = 'white';
      }
      // Present , Absent , Paid_leave, Unpaid_leave, Default_Absent, Default_present, Half_day, Paid_halfDay_leave, Unpaid_HalfDay_leave

      this.calendarDays.forEach(week => {
        week.forEach((dayCell: { date: number; color: string; details: [] }) => {
          if (dayCell.date === date) {
            dayCell.color = color;
            dayCell.details = entry?.in_out_details;
          }
        });
      });
    });
    console.log(this.calendarDays)
  }

  showFullDetail(data: any) {
    
    if (data?.details?.length) {
      const dialogRef = this.dialog.open(AttendanceDetailDialogComponent, {
        width: '40%',
        data: { data: data }
      });

      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  // Financ year get start
  financialYearList: any = [];
  getFinancialYear() {
    
    this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
      if (res) {
        this.financialYearList = res?.data;
        this.financialYearList?.map((item: any)=> item.financial_year = Number(item?.financial_year))
      }
    }
    )
  }

}
