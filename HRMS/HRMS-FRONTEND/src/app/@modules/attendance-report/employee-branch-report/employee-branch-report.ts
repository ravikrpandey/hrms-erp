import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { MiscellaneousService } from 'src/app/@shared/services/miscellaneous.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';

@Component({
  selector: 'app-employee-branch-report',
  templateUrl: './employee-branch-report.html',
  styleUrls: ['./employee-branch-report.scss'],
})
export class EmployeeBranchReport {
  employee_data: any = [];
  filterEmployeedata: any = [];
  exportToExceldata: any = [];
  selectedDesignations: any[] = [];
  isAllDesignationSelected: boolean = false;
  allRoleMaster: any[];
  isAllBranchSelected: boolean = false;
  filteredBranchList: any[] = [];
  allBanks: any[] = [];
  filteredBanks: any[] = [];
  selectedBanks: any[] = [];
  isAllBanksSelected: boolean = false;
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
  loginUser: any;
  filterDepartment: any;
  formSubmitted = false;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  bank_id: any;
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
    this.financial_id = localStorage.getItem('financial_id');
    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);
    this.getAllBank();
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
    this.bank_id = selectedId;

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
  getAllBank() {
    this._empRegistration.getAllBankData().subscribe((res: any) => {
      if (res && res.data) {
        this.allBanks = res.data;
        this.filteredBanks = [...this.allBanks];
      }
    });
  }

  selectAllValue = 'ALL';

  toggleSelectAllBanks() {
    if (this.isAllDesignationSelected) {
      this.selectedDesignations = [];
    } else {
      this.selectedDesignations = this.allRoleMaster.map(
        (role: any) => role.role_master_id
      );
    }
    this.isAllDesignationSelected = !this.isAllDesignationSelected;
  }

  assignDesignationSearch(e: any) {
    this.allRoleMaster = this.assignDesignationArr2.filter((item: any) =>
      item.role_master_name.toLowerCase().includes(e.toLowerCase())
    );
  }

  ExportToexceldata(
  dept_id: any,
  designation_id: any,
  entity_id: any,
  branch_id: any,
  filters: { year?: number; year_type?: string; nationality_id?: number | number[] } = {}
) {
  const payload = {
    entity_id,
    dept_id,
    designation_id,
    branch_id,
    financial_id: this.financial_id,
    ...filters,
  };

  this.rowData = [];

  this.services.exportToExcelBankReport(payload).subscribe({
    next: (res: any) => {
      if (res.code === 200 && res.data?.length > 0) {
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
          const aNum = parseInt(a.split('_')[1], 10);
          const bNum = parseInt(b.split('_')[1], 10);
          return aNum - bNum;
        });

        const dynamicLogColumnDefs = sortedLogFields.map((logKey) => ({
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
          ...dynamicLogColumnDefs,
        ];
      } else {
        this.exportToExceldata = [];
        this.rowData = [];
        this.toast.warning('No data found!');
      }
    },
    error: (err) => {
      this.exportToExceldata = [];
      this.rowData = [];
      console.error('Export error:', err);
      this.toast.error('Something went wrong while exporting data.');
    },
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
  selectAllBank(event: any) {
    this.isAllBanksSelected = event.checked;
    if (this.isAllBanksSelected) {
      this.selectedBanks = this.allBanks.map((bank) => bank.id);
    } else {
      this.selectedBanks = [];
    }
  }

  checkAllBankSelected() {
    const selectedCount = this.selectedBanks.length || 0;
    const totalCount = this.allBanks.length || 0;
    this.isAllBanksSelected = selectedCount === totalCount;
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

    this.bank_id = this.selectedBanks;

    console.log('TriggerExport called with:', {
      dept_id: this.dept_id,
      bank_id: this.bank_id,
      entity_id: this.entity_id,
      branch_id: this.branch_id,
    });

    if (!this.entity_id || this.entity_id.length === 0) {
      this.toast.error('Please select at least one Entity!');
      return;
    }

    if (!this.dept_id || this.dept_id.length === 0) {
      this.toast.error('Please select at least one Department!');
      return;
    }

    if (!this.bank_id || this.bank_id.length === 0) {
      this.toast.error('Please select at least one Bank!');
      return;
    }

    if (!this.branch_id || this.branch_id.length === 0) {
      this.toast.error('Please select at least one Branch!');
      return;
    }

    this.ExportToexceldata(
      this.dept_id,
      this.bank_id,
      this.entity_id,
      this.branch_id
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
    const headerMap: { [key: string]: string } = {
      employee_code: 'Employee Code',
      full_name: 'Employee Name',
      gender: 'Gender',
      employee_official_email: 'Email Id',
      status: 'Status',
      department_name: 'Department Name',
      entity_name: 'Entity',
      bank_name: 'Bank Name',
      account_number: 'Account Number',
      iban: 'IBAN Number',
      swift_code: 'Swift Code',
      ifsc: 'IFSC Code',
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
    if (firstDate) {
      const dateObj = new Date(firstDate);
      if (!isNaN(dateObj.getTime())) {
        const month = dateObj.toLocaleString('default', { month: 'long' });
        const year = dateObj.getFullYear();
      }
    }
    saveAs(dataBlob, `Employee_Bank_Report.xlsx`);
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
      headerName: 'Bank Name',
      field: 'bank_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Account Number',
      field: 'account_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'IBAN Number',
      field: 'iban',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Swift Code',
      field: 'swift_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'IFSC Code',
      field: 'ifsc',
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
