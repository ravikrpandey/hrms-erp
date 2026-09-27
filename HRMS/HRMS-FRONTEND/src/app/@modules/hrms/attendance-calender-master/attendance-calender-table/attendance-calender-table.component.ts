import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { MatDialog } from '@angular/material/dialog';
import { AttendanceDetailDialogComponent } from '../attendance-detail-dialog/attendance-detail-dialog.component';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { AttendanceDialogComponent } from '../attendance-dialog/attendance-dialog.component';
import { MissAttendanceDialogComponent } from '../missing-attendance-dialog/missattendance-dialog.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-attendance-calender-table',
  templateUrl: './attendance-calender-table.component.html',
  styleUrls: ['./attendance-calender-table.component.scss'],
})
export class AttendanceCalenderTableComponent implements OnInit {
  loginemployeejobtype: any;
  loginTimeemployee_id: any;
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
  filterId: any;
  selectedEmployee1: any = [];
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
  selectMonth: any;
  selectYear: any;
  selectemployee: any;
  dailyAttendance: any[] = [];
  totalLateInMinutes: any;
  allMinute: any;
  minafterdeducation: any;
  selectedEmployeeId: any;
  mainId: string | null = null;
  exportToExceldata: any = [];
  filterEmployeeExportToexceldata: any = [];
  selectedEmployee: any;
  financialYearList: any = [];
  employees: any[] = [];
  fiteredemployee: any;
  EmployeData: any[] = [];
  gmData: any;
  loginUserDetails: any;
  departmentdata: any = [];
  originalDepartmentList: any = [];
  employeeList2: any = [];
  selectedDepartment: any = [];
  uniquedata: any = [];
  department_id: any;
  filterEmployeedata: any = [];
  day: any = [];
  departmentid: any;
  constructor(
    private http: HttpClient,
    private services: AttendanceService,
    public dialog: MatDialog,
    private $miscellaneous: MiscellaneousService
  ) {
    this.generateYears();
  }

