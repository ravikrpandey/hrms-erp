import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import saveAs from 'file-saver';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { MiscellaneousService } from 'src/app/@shared/services/miscellaneous.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';

@Component({
  selector: 'app-employee-department-report',
  templateUrl: './employee-department-report.html',
  styleUrls: ['./employee-department-report.scss']
})
export class EmployeeDepartmentReport {
employee_data: any = [];
  filterEmployeedata: any = [];
  exportToExceldata: any = [];
  selectedDesignations: any[] = [];
  isAllDesignationSelected: boolean = false;
  allRoleMaster: any[];
  isAllBranchSelected: boolean = false;
  filteredBranchList: any[] = [];
  isAllSelectdepartment: any;
  filterEmployeeExportToexceldata: any = [];
  originalEntityList: any = [];
  assignDesignationArr2: any = [];
  isAllSelect: boolean = false;
  entityList: any = [];
  entity_id: any[] = [];
  departmentdata: any[] = [];
  selectedEntityId: string | null;
  depratmentData: any = [];
  from_date: Date | null = null;
  to_date: Date | null = null;
  selectBranch: any;
  fromdate: any;
  todate: any;
  reporting_manager_id: any[] = [];
approval_manager_id: any[] = [];
allManagers: any[] = [];
filteredManagers: any[] = [];
isAllReportingSelected = false;
isAllApprovalSelected = false;
  loginUser: any;
  filterDepartment: any;
  formSubmitted = false;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  dept_id: any;
  branch_id: any;
  isAllemployeeSelected: any;
  isSelectedLeaveType: any;
  leaveMasterdata: any;
  filterLeavemasterdata: any;
  financial_id: any;
  constructor(
    private http: HttpClient,
    private services: AttendanceService,
    public dialog: MatDialog,
    private $miscellaneous: MiscellaneousService,
    private toast: ToastrService,
    private entityService: EntityMasterService,
    private payrollService: PayrollService,
    private _empRegistration: EmpRegistrationService
  ) {}

  ngOnInit() {
    this.getEntityList();
    this.getAllApprovalManagers();
    this.financial_id = localStorage.getItem('financial_id');
    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);
  }

  branchList: any;
  branchArray1: any;
  branchArray2: any;
  assignDesignationArr1: any = [];

  getBranchList() {
    this.services.getAllBranchData().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.branchList = res.data;
          this.filteredBranchList = [...this.branchList];
          this.branchArray1 = this.branchList.map(
            (res: any) => res.branch_name
          );
          this.branchArray2 = this.branchList;
        }
      },
      (err: any) => {
        this.toast.error(err.error.message);
      }
    );
  }

  onDesignationSelected(selectedId: any) {

    const selectedDesignation = this.allRoleMaster.find(
      (item: any) => item.role_master_id === selectedId
    );
  }
  selectAllBranch(event: any) {
    this.isAllBranchSelected = event.checked;
    if (this.isAllBranchSelected) {
      this.branch_id = this.branchList.map((branch: any) => branch.id);
    } else {
      this.branch_id = [];
    }
  }
selectAllReportingManagers(event: any) {
  this.isAllReportingSelected = event.checked;
  this.reporting_manager_id = event.checked
    ? this.allManagers.map((m: any) => m.id)
    : [];
}

checkAllReportingManagerSelected() {
  this.isAllReportingSelected =
    this.reporting_manager_id.length === this.allManagers.length;
}

selectAllApprovalManagers(event: any) {
  this.isAllApprovalSelected = event.checked;
  this.approval_manager_id = event.checked
    ? this.allManagers.map((m: any) => m.id)
    : [];
}

