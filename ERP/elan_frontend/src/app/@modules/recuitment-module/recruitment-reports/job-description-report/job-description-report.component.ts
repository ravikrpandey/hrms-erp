import { Component } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TimesheetService } from 'src/app/@modules/employee-self-service/timesheet/timesheet.service';
import { ProjectManagementService } from 'src/app/@modules/project-management/services/project-management.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-job-description-report',
  templateUrl: './job-description-report.component.html',
  styleUrls: ['./job-description-report.component.scss']
})
export class JobDescriptionReportComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  entity_id: string | null;
  mainEmpId: string | null;
  public rowData: any;
  gridOptions: GridOptions<any>;
  departments:any;
  selectedDepartment: any;
  months: any;
  selectedMonth: any;
  selectedYear:any;
  years: any;
  selectedLocation: any;
  branches: any;

  constructor(
    private hrmsService: HrmServiceService,
    private reportService : RecruitService,
    private monthService : TimesheetService,
    private toaster: ToastrService,
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.mainEmpId = localStorage.getItem('EmpMainId')
    this.getJobdescriptionReport();
    this.getAllDepartments();
    this.getMonthList();
    this.getYears();
    this.getAllBranch()
  }
  onSelectionChange() {
    this.getJobdescriptionReport();
  }
  getMonthList(){
    this.monthService.getMonthList().subscribe((res:any)=>{
      this.months = res.data;
    })
  }
  getYears(){
    this.hrmsService.getFinancialYear().subscribe((res:any)=>{
      this.years = res.data;
    })
  }
  getAllBranch(){
    this.reportService.getAllBranch().subscribe((res:any)=>{
      this.branches = res.data;
    })
  }
  getAllDepartments(){
    this.hrmsService.getAllDepartments(this.entity_id).subscribe({
      next: (res: any) => {
        this.departments = res.data;
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.departments = [];
          console.error('No attendance data found!.');
        } else {
          console.error('Error fetching report:', err);

        }
      }
    });
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  getJobdescriptionReport() {
    const data = {
      month_id : this.selectedMonth,
      financial_year_id : this.selectedYear,
      department_id: this.selectedDepartment,
      branch_id : this.selectedLocation
    };

    this.reportService.getJobdescriptionReport(this.entity_id, data).subscribe({
      next: (res: any) => {
        this.rowData = res.data;
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.rowData = [];
          this.toaster.error('No Job Description data found!.');
        } else {
          console.error('Error fetching report:', err);
          this.toaster.error('An error occurred while fetching the report.');
        }
      }
    });
  }
  public columnDefs = [
    {
      headerName: 'S No',
      field: 'node.rowIndex+1',
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 80,
      valueGetter: (params: any) => params.node.rowIndex + 1,
      tooltipValueGetter: (params: any) => `Serial Number: ${params.node.rowIndex + 1}`
    },
    {
      headerName: 'Job ID',
      field: 'jd_number',
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'jd_number',
      cellStyle: () => {
        return { fontWeight: 'bold' };
      },
    },
    {
      headerName: 'Job Title',
      field: 'job_title',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'job_title',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'department_name',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Location',
      field: 'branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'branch_name',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Job Description Summary',
      field: 'descripition',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,
      tooltipField: 'descripition',
      cellRenderer: (params: any) => {
        const description = params.value || 'N/A';
        return `<div class="job-description">${description}</div>`;
      }
    },
    {
      headerName: 'Skills Required',
      field: 'skill_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
      cellClass: "grid-cell-centered",
      tooltipField: 'skill_name',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Experience Required',
      field: 'experience',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'experience',
      cellRenderer: (params: any) => {
        if (params.value) {
          return `${params.value} ${params.value == 1 ? 'Year' : 'Years'}`;
        }
        return 'N/A';
      }
    },
    {
      headerName: 'Monthly Salary',
      field: 'monthly_salary',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'monthly_salary',
      cellRenderer: (params: any) => {
        if (params.value) {
          return new Intl.NumberFormat('en-IN').format(params.value);
        }
        return '0';
      }
    },
    {
      headerName: 'Job Posting Date',
      field: 'start_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'start_date',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Application Deadline',
      field: 'end_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'end_date',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Status',
      field: 'isCompletedJd',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'isCompletedJd',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Total Applications Received',
      field: 'total_application_received',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'total_application_received'
    }
  ];
  
  resetFilters(): void {
    this.selectedMonth = null;
    this.selectedDepartment = null;
    this.selectedLocation = null;
    this.selectedYear= null;

    this.onSelectionChange();
}
// downloadExcel() {
//   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rowData);
//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Daily Attendance Report');

//   const filters = [];

//   if (this.selectedEmployee) {
//     const employeeName = this.employeesList.find((emp: any) => emp.employee_id === this.selectedEmployee);
//     filters.push(`Employee: ${employeeName ? `${employeeName.first_name} ${employeeName.last_name}` : 'N/A'}`);
//   }
//   if (this.selectedDepartment) {
//     const departmentName = this.departments.find((dept: any) => dept.dept_id === this.selectedDepartment);
//     filters.push(`Department: ${departmentName ? departmentName.department_name : 'N/A'}`);
//   }
//   if (this.selectedShift) {
//     const shiftName = this.shifts.find((shift: any) => shift.id === this.selectedShift);
//     filters.push(`Shift: ${shiftName ? shiftName.shift_name : 'N/A'}`);
//   }

//   const ws_filter: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([filters]);
//   XLSX.utils.book_append_sheet(wb, ws_filter, 'Filters');

//   XLSX.writeFile(wb, 'daily-attendance-report.xlsx');
// }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
