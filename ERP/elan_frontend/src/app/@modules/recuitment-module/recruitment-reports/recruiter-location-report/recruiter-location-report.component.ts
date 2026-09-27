import { Component } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TimesheetService } from 'src/app/@modules/employee-self-service/timesheet/timesheet.service';
import { ProjectManagementService } from 'src/app/@modules/project-management/services/project-management.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';

@Component({
  selector: 'app-recruiter-location-report',
  templateUrl: './recruiter-location-report.component.html',
  styleUrls: ['./recruiter-location-report.component.scss']
})
export class RecruiterLocationReportComponent {
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
  employeesList: any;
  employees: any;
  selectedEmployee:any;

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
    this.getRecruiterLocationReport();
    this.getAllDepartments();
    this.getMonthList();
    this.getEmployees();
    this.getYears();
    this.getAllBranch()
  }
  onSelectionChange() {
    this.getRecruiterLocationReport();
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

  getRecruiterLocationReport() {
    const data = {
      month_id : this.selectedMonth,
      financial_year_id : this.selectedYear,
      branch_id : this.selectedLocation,
      assign_id  : this.selectedEmployee
    };

    this.reportService.getRecruiterLocationReport(this.entity_id, data).subscribe({
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
      minWidth: 60,
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
      minWidth: 100,
      tooltipField: 'full_name',
      cellStyle: () => {
        return { fontWeight: 'bold' };
      },
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
      headerName: 'Position Title',
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
      headerName: 'Total Positions Assigned',
      field: 'total_positions_handled',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 80,
      tooltipField: 'total_positions_handled',
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
      minWidth: 180,
      tooltipField: 'total_positions_closed',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
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
        if (!params.value ) {
          return 'N/A';
        }
        
        const value = parseFloat(params.value);
        const roundedValue = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
        
        const unit = value === 1 ? 'Day' : 'Days';
        return `${roundedValue} ${unit}`;
      }
    },
  ];
  

  resetFilters(): void {
    this.selectedMonth = null;
    this.selectedDepartment = null;
    this.selectedLocation = null;
    this.selectedYear= null;

    this.onSelectionChange();
}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
