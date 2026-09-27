import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import saveAs from 'file-saver';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { MiscellaneousService } from 'src/app/@shared/services/miscellaneous.service';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
@Component({
  selector: 'app-entity-report',
  templateUrl: './entity-report.html',
  styleUrls: ['./entity-report.scss'],
})
export class EmployeeListReport {
  employee_data: any = [];
  filterEmployeedata: any = [];
  exportToExceldata: any = [];
  filteredNationalityList: any[] = [];
  selectedDesignations: any[] = [];
  isAllDesignationSelected: boolean = false;
  selectedOption: string = '';
  allRoleMaster: any[];
  isAllBranchSelected: boolean = false;
  filteredBranchList: any[] = [];
  isAllSelectdepartment: any;
  filterEmployeeExportToexceldata: any = [];
  originalEntityList: any = [];
  assignDesignationArr2: any = [];
  yearList: number[] = [];
  selectedYears: number[] = [];
  selectedCountries: number[] = [];

  selectedCountry: number | null = null;
  nationalityList: any[] = [];
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
  designation_id: any;
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
    this.getAllRoleMaster();
    this.generateYearList();
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
    this.designation_id = selectedId;

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
  generateYearList() {
    const startYear = 1980;
    const endYear = 2025;
    this.yearList = [];
    for (let year = startYear; year <= endYear; year++) {
      this.yearList.push(year);
    }
  }
  onOptionChange(value: string) {
    this.selectedYears = [];
    this.selectedCountries = [];

    if (value === 'NATIONALITY') {
      this.getAllNationality();
    }
  }

  getAllNationality() {
  this._empRegistration.getAllNationality().subscribe({
    next: (res: any) => {
      if (res.code === 200 && res.data) {
        this.nationalityList = res.data;
        this.filteredNationalityList = [...this.nationalityList];
      } else {
        this.toast.error('Failed to load nationality data');
      }
    },
    error: (err: any) => {
      this.toast.error('Error loading nationality data');
    },
  });
}


  getAllRoleMaster() {
    this._empRegistration
      .getAllRoleMaster(this.loginUser.role)
      .subscribe((res: any) => {
        this.allRoleMaster = res.data;
        this.assignDesignationArr1 = this.allRoleMaster.map(
          (res: any) => res.role_master_name
        );
        this.assignDesignationArr2 = this.allRoleMaster;
      });
  }
  assignDesignationSearch(e: any) {
    let filteredVariable = this.assignDesignationArr2.filter((item: any) =>
      e.includes(item.role_master_name)
    );
    this.allRoleMaster = filteredVariable;
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

  this.services.exportToExcelDesignationReport(payload).subscribe({
    next: (res: any) => {
      if (res.code === 200 && res.data?.length > 0) {
        this.exportToExceldata = res.data;
        this.rowData = this.exportToExceldata;
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
  selectAllDesignations(event: any) {
    this.isAllDesignationSelected = event.checked;
    if (this.isAllDesignationSelected) {
      this.selectedDesignations = this.allRoleMaster.map(
        (role: any) => role.role_master_id
      );
    } else {
      this.selectedDesignations = [];
    }
  }
  checkAllDesignationsSelected() {
    const selectedCount = this.selectedDesignations?.length || 0;
    const totalCount = this.allRoleMaster?.length || 0;
    this.isAllDesignationSelected = selectedCount === totalCount;
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

  if (!this.entity_id || this.entity_id.length === 0) {
    this.toast.error('Please select at least one Entity.');
    return;
  }

  if (!this.dept_id || this.dept_id.length === 0) {
    this.toast.error('Please select at least one Department.');
    return;
  }
  if (!this.branch_id || this.branch_id.length === 0) {
    this.toast.error('Please select at least one Branch.');
    return;
  }

  if (!this.selectedDesignations || this.selectedDesignations.length === 0) {
    this.toast.error('Please select at least one Designation.');
    return;
  }

  if (!this.selectedOption) {
    this.toast.error('Please select DOJ, DOB or Nationality.');
    return;
  }

  const filters: {
  year?: number;
  year_type?: string;
  nationality_id?: number | number[];
} = {};



  if (this.selectedOption === 'DOJ' || this.selectedOption === 'DOB') {
    if (!this.selectedYears || this.selectedYears.length === 0) {
      this.toast.error('Please select at least one Year.');
      return;
    }
    filters.year = this.selectedYears[0];
    filters.year_type = this.selectedOption;
  }

 if (this.selectedOption === 'NATIONALITY') {
  if (!this.selectedCountries || this.selectedCountries.length === 0) {
    this.toast.error('Please select at least one Country.');
    return;
  }
  filters.nationality_id = this.selectedCountries;
}


  this.ExportToexceldata(
    this.dept_id,
    this.selectedDesignations,
    this.entity_id,
    this.branch_id,
    filters
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
      date_of_birth: 'Date Of Birth',
      gender: 'Gender',
      employee_official_email: 'Email Id',
      status: 'Status',
      countrys: 'Nationality',
      entity_name: 'Entity',
      branch_name: 'Branch',
      department_name: 'Department Name',
      designation_name: 'Designation',
      Date_of_joining: 'Date_Of_Joining',
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
    saveAs(dataBlob, `Employee_List.xlsx`);
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
      headerName: 'Date Of Birth',
      field: 'date_of_birth',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Date Of Joining',
      field: 'date_of_joining',
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
      headerName: 'Nationality',
      field: 'countrys',
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
      headerName: 'Designation',
      field: 'designation_name',
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
