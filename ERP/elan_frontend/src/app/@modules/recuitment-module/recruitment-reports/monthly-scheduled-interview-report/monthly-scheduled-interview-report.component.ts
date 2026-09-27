import { Component } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TimesheetService } from 'src/app/@modules/employee-self-service/timesheet/timesheet.service';
import { ProjectManagementService } from 'src/app/@modules/project-management/services/project-management.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';

@Component({
  selector: 'app-monthly-scheduled-interview-report',
  templateUrl: './monthly-scheduled-interview-report.component.html',
  styleUrls: ['./monthly-scheduled-interview-report.component.scss']
})
export class MonthlyScheduledInterviewReportComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  entity_id: string | null;
  mainEmpId: string | null;
  public rowData: any;
  gridOptions: GridOptions<any>;
  months: any;
  selectedMonth: any;
  selectedYear:any;
  years: any;
  rawEmp: any;
  employees: any;
  selectedEmployee:any;
  selectedRound:any;
  employeesList: any;
  selectedStatus:any;
  rounds = [
    { id: 1, round_name: 'First Round' },
    { id: 2, round_name: 'Final Round' }
  ];
  statuses = [
    { id: 1, status_name: 'COMPLETED' },
    { id: 2, status_name: 'PENDING' },
    { id: 3, status_name: 'ONGOING' },
  ];

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
    this.getInterviewerReport();
    this.getMonthList();
    this.getEmployees();
    this.getYears();
  }
  onSelectionChange() {
    this.getInterviewerReport();
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
  getInterviewerReport() {
    const data = {
      month_id : this.selectedMonth,
      interviewer_id : this.selectedEmployee,
      financial_year_id : this.selectedYear,
      selected_round : this.selectedRound,
      selectedStatus : this.selectedStatus
    };

    this.reportService.getMonthlyInterviewerReport(this.entity_id, data).subscribe({
      next: (res: any) => {
        this.rowData = res.data;
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.rowData = [];
          this.toaster.error('No Interview data found!.');
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
      valueGetter: (params: any) => params.node.rowIndex + 1
    },
    {
      headerName: 'Interview Date',
      field: 'interview_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'interview_date',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
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
      headerName: 'Candidate Name',
      field: 'candidate_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'candidate_name',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Recruiter Name',
      field: 'recruiter_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
      cellClass: "grid-cell-centered",
      tooltipField: 'recruiter_name',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },    {
      headerName: 'Interviewer Name',
      field: 'interviewer_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
      cellClass: "grid-cell-centered",
      tooltipField: 'interviewer_name',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Interview Stage',
      field: 'interview_round',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      tooltipField: 'interview_round',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
      headerName: 'Status',
      field: 'interview_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      tooltipField: 'interview_status',
      cellRenderer: (params: any) => params.value ? params.value : 'N/A',
      cellStyle: (params: any) => {
        if (params.value === 'SELECTED') {
          return { color: 'green', fontWeight: 'bold' };
        } else if (params.value === 'REJECTED') {
          return { color: 'red', fontWeight: 'bold' };
        } else if (params.value === 'HOLD') {
          return { color: 'orange', fontWeight: 'bold' };
        } else if (params.value === 'GO_FOR_BGV') {
          return { color: 'blue', fontWeight: 'bold' };
        } else if (params.value === 'APPROVED') {
          return { color: 'green', fontWeight: 'bold' };
        }
        return null;
      }
    }
  ];
  

  resetFilters(): void {
    this.selectedMonth = null;
    this.selectedRound = null;
    this.selectedStatus = null;
    this.selectedYear= null;
    this.selectedEmployee= null;

    this.onSelectionChange();
}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
