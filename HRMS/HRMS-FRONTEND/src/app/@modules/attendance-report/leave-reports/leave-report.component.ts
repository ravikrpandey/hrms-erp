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
  selector: 'app-leave-report',
  templateUrl: './leave-report.component.html',
  styleUrls: ['./leave-report.component.scss'],
})
export class LeaveReportComponent {
  employee_data: any = [];
  filterEmployeedata: any = [];
  exportToExceldata: any = [];
  isAllSelectdepartment: any;
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
  rowData: any = [];
  dept_id: any;
  employee_id: any;
  isAllemployeeSelected: any;
  isSelectedLeaveType: any;
  leaveMasterdata: any;
  filterLeavemasterdata: any;
  id: any;
  financial_id: any;
  filteredEntityIds: Set<string> = new Set(); // IDs visible after search
  entitySelectionMap: Map<string, boolean> = new Map(); // Tracks selections

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
    this.financial_id = localStorage.getItem('financial_id');
  }

  ExportToexceldata(dept_id: any, id: any, entity_id: any, employee_id: any) {
    const ids = {
      entity_id: entity_id,
      dept_id: dept_id,
      id: id,
      employee_id: employee_id,
      financial_id: this.financial_id,
    };
    this.services.exportsToExcelDataInLeaveMaster(ids).subscribe({
      next: (res: any) => {
        if (res && res.employeeDetails && res.employeeDetails.length > 0) {
          this.exportToExceldata = res.employeeDetails;
          this.rowData = this.exportToExceldata;
        } else {
          this.toast.error('No data found!');
        }
      },
      error: (err) => {
        this.toast.error('No data found!');
      },
    });
  }

  selectAll(event: any) {
    this.isAllSelect = event.checked;
    if (this.isAllSelect) {
      this.entityList.forEach((entity: { entity_id: string }) => {
        this.entitySelectionMap.set(entity.entity_id, true);
      });
    } else {
      this.entityList.forEach((entity: { entity_id: string }) => {
        this.entitySelectionMap.set(entity.entity_id, false);
      });
    }
    this.updateSelectedEntities();
    this.getAllDepartmentRecord();
    this.getSelectedBasedOnEntityLeaveData();
  }

  getSelectedBasedOnEntityLeaveData() {
    if (this.entity_id && this.entity_id.length > 0) {
      this.services.getLeaveMasterData(this.entity_id).subscribe((res: any) => {
        this.leaveMasterdata = res.data;
        this.filterLeavemasterdata = [...this.leaveMasterdata];
      });
    }
  }

  checkIfAllSelected() {
  const selectedCount = Array.from(this.entitySelectionMap.values()).filter(v => v).length;
  this.isAllSelect = selectedCount === this.entityList.length;
}


  getAllDepartmentRecord() {
    if (this.entity_id && this.entity_id.length > 0) {
      this.services
        .getDepartmentEntitySelected(this.entity_id)
        .subscribe((res: any) => {
          this.departmentdata = res.data;
          this.filterDepartment = [...this.departmentdata];
        });
    } else {
      this.departmentdata = [];
      this.filterDepartment = [];
    }
  }

  selectAllDepartment(event: any) {
    this.isAllSelectdepartment = event.checked;
    if (this.isAllSelectdepartment) {
      const allIds = this.departmentdata.map(
        (item: { dept_id: any }) => item.dept_id
      );
      this.dept_id = allIds;
    } else {
      this.dept_id = [];
    }
    this.getEmployeeSelectionBasedOndepartment();
  }

  checkAlldepartment(event?: any) {
    const currentLength = this.dept_id?.length || 0;
    const totalLength = this.departmentdata?.length || 0;
    this.isAllSelectdepartment = currentLength === totalLength;
    if (event && event.source) {
      const changedId = event.source.value;
      const isSelected = event.source.selected;
    }
    this.getEmployeeSelectionBasedOndepartment();
  }

  getEmployeeSelectionBasedOndepartment() {
    if (this.dept_id && this.dept_id.length > 0) {
      this.services
        .getEmployeeBasedonDepartment(this.dept_id)
        .subscribe((res: any) => {
          this.employee_data = res.data;
          this.filterEmployeedata = [...this.employee_data];
        });
    }
  }

  selectAllEmployee(event: any) {
    this.isAllemployeeSelected = event.checked;
    if (this.isAllemployeeSelected) {
      const allIds = this.employee_data.map(
        (item: { employee_id: any }) => item.employee_id
      );
      this.employee_id = allIds;
    } else {
      this.employee_id = [];
    }
  }

  updateSelectedEntities() {
    this.entity_id = Array.from(this.entitySelectionMap.entries())
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
  }

  selectAllLeave(event: any) {
    this.isSelectedLeaveType = event.checked;
    if (this.isSelectedLeaveType) {
      const allIds = this.leaveMasterdata.map((item: any) => item.id);
      this.id = [...allIds];
    } else {
      this.id = [];
    }
  }

  checkAllLeaveType(event?: any) {
    const currentLength = this.id?.length || 0;
    const totalLength = this.leaveMasterdata?.length || 0;
    this.isSelectedLeaveType = currentLength === totalLength;
    if (event && event.source) {
      const changedId = event.source.value;
      const isSelected = event.source.selected;
    }
  }

  onEntityToggle(entityId: string, isChecked: boolean) {
  this.entitySelectionMap.set(entityId, isChecked);
  this.updateSelectedEntities(); // Only updates entity_id
  this.getAllDepartmentRecord();
  this.getSelectedBasedOnEntityLeaveData();
  this.checkIfAllSelected(); // Only used to set checkbox state
}


  getEntityList() {
    this.entityService.getAll_active_Entity().subscribe((res: any) => {
      this.entityList = res.data;
      this.originalEntityList = [...this.entityList];
      this.filteredEntityIds = new Set(
        this.entityList.map((e: { entity_id: any }) => e.entity_id)
      );
      // Pre-populate selection map
      this.entityList.forEach((entity: { entity_id: string }) => {
        this.entitySelectionMap.set(entity.entity_id, false);
      });
    });
  }

  handleFilteredEntities(event: any) {
    const filtered = event.data;
    this.filteredEntityIds = new Set(filtered.map((e: any) => e.entity_id));
  }
  triggerExport() {
    this.formSubmitted = true;
    console.log('TriggerExport called with:', {
      dept_id: this.dept_id,
      id: this.id,
      entity_id: this.entity_id,
      employee_id: this.employee_id,
    });

    if (!this.dept_id || !this.id || !this.entity_id || !this.employee_id) {
      console.warn('Required fields missing');
      return;
    }

    this.ExportToexceldata(
      this.dept_id,
      this.id,
      this.entity_id,
      this.employee_id
    );
  }

  // triggerExport() {
  //   this.formSubmitted = true;
  //   if (!this.dept_id || !this.id || !this.entity_id || !this.employee_id) {
  //     return;
  //   }
  //   this.ExportToexceldata(
  //     this.dept_id,
  //     this.id,
  //     this.entity_id,
  //     this.employee_id
  //   );
  // }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  exportToExcel(): void {
    if (!this.exportToExceldata || this.exportToExceldata.length === 0) {
      this.toast.error('No data found!');
      return;
    }
    const headerMap: { [key: string]: string } = {
      employee_code: 'Employee Code',
      name: 'Employee Name',
      department: 'Department',
      designation: 'Designation',
      no_of_days: 'Leave In Quota',
      available_days: 'Available',
      leave_name: 'Leave Name',
    };
    const fieldsToRemove = [
      'leave_code',
      'total_available',
      'employee_id',
      'leave_id',
      'total_leave_applied',
      'total_approved_days',
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
    saveAs(dataBlob, `Leave_Master_Reports.xlsx`);
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
      field: 'name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Department Name',
      field: 'department',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Designation',
      field: 'designation',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Leave Type',
      field: 'leave_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Leave In Quota',
      field: 'no_of_days',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Available',
      field: 'available_days',
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
