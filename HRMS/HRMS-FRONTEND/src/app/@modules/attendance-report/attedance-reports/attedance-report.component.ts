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
import { GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-attedance-report',
  templateUrl: './attedance-report.component.html',
  styleUrls: ['./attedance-report.component.scss'],
})
export class AttedanceReportComponent {
  exportToExceldata: any = [];
  filterEmployeeExportToexceldata: any = [];
  originalEntityList: any = [];
  isAllSelect: boolean = false;
  entityList: any = [];
  entity_id: any[] = [];
  departmentdata: any[] = [];
  selectedEntityId: string | null;
  depratmentData: any = [];
  from_date: Date | null = null;
  to_date: Date | null = null;
  selectedDepartment: any;
  fromdate: any;
  todate: any;
  filterDepartment: any;
  formSubmitted = false;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any=[];

  constructor(
    private http: HttpClient,
    private services: AttendanceService,
    public dialog: MatDialog,
    private $miscellaneous: MiscellaneousService,
    private toast: ToastrService,
    private entityService: EntityMasterService
  ) {}

  ngOnInit() {
    this.getEntityList();
    this.getAllDepartmentRecord();
  }

  getAllDepartmentRecord() {
    const entity_id = localStorage.getItem('selectedEntityId');
    this.services.getDepartmentdata(entity_id).subscribe((res: any) => {
      this.departmentdata = res.data;
      this.filterDepartment = [...this.departmentdata];
    });
  }

  ExportToexceldata(id: any, from_date: any, to_date: any) {
    this.fromdate = from_date;
    this.todate = to_date;
    const data = {
      entity_id: id,
      from_date: from_date,
      to_date: to_date,
    };
    this.services
  .export_excel_att_AttedanceReport(this.selectedDepartment, data)
  .subscribe({
    next: (response) => {
      if (response && response.data) {
        this.exportToExceldata = response.data;
        this.rowData = this.exportToExceldata;
      }
       else{
          this.toast.error('No data found!');
        }
    },
    error: (error) => {
      this.toast.error('No data found!');
    }
  });

  }

  exportToExcel(): void {
    if (!this.exportToExceldata || this.exportToExceldata.length === 0) {
      this.toast.error('No data found!');
      return;
    }
    const headerMap: { [key: string]: string } = {
      employee_code: 'Employee Code',
      employee_name: 'Employee Name',
      entity_name: 'Entity Name',
      company_branch: 'Company Branch',
      department_name: 'Department',
      designation_name: 'Designation',
      shift_time: 'Shift Timing',
      att_date: 'Attendance Date',
      att_day: 'Day',
      type: 'Type',
      entry_type: 'Entry Type',
      check_in: 'Check-in',
      check_out: 'Check-out',
      hours_worked: 'Working Hours',
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
      origin: 'A2',
    });
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
    saveAs(dataBlob, `Attendance_Report.xlsx`);
  }

  selectAll(event: any) {
    this.isAllSelect = event.checked;
    if (this.isAllSelect) {
      const allIds = this.entityList.map(
        (item: { entity_id: any }) => item.entity_id
      );
      this.entity_id = allIds;
    } else {
      this.entity_id = [];
    }
  }

  checkIfAllSelected() {
    const selected = this.entity_id || [];
    this.isAllSelect = selected.length === this.departmentdata.length;
    if (selected.length == this.departmentdata.length) {
    }
  }
  getEntityList = () => {
    this.entityService.getAll_active_Entity().subscribe((res: any) => {
      this.entityList = res.data;
      this.originalEntityList = [...this.entityList];
    });
  };

  triggerExport() {
    this.formSubmitted = true;
    if (!this.from_date || !this.to_date || !this.entity_id) {
      return;
    }

    this.ExportToexceldata(this.entity_id, this.from_date, this.to_date);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Employee Code',
      field: 'employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Employee Name',
      field: 'employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Department Name',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Designation',
      field: 'designation_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Shift Name',
      field: 'shift_time',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Date ',
      field: 'att_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Day ',
      field: 'att_day',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Entry type ',
      field: 'entry_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Check In',
      field: 'check_in',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Check Out',
      field: 'check_out',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Working Hours',
      field: 'hours_worked',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
  ];

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}
