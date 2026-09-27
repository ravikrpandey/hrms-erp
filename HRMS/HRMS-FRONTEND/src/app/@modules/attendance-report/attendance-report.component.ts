import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { MatDialog } from '@angular/material/dialog';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss'],
})
export class AttendanceReportComponent implements OnInit {
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
  originalEntityList: any = [];
  employeeList2: any = [];
  selectedDepartment: any = [];
  isAllSelect: boolean = false;
  entityList: any = [];
  uniquedata: any = [];
  filterEmployeedata: any = [];
  day: any = [];
  departmentid: any;
  entity_id: any[] = [];
  departmentdata: any[] = [];
  selectedEntityId: string | null;
    filteredEntityIds: Set<string> = new Set(); // IDs visible after search
entitySelectionMap: Map<string, boolean> = new Map(); // Tracks selections

  constructor(
    private http: HttpClient,
    private services: AttendanceService,
    public dialog: MatDialog,
    private $miscellaneous: MiscellaneousService,
    private toast: ToastrService,
    private entityService: EntityMasterService
  ) {
    this.generateYears();
    this.selectedEntityId = localStorage.getItem('selectedEntityId');
  }

  ngOnInit() {
    this.getEntityList();
    if (this.selectedEntityId) {
      try {
        const parsed = JSON.parse(this.selectedEntityId);
        if (Array.isArray(parsed)) {
          this.entity_id = parsed;
        } else {
          this.entity_id = [parsed];
        }
      } catch (e) {
        this.entity_id = [this.selectedEntityId];
      }
    } else {
      this.entity_id = [];
    }
    this.ExportToexceldata(this.selectedEntityId);

    this.getFinancialYear();
  }

