import { Component } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TimesheetService } from 'src/app/@modules/employee-self-service/timesheet/timesheet.service';
import { ProjectManagementService } from 'src/app/@modules/project-management/services/project-management.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';

@Component({
  selector: 'app-backouts-jd-report',
  templateUrl: './backouts-jd-report.component.html',
  styleUrls: ['./backouts-jd-report.component.scss']
})
export class BackoutsJdReportComponent {
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
    this.getBackoutCandidatesReport();
    this.getMonthList();
    this.getYears();
  }
  onSelectionChange() {
    this.getBackoutCandidatesReport();
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
  getBackoutCandidatesReport() {
    const data = {
      month_id : this.selectedMonth,
      financial_year_id : this.selectedYear,
    };

    this.reportService.getBackoutCandidatesReport(this.entity_id, data).subscribe({
      next: (res: any) => {
        this.rowData = res.data;
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.rowData = [];
          this.toaster.error('No Backouts Job Description data found!.');
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
        headerName: 'Job ID',
        field: 'jd_number',
        sortable: false,
        resizable: true,
        wrapHeaderText: true,
        autoHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 120,
        cellStyle: { fontWeight: 'bold' },
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
        minWidth: 120,
        tooltipField: 'job_title',
        cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
        headerName: 'Candidate ID',
        field: 'candidate_id',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 120,
        tooltipField: 'candidate_id',
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
        headerName: 'Contact Details',
        field: 'contact_details',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 180,
        tooltipField: 'contact_details',
        cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
        headerName: 'Reason for Backing Out',
        field: 'candidate_remarks',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        flex: 1,
        minWidth: 100,
        cellClass: "grid-cell-centered",
        tooltipField: 'candidate_remarks', 
        cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
    {
        headerName: 'Date of Backout',
        field: 'backout_date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 100,
        tooltipField: 'backout_date', 
        cellRenderer: (params: any) => params.value ? params.value : 'N/A'
    },
];


  resetFilters(): void {
    this.selectedMonth = null;
    this.selectedYear= null;
    this.onSelectionChange();
}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