checkAllApprovalManagerSelected() {
  this.isAllApprovalSelected =
    this.approval_manager_id.length === this.allManagers.length;
}


  assignDesignationSearch(e: any) {
  this.allRoleMaster = this.assignDesignationArr2.filter((item: any) =>
    item.role_master_name.toLowerCase().includes(e.toLowerCase())
  );
}
getAllApprovalManagers() {
  this.entityService.getAllApprovalManager().subscribe({
    next: (res: any) => {
      if (res.code === 200 && Array.isArray(res.data)) {
        this.allManagers = res.data.map((m: any) => ({
          id: m.employee_id,
          name: m.reporting_manager_name,
        }));
        this.filteredManagers = [...this.allManagers];
      } else {
        this.toast.error('No manager data found');
      }
    },
    error: (err) => {
      this.toast.error(err?.error?.message || 'Error fetching managers');
    },
  });
}



 ExportToexceldata(
  dept_id: any,
  entity_id: any,
  branch_id: any,
  reporting_manager_id: any,
  approval_manager_id: any
) {
  const ids = {
    entity_id,
    dept_id,
    branch_id,
    reporting_manager_id,
    approval_manager_id,
    financial_id: this.financial_id,
  };

  this.rowData = [];

  this.services.exportToExcelManagerReport(ids).subscribe({
    next: (res: any) => {
      if (res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
        this.exportToExceldata = res.data;
        this.rowData = this.exportToExceldata;

        const dynamicLogFields = new Set<string>();
        this.exportToExceldata.forEach((row: any) => {
          Object.keys(row).forEach((key) => {
            if (/^log_\d+$/.test(key)) {
              dynamicLogFields.add(key);
            }
          });
        });

        const sortedLogFields = Array.from(dynamicLogFields).sort((a, b) => {
          return parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]);
        });

        const dynamicLogColumns = sortedLogFields.map((logKey) => ({
          headerName: `Log ${logKey.split('_')[1]}`,
          field: logKey,
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
        }));

        this.columnDefs = [
          ...this.columnDefs.filter(col => !/^Log \d+$/.test(col.headerName)),
          ...dynamicLogColumns
        ];
      } else {
        this.toast.warning('No data found!');
        this.exportToExceldata = [];
        this.rowData = [];
      }
    },
    error: (err) => {
      console.error('Error exporting data:', err);
      this.toast.error('Something went wrong while exporting data.');
      this.exportToExceldata = [];
      this.rowData = [];
    }
  });
}


  selectAll(event: any) {
    this.isAllSelect = event.checked;
    if (this.isAllSelect) {
      const allIds = this.entityList.map((item: any) => item.entity_id);
      this.entity_id = [...allIds];
    } else {
      this.entity_id = [];
    }
    this.getAllDepartmentRecord();
    this.getBranchList();
  }

  getSelectedBasedOnEntityLeaveData() {
    if (this.entity_id && this.entity_id.length > 0) {
      this.services.getLeaveMasterData(this.entity_id).subscribe((res: any) => {
        this.leaveMasterdata = res.data;
        this.filterLeavemasterdata = [...this.leaveMasterdata];
      });
    }
  }

  checkIfAllSelected(event?: any) {
    const currentLength = this.entity_id?.length || 0;
    const totalLength = this.entityList?.length || 0;
    this.isAllSelect = currentLength === totalLength;
    if (event && event.source) {
      const changedId = event.source.value;
      const isSelected = event.source.selected;
    }
    this.getAllDepartmentRecord();
    this.getBranchList();
    this.getSelectedBasedOnEntityLeaveData();
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
  }



  checkAlldepartment(event?: any) {
    const currentLength = this.dept_id?.length || 0;
    const totalLength = this.departmentdata?.length || 0;
    this.isAllSelectdepartment = currentLength === totalLength;
    if (event && event.source) {
      const changedId = event.source.value;
      const isSelected = event.source.selected;
    }
  }
  checkAllBranchSelected() {
    const selectedCount = this.branch_id?.length || 0;
    const totalCount = this.branchList?.length || 0;
    this.isAllBranchSelected = selectedCount === totalCount;
  }
  selectAllEmployee(event: any) {}

  getEntityList = () => {
    this.entityService.getAll_active_Entity().subscribe((res: any) => {
      this.entityList = res.data;
      this.originalEntityList = [...this.entityList];
    });
  };
 triggerExport() {
  this.formSubmitted = true;

  if (!this.dept_id || this.dept_id.length === 0) {
    this.toast.error('Please select Department!');
    return;
  }

  if (!this.entity_id || this.entity_id.length === 0) {
    this.toast.error('Please select Entity!');
    return;
  }

  if (!this.branch_id || this.branch_id.length === 0) {
    this.toast.error('Please select Branch!');
    return;
  }

  if (
    (!this.reporting_manager_id || this.reporting_manager_id.length === 0) &&
    (!this.approval_manager_id || this.approval_manager_id.length === 0)
  ) {
    this.toast.error(
      'Please select at least one: Reporting Manager or Approval Manager!'
    );
    return;
  }

  this.ExportToexceldata(
    this.dept_id,
    this.entity_id,
    this.branch_id,
    this.reporting_manager_id,
    this.approval_manager_id
  );
}



  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  exportToExcel(): void {
  if (!this.exportToExceldata || this.exportToExceldata.length === 0) {
    this.toast.error('No data found!');
    return;
  }

  const headerMap: { [key: string]: string } = {};
  const fieldsToExport: string[] = [];

  this.columnDefs.forEach((col: any) => {
    if (col.field && col.headerName) {
      headerMap[col.field] = col.headerName;
      fieldsToExport.push(col.field);
    }
  });

  const exportData = this.exportToExceldata.map((row: any) => {
    const newRow: any = {};
    fieldsToExport.forEach((field) => {
      newRow[headerMap[field]] = row[field] ?? '';
    });
    return newRow;
  });

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  XLSX.utils.sheet_add_aoa(worksheet, [Object.values(headerMap)], { origin: 'A1' });
  XLSX.utils.sheet_add_json(worksheet, exportData, { skipHeader: true, origin: 'A2' });

  worksheet['!cols'] = Object.values(headerMap).map((header) => ({
    wch: Math.max(header.length + 2, 15),
  }));

  const workbook: XLSX.WorkBook = {
    Sheets: { Data: worksheet },
    SheetNames: ['Data'],
  };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  const dataBlob: Blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });

  saveAs(dataBlob, `Employee_Manager_Report.xlsx`);
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
      field: 'full_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
     {
      headerName: 'Gender',
      field: 'gender',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Email Id',
      field: 'employee_official_email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
      {
      headerName: 'Branch',
      field: 'branch_name',
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
      headerName: 'Entity',
      field: 'entity_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Approving Manager',
      field: 'aprroval_manager',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Reporting Manager',
      field: 'reporting_manager',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    }
  ];

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}
