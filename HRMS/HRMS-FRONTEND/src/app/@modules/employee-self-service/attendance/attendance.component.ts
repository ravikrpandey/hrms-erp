import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { MatDialog } from '@angular/material/dialog';
import { AttendanceDetailDialogComponent } from '../attendance-detail-dialog/attendance-detail-dialog.component';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  years: number[] = [];
  selectedMonth: string = this.months[new Date().getMonth()];
  selectedYear: number = new Date().getFullYear();
  calendarDays: any[] = [];
  daysOfWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  attendanceData: any[] = [];
  holidaysList: any[] = [];
  mainId: string | null = null;
  selectedEmployee: any;
  gmData: any;
  loginUserDetails: any;

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
    this.get_GLOBALMinutes();
    this.get_attendanceBYmonth();
  }

  generateYears() {
    const startYear = 1990;
    const endYear = new Date().getFullYear() + 30;
    this.years = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );
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
    const daysInMonth = new Date(
      this.selectedYear,
      monthIndex + 1,
      0
    ).getDate();

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
      const monthIndex = this.months?.findIndex(
        (month: any) => month === this.selectedMonth
      );
      console.log(this.selectedMonth);
      console.log(this.selectedYear);
      this.attendanceData = [];
      let entity_id = localStorage.getItem('selectedEntityId');
      this.mainId = localStorage.getItem('EmpMainId');
      let financial_id = localStorage.getItem('financial_id'); // Assuming financial_id is stored in local storage.
      const employeeId = this.selectedEmployee
        ? this.selectedEmployee
        : this.mainId;

      let req = {
        att_month: monthIndex + 1,
        att_year: this.selectedYear,
        entity_id: entity_id,
        employee_id: employeeId,
        financial_year_id: financial_id,
      };
      this.generateCalendar();
      this.services.get_attendanceBYmonth(req).subscribe(
        (response) => {
          console.log('API Response Data:', response);
          if (response && response.data) {
            this.attendanceData = response.data;
            this.holidaysList = response.holidays;
            this.applyAttendanceData();
          } else {
            console.error(
              'No attendance data found for the given month and year.'
            );
          }
        },
        (error) => {
          console.error('Error fetching attendance data:', error);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  get_GLOBALMinutes(): void {
    try {
      let entity_id = localStorage.getItem('selectedEntityId');
      this.loginUserDetails = localStorage.getItem('loginUserDetails');
      this.loginUserDetails = JSON.parse(this.loginUserDetails);
      let department_id = this.loginUserDetails.department_id;
      let designation_id = this.loginUserDetails.designation_id;

      console.log(this.loginUserDetails, 'this.loginUserDetails');
      let query = {
        designation_id: designation_id,
        department_id: department_id,
        entity_id: entity_id,
      };
      this.services.get_gobal_minutes(query).subscribe((res: any) => {
        if (res) {
          this.gmData = res.data.global_minute_value + ' Minutes';
          console.log(this.gmData, 'gmDatagmData');
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  // applyAttendanceData() {
  //   this.attendanceData.forEach(entry => {
  //     const attendanceDate: any = new Date(entry?.att_datetime);
  //     const date = attendanceDate.getDate();
  //     const month = attendanceDate.toLocaleString('default', { month: 'long' });
  //     const year = attendanceDate.getFullYear();

  //     let color = '';

  //     switch (entry?.attendance_status) {
  //       case 'P':
  //         color = '#28a745';
  //         break;
  //       case 'A':
  //         color = '#dc3545';
  //         break;
  //       case 'PL':
  //         color = '#007bff';
  //         break;
  //       case 'UL':
  //         color = '#fd7e14';
  //         break;
  //       case 'DA':
  //         color = '#6c757d';
  //         break;
  //       // case 'HD':
  //       //   color = '#ffc107';
  //       //   break;
  //       case 'H':
  //         color = '#dd4bf5';
  //         break;
  //       case 'PHL':
  //         color = '#86c1ff';
  //         break;
  //       case 'UHL':
  //         color = '#ffe5b4';
  //         break;
  //       case 'WFO':
  //         color = '#fde50f';
  //         break;
  //       case 'WHO':
  //         color = '#fde50f';
  //         break;
  //       case 'CO':
  //         color = '#03fff3';
  //         break;
  //       default:
  //         color = 'white';
  //     }
  //     // Present , Absent , Paid_leave, Unpaid_leave, Default_Absent, Default_present, Half_day, Paid_halfDay_leave, Unpaid_HalfDay_leave

  //     this.calendarDays.forEach(week => {
  //       week.forEach((dayCell: { date: number; color: string; details: [] }) => {
  //         if (dayCell.date === date) {
  //           dayCell.color = color;
  //           dayCell.details = entry?.in_out_details;
  //         }
  //       });
  //     });
  //   });

  //   this.calendarDays?.map((item: any) => {
  //     item.map((subItem: any) => {
  //       this.holidaysList.filter((elem: any) => {
  //         let dateObj = new Date(elem.date);
  //         let day = dateObj.getDate();
  //         if (day == subItem.date) {
  //           subItem.holiday_name = elem?.holiday_name
  //         }
  //       })
  //     })
  //   })
  //   console.log(this.calendarDays)
  // }
  applyAttendanceData() {
    this.attendanceData.forEach((entry) => {
      const attendanceDate: any = new Date(entry?.att_datetime);
      const date = attendanceDate.getDate();
      const month = attendanceDate.toLocaleString('default', { month: 'long' });
      const year = attendanceDate.getFullYear();

      let color = '';

      // Match attendance_status to their respective color codes
      switch (entry?.attendance_status) {
        case 'P': // Present
        case 'DP': // Default Present
          color = '#198754';
          break;
        case 'A': // Absent
          color = '#dc3545';
          break;
        case 'DA': // Default Absent
          color = '#6c757d';
          break;

        // Paid Leave
        case 'PFD': // Paid Full Day
          color = '#0d6efd';
          break;
        case 'PHD': // Paid Half Day
          color = '#66b2ff';
          break;

        // Half Paid Leave
        case 'HPFD': // Half Paid Full Day
          color = '#6f42c1';
          break;
        case 'HPHD': // Half Paid Half Day
          color = '#cda6ff';
          break;

        // Non Paid Leave
        case 'NPFD': // Non Paid Full Day
          color = '#fd7e14';
          break;
        case 'NPHD': // Non Paid Half Day
          color = '#ffc896';
          break;

        // Unpaid leave without quota
        case 'UL': // Unpaid Leave Full Day
          color = '#b02a37';
          break;
        case 'UHL': // Unpaid Half Leave
          color = '#e07a88';
          break;

        // Half Day
        case 'HD':
          color = '#20c997';
          break;

        // Comp Off
        case 'CO':
          color = '#0dcaf0';
          break;

        // Week Offs
        case 'WFO': // Week Full Day Off
          color = '#ffc107';
          break;
        case 'WHO': // Week Half Day Off
          color = '#ffec99';
          break;

        // Holiday
        case 'H':
          color = '#f032e6';
          break;

        default:
          color = 'white'; // Fallback for undefined status
      }

      // Apply color and attendance info to corresponding calendar cell
      this.calendarDays.forEach((week) => {
        week.forEach((dayCell: any) => {
          if (dayCell.date === date) {
            dayCell.color = color;
            dayCell.details = entry?.in_out_details;
            dayCell.id = entry?.id;
            dayCell.att_date = entry?.att_date;
          }
        });
      });
    });

    // Add holiday name to calendar cells from holidaysList
    this.calendarDays?.map((week: any) => {
      week.map((dayCell: any) => {
        this.holidaysList.filter((holiday: any) => {
          let dateObj = new Date(holiday.date);
          let holidayDate = dateObj.getDate();
          if (holidayDate === dayCell.date) {
            dayCell.holiday_name = holiday?.holiday_name;
          }
        });
      });
    });
  }
  showFullDetail(data: any) {
    console.log(data, 'data')
    this.get_daily_Attendance_Data(data);
    return;
    if (data?.details?.length) {
      const dialogRef = this.dialog.open(AttendanceDetailDialogComponent, {
        width: '40%',
        data: { data: data },
      });

      dialogRef.afterClosed().subscribe((result) => {});
    }
  }

  // for check in check out show
  get_daily_Attendance_Data(data: any) {
    debugger;
    let day = data.date + 1;
    let month = this.selectedMonth;
    let year = this.selectedYear;
    let dateString = `${day} ${month} ${year}`;
    let selectedDate = new Date(dateString);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const monthIndex = this.months?.findIndex(
      (month: any) => month === this.selectedMonth
    );
    let entity_id = localStorage.getItem('selectedEntityId');
    this.mainId = localStorage.getItem('EmpMainId');
    let financial_id = localStorage.getItem('financial_id'); // Assuming financial_id is stored in local storage.
    const employeeId = this.selectedEmployee
      ? this.selectedEmployee
      : this.mainId;

    let req = {
      att_date: formattedDate,
      entity_id: entity_id,
      employee_id: employeeId,
      financial_year_id: financial_id,
    };
    this.services.get_daily_Attendance_Data(req).subscribe((res) => {
      if (res) {
        const dialogRef = this.dialog.open(AttendanceDetailDialogComponent, {
          width: '40%',
          data: {
            data: res?.data,
            LATEIN: res?.LATEIN,
            LATEGO: res?.LATEGO,
            shift_name: res?.shift_name,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {});
      }
    });
  }

  // Financ year get start
  financialYearList: any = [];
  getFinancialYear() {
  this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
    if (res) {
      this.financialYearList = res?.data;

      // ✅ set default year (for example, latest financial year)
      if (this.financialYearList?.length > 0) {
        // if you want latest year (like 2025-2026)
        this.selectedYear = this.financialYearList[0].financial_year;

        // OR if you want current year based on today's date
        const currentYear = new Date().getFullYear().toString();
        const match = this.financialYearList.find((y:any) =>
          y.financial_year.includes(currentYear)
        );
        if (match) {
          this.selectedYear = match.financial_year;
        }
      }
    }
  });
}

}