  ngOnInit() {
    this.get_attendanceBYmonth();
    this.loadEmployees(event);

    this.getFinancialYear();
    let selectedEntityId = parseInt(
      localStorage.getItem('selectedEntityId') || '0',
      10
    );
    this.services.get_all_employe(selectedEntityId).subscribe((response) => {
      if (response && response.data) {
        this.employees = response.data;
        this.filterId = parseInt(localStorage.getItem('EmpMainId') || '0', 10);
        this.getEmployee_id(this.filterId);
        this.selectedEmployee1 = this.employees.filter((item: any) => {
          return parseInt(item.employee_id) == this.filterId;
        });
        this.department_id = this.selectedEmployee1.map((item: any) => {
          return item.dept_id;
        });
        this.onSelectdepartment(this.department_id[0]);
        this.loginemployeejobtype = this.selectedEmployee1[0].job_type;
        this.loginTimeemployee_id = this.selectedEmployee1[0].employee_id;
        this.services.updateSelectedEmployee({
          employee_id: this.loginTimeemployee_id,
          job_type: this.loginemployeejobtype,
        });
      }
    });
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

    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push({ date: '', color: '' });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ date: day, color: '' });
      if ((firstDayOfMonth + day) % 7 === 0) {
        this.calendarDays.push(week);
        week = [];
      }
    }

    if (week.length) {
      this.calendarDays.push(week);
    }
  }

  attTime: any;
  openDialog = (event: MouseEvent, day: any) => {
    this.day = day.date;
    event.stopPropagation();

    let dayData = this.day + 1;
    let monthData = this.selectedMonth;
    let year = this.selectedYear;
    let dateString = `${dayData} ${monthData} ${year}`;
    let selectedDate = new Date(dateString);
    const formattedDateData = selectedDate.toISOString().split('T')[0];

    let entity_id = localStorage.getItem('selectedEntityId');
    this.mainId = localStorage.getItem('EmpMainId');
    let financial_id = localStorage.getItem('financial_id');
    const employeeId = this.selectedEmployee
      ? this.selectedEmployee
      : this.mainId;

    let req = {
      att_date: formattedDateData,
      entity_id: entity_id,
      employee_id: employeeId,
      financial_year_id: financial_id,
    };
    this.services.get_daily_Attendance_Data(req).subscribe((res) => {
      if (res) {

        const dialogRef = this.dialog.open(AttendanceDialogComponent, {
          width: '40%',
          data: {
            data: day,
            punchData: res?.data,
          },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
          this.get_attendanceBYmonth();
          this.getFinancialYear();
        });
      }
    })
    const days = String(this.day).padStart(2, '0');
    let month = this.selectedMonth;
    let selectedMonth = this.selectedMonth;
    const monthMap: { [key: string]: string } = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12',
    };
    if (isNaN(Number(month))) {
      month = monthMap[month] ?? '01';
    }
    const formattedDate = `${this.selectedYear}-${month}-${days}`;
    const today = new Date();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
    this.attTime = `${formattedDate} ${hours}:${minutes}:${seconds}`;
    const monthNames = [
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
    const formattedDatee = String(selectedMonth).padStart(2, '0');
    const monthIndex = monthNames.indexOf(formattedDatee) + 1;
    const finalFormattedDate =
      monthIndex <= 9
        ? `${monthIndex}`
        : monthIndex.toString().padStart(2, '0');
    this.services.updateSelectedDate({
      formattedDate,
      date: finalFormattedDate,
      attTime: this.attTime,
    });
  };

  openmissingDialog = (event: MouseEvent) => {
    event.stopPropagation();
    const dialogRef = this.dialog.open(MissAttendanceDialogComponent, {
      width: '40%',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.get_attendanceBYmonth();
      this.getFinancialYear();
    });
  };

  get_attendanceBYmonth() {
    try {
      const monthIndex = this.months?.findIndex(
        (month: any) => month === this.selectedMonth
      );

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
      this.get(monthIndex + 1, this.selectedYear);
      this.services.get_attendanceBYmonth(req).subscribe(
        (response) => {
          if (response && response.data) {
            this.attendanceData = response.data;
            this.holidaysList = response.holidays;
            this.applyAttendanceData();
          } else {
            // console.error(
            //    'No attendance data found for the given month and year.'
            //  );
          }
        },
        (error) => {
          // console.error('Error fetching attendance data:', error);
        }
      );
    } catch (err) {
      // console.log(err);
    }
  }
  originalGlobalMinutes: number = 0;

  get_GLOBALMinutes(): void {
    try {
      let entity_id = localStorage.getItem('selectedEntityId');
      this.loginUserDetails = localStorage.getItem('loginUserDetails');
      this.loginUserDetails = JSON.parse(this.loginUserDetails);
      let department_id = this.loginUserDetails.department_id;
      let designation_id = this.loginUserDetails.designation_id;

      let employeeObj = this.employees.find(
        (item: any) => item.employee_id == this.selectedEmployee
      );
      let query = {
        designation_id: employeeObj?.designation_id
          ? employeeObj.designation_id
          : designation_id,
        department_id: employeeObj?.department_id
          ? employeeObj.department_id
          : department_id,
        entity_id: employeeObj?.entity_id ? employeeObj.entity_id : entity_id,
      };
      this.services.get_gobal_minutes(query).subscribe((res: any) => {
        // if (res) {
        //   this.gmData =
        //     (this.minafterdeducation != null
        //       ? this.minafterdeducation
        //       : res.data.global_minute_value) + ' Minutes';
        // }
        if (res?.data?.global_minute_value != null) {
          this.originalGlobalMinutes = parseInt(res.data.global_minute_value);
          this.updateRemainingMinutes();
        }
      });
    } catch (err) { }
  }

  // applyAttendanceData() {
  //   this.attendanceData.forEach((entry) => {
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

  //     // holidaysList
  //     this.calendarDays.forEach((week) => {
  //       week.forEach(
  //         (dayCell: {
  //           att_date: any;
  //           id: any;
  //           date: number;
  //           color: string;
  //           details: [];
  //         }) => {
  //           if (dayCell.date === date) {
  //             dayCell.color = color;

  //             dayCell.details = entry?.in_out_details;
  //             dayCell.id = entry?.id;
  //             dayCell.att_date = entry?.att_date;
  //           }
  //         }
  //       );
  //     });
  //   });

  //   this.calendarDays?.map((item: any) => {
  //     item.map((subItem: any) => {
  //       this.holidaysList.filter((elem: any) => {
  //         let dateObj = new Date(elem.date);
  //         let day = dateObj.getDate();
  //         if (day == subItem.date) {
  //           subItem.holiday_name = elem?.holiday_name;
  //         }
  //       });
  //     });
  //   });
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
    this.get_daily_Attendance_Data(data);
    return;
    if (data?.details?.length) {
      const dialogRef = this.dialog.open(AttendanceDetailDialogComponent, {
        width: '40%',
        data: { data: data },
      });

      dialogRef.afterClosed().subscribe((result) => { });
    }
  }

  get_daily_Attendance_Data(data: any) {
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
    let financial_id = localStorage.getItem('financial_id');
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
        this.dailyAttendance = res.data;

        const dialogRef = this.dialog.open(AttendanceDetailDialogComponent, {
          width: '40%',
          data: {
            data: res?.data,
            LATEIN: res?.LATEIN,
            LATEGO: res?.LATEGO,
            shift_name: res?.shift_name,
          },
        });

        dialogRef.afterClosed().subscribe((result) => { });
      }
    });
  }

  onSelectdepartment(event: any) {
    this.department_id = event;
    this.loadEmployees(this.department_id);
  }

  filterDepartment: any;
  filterEmployeelist: any
  loadEmployees(departmentId: any) {
    this.filterEmployeedata = [];
    const selectedEntityId = localStorage.getItem('selectedEntityId');
    this.services.get_all_employe(selectedEntityId).subscribe((response) => {
      if (response && response.data) {
        this.employees = response.data;
        this.filterEmployeedata = this.employees.filter(
          (item: any) => item.dept_id == departmentId
        );
        this.filterEmployeelist = [...this.filterEmployeedata]
        this.selectedEmployee = Number(localStorage.getItem('EmpMainId'));
        this.departmentdata = this.employees.filter(
          (item: any, index, self) =>
            index === self.findIndex((t) => t.dept_id === item.dept_id)
        );
        this.originalDepartmentList = [...this.departmentdata];
        this.filterDepartment = [...this.departmentdata]
        this.employeeList2 = [...this.employees];
      }
    });
    this.ExportToexceldata(this.department_id);
  }

  filterThedepartment(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.departmentdata = [...this.originalDepartmentList];
    } else {
      this.departmentdata = this.originalDepartmentList.filter((item: any) =>
        item?.department_name?.toLowerCase().includes(searchValue)
      );
    }
  }

  employeeSearch(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.filterEmployeedata = [...this.employeeList2];

    } else {
      const value = searchValue.toLowerCase().trim();
      this.filterEmployeedata = this.employeeList2.filter(
        (item: any) =>
          item.first_name?.toLowerCase().includes(value) ||
          item.last_name?.toLowerCase().includes(value) ||
          item.employee_id?.toString().includes(value)
      );
    }
  }

  onEmployeeChange() {
    this.get_attendanceBYmonth();
    this.get_GLOBALMinutes();
  }

  employeeData(event: any) {
    if (!event || typeof event !== 'object') {
      return;
    }
    const { employee_id, job_type } = event;
    if (employee_id !== undefined && job_type !== undefined) {
      this.selectedEmployeeId = employee_id;
      this.getEmployee_id(
        this.selectedEmployeeId ? this.selectedEmployeeId : this.filterId
      );
      this.services.updateSelectedEmployee({
        employee_id: employee_id ? employee_id : this.loginTimeemployee_id,
        job_type: job_type ? job_type : this.loginemployeejobtype,
      });
    }
  }

  getFinancialYear() {
    this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
      if (res) {
        this.financialYearList = res?.data;        
        this.financialYearList?.map(
          (item: any) => (item.financial_year = item?.financial_year)
        );
      }
    });
  }

  ExportToexceldata(departmentId: any) {7
    this.fiteredemployee = [];
    let selectedEntityId = localStorage.getItem('selectedEntityId');
    this.services
      .export_to_Excel_data(selectedEntityId)
      .subscribe((response) => {
        if (response && response.data) {
          this.exportToExceldata = response.data;
          this.filterEmployeeExportToexceldata = this.exportToExceldata.filter(
            (item: any) => item.dept_id == departmentId
          );
        }
      });
  }

  exportToExcel(): void {
    if (
      !this.filterEmployeeExportToexceldata ||
      this.filterEmployeeExportToexceldata.length === 0
    ) {
      return;
    }
    const fieldsToRemove = [
      'employee_id',
      'createdAt',
      'updatedAt',
      'attendance_employee_id',
      'employee_id',
      'dept_id',
      'id',
      'isDeleted',
      'department_id',
      'entity_id',
    ];
    const filteredData = this.filterEmployeeExportToexceldata.map(
      (row: any) => {
        const newRow = { ...row };
        fieldsToRemove.forEach((field) => delete newRow[field]);
        return newRow;
      }
    );
    const sortedData = filteredData.map((row: { [x: string]: any }) => {
      const sortedRow: any = {};
      [
        'login_id',
        'employee_id',
        'employee_code',
        'full_name',
        ...Object.keys(row),
      ].forEach((key) => {
        if (row[key] !== undefined) {
          sortedRow[key] = row[key];
        }
      });
      return sortedRow;
    });
    const spacedData: any[] = [];
    sortedData.forEach((row: any, index: number) => {
      spacedData.push(row);
      if ((index + 1) % 5 === 0) {
        spacedData.push({});
      }
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(spacedData);
    const columnWidths = Object.keys(spacedData[0] || {}).map((key) => ({
      wch:
        Math.max(
          10,
          ...spacedData.map((row) =>
            row[key] ? row[key].toString().length : 0
          )
        ) + 2,
    }));
    worksheet['!cols'] = columnWidths;
    const workbook: XLSX.WorkBook = {
      Sheets: { Data: worksheet },
      SheetNames: ['Data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(data, 'Attendance.xlsx');
  }

  get(month: any, year: any) {
    this.selectMonth = month;
    this.selectYear = year;
    this.tryFetchLateMinutes();
  }

  getEmployee_id(employee_id: any) {
    this.selectemployee = employee_id;
    this.tryFetchLateMinutes();
  }

  async tryFetchLateMinutes() {
    if (this.selectMonth && this.selectYear && this.selectemployee !== null) {
      try {
        const response = await firstValueFrom(
          this.services.getLateMinutes(
            this.selectemployee,
            this.selectMonth,
            this.selectYear
          )
        );
        this.allMinute = response;
        this.totalLateInMinutes =
          parseInt(this.allMinute.totalLateInMinutes) || 0;
        if (this.originalGlobalMinutes) {
          this.updateRemainingMinutes();
        } else {
          this.get_GLOBALMinutes();
        }
      } catch (error) {
        console.error('Error in tryFetchLateMinutes:', error);
      }
    }
  }

  updateRemainingMinutes(): void {
    if (this.originalGlobalMinutes != null && this.totalLateInMinutes != null) {
      this.minafterdeducation =
        this.originalGlobalMinutes - this.totalLateInMinutes;
      this.gmData = this.minafterdeducation + ' Minutes';
    }
  }
}