  generateYears() {
    const startYear = 1990;
    const endYear = new Date().getFullYear() + 30;
    this.years = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );
  }

  filter(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.entityList = [...this.originalEntityList];
    } else {
      this.entityList = this.originalEntityList.filter((item: any) =>
        item?.entity_name?.toLowerCase().includes(searchValue)
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

  ExportToexceldata(id: any) {
    this.fiteredemployee = [];
    const monthIndex =
      this.months?.findIndex((month: any) => month === this.selectedMonth) + 1;
    const year = this.selectedYear;
    const data = {
      entity_ids: id,
    };
    this.services
      .export_excel_att_report(monthIndex, year, data)
      .subscribe((response) => {
        if (response && response.data) {
          this.exportToExceldata = response.data;
        }
      });
  }

// exportToExcel(): void {
//   if (!this.exportToExceldata || this.exportToExceldata.length === 0) {
//     this.toast.error('No data found!');
//     return;
//   }

//   const fieldsToRemove = [
//     'createdAt',
//     'updatedAt',
//     'attendance_employee_id',
//     'dept_id',
//     'id',
//     'isDeleted',
//     'entity_id',
//     'att_time',
//     'job_type',
//     'entry_type',
//     'status',
//     'designation_id',
//     'late_in_minutes',
//     'early_out_minutes',
//   ];

//   const headerMap: { [key: string]: string } = {
//     employee_code: 'Employee Code',
//     employee_name: 'Employee Name',
//     entity_name: 'Entity Name',
//     department_name: 'Department',
//     designation_name: 'Designation',
//     shift_time: 'Shift Timing',
//     att_date: 'Attendance Date',
//     att_day: 'Day',
//     type: 'Type',
//     check_in: 'Check-in',
//     check_out: 'Check-out',
//     hours_worked: 'Working Hours',
//     late_in_full: 'Late-in',
//     early_out_full: 'Early-out',
//     balance_global_minute: 'Available Global Mins',
//   };

//   const dynamicLogFields = new Set<string>();
//   this.exportToExceldata.forEach((row: any) => {
//     Object.keys(row).forEach((key) => {
//       if (/^log_\d+$/.test(key) && !headerMap[key]) {
//         dynamicLogFields.add(key);
//       }
//     });
//   });

//   dynamicLogFields.forEach((logKey) => {
//     const logNumber = logKey.split('_')[1];
//     headerMap[logKey] = `Log ${logNumber}`;
//   });

//   const orderedFields = [
//     ...Object.keys(headerMap).filter((key) => !/^log_\d+$/.test(key)),
//     ...Array.from(dynamicLogFields).sort((a, b) => {
//       const aNum = parseInt(a.split('_')[1], 10);
//       const bNum = parseInt(b.split('_')[1], 10);
//       return aNum - bNum;
//     }),
//   ];

//   const exportData: any[] = [];

//   for (const row of this.exportToExceldata) {
//     const newRow: any = {};

//     orderedFields.forEach((key) => {
//       if (row.hasOwnProperty(key)) {
//         newRow[headerMap[key]] = row[key];
//       }
//     });

//     exportData.push(newRow);
//   }

//   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, {
//     skipHeader: true,
//   });

//   const headerRow = orderedFields.map((key) => headerMap[key]);
//   XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: 'A1' });

//   headerRow.forEach((_, colIdx) => {
//     const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIdx });
//     if (!worksheet[cellRef]) return;
//     worksheet[cellRef].s = {
//       font: { bold: true },
//     };
//   });

//   const columnWidths = headerRow.map((header) => ({
//     wch: Math.max(
//       header.length + 2,
//       ...exportData.map((row) =>
//         row[header] ? row[header].toString().length : 0
//       )
//     ),
//   }));
//   worksheet['!cols'] = columnWidths;

//   const workbook: XLSX.WorkBook = {
//     Sheets: { Data: worksheet },
//     SheetNames: ['Data'],
//   };

//   const excelBuffer: any = XLSX.write(workbook, {
//     bookType: 'xlsx',
//     type: 'array',
//     cellStyles: true,
//   });

//   const data: Blob = new Blob([excelBuffer], {
//     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
//   });

//   const firstDate = this.exportToExceldata[0]?.att_date;
//   let monthYearSuffix = '';

//   if (firstDate) {
//     const dateObj = new Date(firstDate);
//     if (!isNaN(dateObj.getTime())) {
//       const month = dateObj.toLocaleString('default', { month: 'long' });
//       const year = dateObj.getFullYear();
//       monthYearSuffix = `_${month}_${year}`;
//     }
//   }

//   saveAs(data, `Attendance_Report${monthYearSuffix}.xlsx`);
// }
exportToExcel(): void {
    if (!this.exportToExceldata || this.exportToExceldata.length === 0) {
      this.toast.error('No data found!');
      return;
    }

    const headerMap: { [key: string]: string } = {
      employee_code: 'Employee Code',
      employee_name: 'Employee Name',
      entity_name: 'Entity Name',
      department_name: 'Department',
      designation_name: 'Designation',
      shift_time: 'Shift Timing',
      att_date: 'Attendance Date',
      att_day: 'Day',
      type: 'Type',
      check_in: 'Check-in',
      check_out: 'Check-out',
      hours_worked: 'Working Hours',
      late_in_full: 'Late-in',
      early_out_full: 'Early-out',
      balance_global_minute: 'Available Global Mins',
    };

    const fieldsToRemove = [
      'createdAt',
      'updatedAt',
      'attendance_employee_id',
      'dept_id',
      'id',
      'isDeleted',
      'entity_id',
      'att_time',
      'job_type',
      'entry_type',
      'status',
      'designation_id',
      'late_in_minutes',
      'early_out_minutes',
    ];

    const dynamicLogFields = new Set<string>();
    this.exportToExceldata.forEach((row: any) => {
      Object.keys(row).forEach((key) => {
        if (/^log_\d+$/.test(key) && !headerMap[key]) {
          dynamicLogFields.add(key);
        }
      });
    });

    dynamicLogFields.forEach((logKey) => {
      const logNumber = logKey.split('_')[1];
      headerMap[logKey] = `Log ${logNumber}`;
    });

    const orderedFields = [
      ...Object.keys(headerMap).filter((key) => !/^log_\d+$/.test(key)),
      ...Array.from(dynamicLogFields).sort((a, b) => {
        const aNum = parseInt(a.split('_')[1], 10);
        const bNum = parseInt(b.split('_')[1], 10);
        return aNum - bNum;
      }),
    ];

    const headerRow = orderedFields.map((key) => headerMap[key]); 

    const exportData: any[] = [];
    for (const row of this.exportToExceldata) {
      const newRow: any = {};
      orderedFields.forEach((key) => {
        if (row.hasOwnProperty(key)) {
          newRow[headerMap[key]] = row[key];
        }
      });
      exportData.push(newRow);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], {});
    XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: 'A1' }); 
    XLSX.utils.sheet_add_json(worksheet, exportData, {
      skipHeader: true,
      origin: 'A2', // shift data down to preserve row 0
    });

    // Optional bold styling (requires xlsx-style for Excel)
    headerRow.forEach((_, colIdx) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIdx });
      if (!worksheet[cellRef]) return;
      worksheet[cellRef].s = {
        font: { bold: true },
      };
    });

    const columnWidths = headerRow.map((header) => ({
      wch: Math.max(
        header.length + 2,
        ...exportData.map((row) =>
          row[header] ? row[header].toString().length : 0
        )
      ),
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

    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    const firstDate = this.exportToExceldata[0]?.att_date;
    let monthYearSuffix = '';
    if (firstDate) {
      const dateObj = new Date(firstDate);
      if (!isNaN(dateObj.getTime())) {
        const month = dateObj.toLocaleString('default', { month: 'long' });
        const year = dateObj.getFullYear();
        monthYearSuffix = `_${month}_${year}`;
      }
    }

    saveAs(dataBlob, `Attendance_Report${monthYearSuffix}.xlsx`);
  }


  onMonthOrYearChange() {
    if (this.entity_id && this.selectedMonth && this.selectedYear) {
      this.ExportToexceldata(this.entity_id);
    }
  }



 updateSelectedEntities() {
  this.entity_id = Array.from(this.entitySelectionMap.entries())
                        .filter(([_, isSelected]) => isSelected)
                        .map(([id]) => id);
}


 selectAll(event: any) {
  this.isAllSelect = event.checked;
  if (this.isAllSelect) {
    this.entityList.forEach((entity: { entity_id: string; }) => {
      this.entitySelectionMap.set(entity.entity_id, true);
    });
  } else {
    this.entityList.forEach((entity: { entity_id: string; }) => {
      this.entitySelectionMap.set(entity.entity_id, false);
    });
  }
  this.updateSelectedEntities();
}


 checkIfAllSelected() {
  const selectedCount = Array.from(this.entitySelectionMap.values()).filter(v => v).length;
  this.isAllSelect = selectedCount === this.entityList.length;
  this.updateSelectedEntities();
}

 
   getEntityList() {
  this.entityService.getAll_active_Entity().subscribe((res: any) => {
    this.entityList = res.data;
    this.originalEntityList = [...this.entityList];
    this.filteredEntityIds = new Set(this.entityList.map((e: { entity_id: any; }) => e.entity_id));
    // Pre-populate selection map
    this.entityList.forEach((entity: { entity_id: string; }) => {
      this.entitySelectionMap.set(entity.entity_id, false);
    });
  });
}
}
