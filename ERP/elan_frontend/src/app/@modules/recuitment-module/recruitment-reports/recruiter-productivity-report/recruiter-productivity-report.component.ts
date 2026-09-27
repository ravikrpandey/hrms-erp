import { Component } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TimesheetService } from 'src/app/@modules/employee-self-service/timesheet/timesheet.service';
import { ProjectManagementService } from 'src/app/@modules/project-management/services/project-management.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';

@Component({
  selector: 'app-recruiter-productivity-report',
  templateUrl: './recruiter-productivity-report.component.html',
  styleUrls: ['./recruiter-productivity-report.component.scss']
})
export class RecruiterProductivityReportComponent {
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
    this.getRecruiterProductivityReport();
    this.getAllDepartments();
    this.getMonthList();
    this.getEmployees();
    this.getYears();
    this.getAllBranch()
  }
  onSelectionChange() {
    this.getRecruiterProductivityReport();
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
  getRecruiterProductivityReport() {
    const data = {
      month_id : this.selectedMonth,
      assign_id : this.selectedEmployee,
      financial_year_id : this.selectedYear,
      department_id: this.selectedDepartment,
      branch_id : this.selectedLocation
    };

    this.reportService.getRecruiterProductivityReport(this.entity_id, data).subscribe({
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
      tooltipValueGetter: (params: any) => `Serial Number: ${params.node.rowIndex + 1}`
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
      tooltipField: 'full_name',
      cellStyle: () => {
        return { fontWeight: 'bold' };
      },
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
      tooltipField: 'employee_code',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Total Positions Assigned',
      field: 'total_positions_handled',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'total_positions_handled',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Candidates Submitted',
      field: 'total_candidates_submitted',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 160,
      tooltipField: 'total_candidates_submitted',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Positions Closed',
      field: 'total_positions_closed',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'total_positions_closed',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Average Time to Submit Candidate',
      field: 'average_days_to_submit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
      tooltipField: 'average_days_to_submit',
      cellClass: "grid-cell-centered",
      cellRenderer: (params: any) => {
        if (!params.value || params.value == 0) {
          return 'N/A';
        }
        
        const value = parseFloat(params.value);
        const roundedValue = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
        
        const unit = value === 1 ? 'Day' : 'Days';
        return `${roundedValue} ${unit}`;
      }
    },
    {
      headerName: 'Average Time to Close Position',
      field: 'average_days_to_close_position',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
      tooltipField: 'average_days_to_close_position',
      cellClass: "grid-cell-centered",
      cellRenderer: (params: any) => {
        if (!params.value || params.value == 0) {
          return 'N/A';
        }
        
        const value = parseFloat(params.value);
        const roundedValue = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
        
        const unit = value === 1 ? 'Day' : 'Days';
        return `${roundedValue} ${unit}`;
      }
    },
    {
      headerName: 'Candidate Selection Rate',
      field: 'selection_rate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'selection_rate',
      cellRenderer: (params: any) => {
        const rejectionRate = Number(params.value) || 0;
        if (rejectionRate === 0) {
          return '0%';
        } else {
          return `${rejectionRate.toFixed(1)}%`;
        }
      }
    },
    {
      headerName: 'Rejection Rate',
      field: 'rejection_rate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'rejection_rate',
      cellRenderer: (params: any) => {
        const rejectionRate = Number(params.value) || 0;
        if (rejectionRate === 0) {
          return '0%';
        } else {
          return `${rejectionRate.toFixed(1)}%`;
        }
      },
      cellStyle: (params: any) => {
        const rejectionRate = Number(params.value) || 0;
        if (rejectionRate < 20) {
          return { color: 'green' };
        } else if (rejectionRate > 40) {
          return { color: 'red' };
        } else {
          return { color: 'orange' }; 
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
