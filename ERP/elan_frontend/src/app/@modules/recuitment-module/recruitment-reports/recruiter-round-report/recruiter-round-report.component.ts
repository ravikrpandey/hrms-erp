import { Component } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TimesheetService } from 'src/app/@modules/employee-self-service/timesheet/timesheet.service';
import { ProjectManagementService } from 'src/app/@modules/project-management/services/project-management.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';

@Component({
  selector: 'app-recruiter-round-report',
  templateUrl: './recruiter-round-report.component.html',
  styleUrls: ['./recruiter-round-report.component.scss']
})
export class RecruiterRoundReportComponent {
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
  rawEmp: any;
  employees: any;
  selectedEmployee:any;
  employeesList: any;

  constructor(
    private hrmsService: HrmServiceService,
    private reportService : RecruitService,
    private monthService : TimesheetService,
    private toaster: ToastrService,
    private _projectService: ProjectManagementService,
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.mainEmpId = localStorage.getItem('EmpMainId')
    this.getRecruiterRoundReport();
    this.getAllDepartments();
    this.getMonthList();
    this.getEmployees();
    this.getYears();
    this.getAllBranch()
  }
  onSelectionChange() {
    this.getRecruiterRoundReport();
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
  getEmployees() {
    this._projectService.getEmployees().subscribe(
      (response: any) => {
        if (response?.data?.length) {
          this.rawEmp = response.data;
          this.employeesList = response.data;
          this.employees = response.data.map((res: any) => res.first_name + res.last_name);
        }
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }
  employeeSearch(e: any) {
    const aa = e
    let filteredVariable = this.rawEmp.filter((item: any) => aa.includes(item.first_name + item.last_name));
    this.employeesList = filteredVariable
  }
  getRecruiterRoundReport() {
    const data = {
      month_id : this.selectedMonth,
      assign_id : this.selectedEmployee,
      financial_year_id : this.selectedYear,
      department_id: this.selectedDepartment,
      branch_id : this.selectedLocation
    };

    this.reportService.getRecruiterRoundReport(this.entity_id, data).subscribe({
      next: (res: any) => {
        this.rowData = res.data;
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.rowData = [];
          this.toaster.error('No Recruiter data found!.');
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
      headerClass: 'grid-header-centered'
    },
    {
      headerName: 'Recruiter Name',
      field: 'full_name',
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      cellStyle: () => {
        return { fontWeight: 'bold' };
      },
      headerClass: 'grid-header-centered',
      tooltipField: 'full_name', 
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Recruiter ID',
      field: 'employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      headerClass: 'grid-header-centered',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A',
      tooltipField: 'employee_code'
    },
    {
      headerName: 'Job ID',
      field: 'jd_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      headerClass: 'grid-header-centered',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A',
      tooltipField: 'jd_number'
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
      minWidth: 160,
      headerClass: 'grid-header-centered',
      tooltipField: 'job_title',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Total Candidates Submitted',
      field: 'total_candidates_submitted',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      headerClass: 'grid-header-centered',
      valueFormatter: (params: any) => params.value ? params.value.toLocaleString() : 'N/A', // Number formatting
      tooltipField: 'total_candidates_submitted',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: '1st Round Completed',
      field: 'first_round_completed',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
      cellClass: "grid-cell-centered",
      headerClass: 'grid-header-centered',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A',
      tooltipField: 'first_round_completed'
    },
    {
      headerName: 'Final Round Completed',
      field: 'last_round_completed',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
      cellClass: "grid-cell-centered",
      headerClass: 'grid-header-centered',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A',
      tooltipField: 'last_round_completed'
    },
    {
      headerName: 'Selection Rate',
      field: 'selection_rate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      headerClass: 'grid-header-centered',
      valueFormatter: (params: any) => {
        const rate = Number(params.value) || 0;
        return rate === 0 ? '0%' : `${rate.toFixed(1)}%`;
      },
      cellRenderer: (params: any) => {
        const rate = Number(params.value) || 0;
        return rate === 0 ? '0%' : `${rate.toFixed(1)}%`;
      },
      tooltipField: 'selection_rate',
      cellStyle: (params: any) => {
        const selectionRate = Number(params.value) || 0;
        if (selectionRate < 20) {
          return { color: 'red' };
        } else if (selectionRate >= 20 && selectionRate <= 60) {
          return { color: 'orange' }; 
        } else {
          return { color: 'green' };
        }
      }
    }
  ];
  

  resetFilters(): void {
    this.selectedMonth = null;
    this.selectedDepartment = null;
    this.selectedEmployee = null;
    this.selectedLocation = null;
    this.selectedYear= null;

    this.onSelectionChange();
}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
