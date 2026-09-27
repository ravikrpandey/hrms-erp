import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { JobDescriptionService } from 'src/app/@shared/services/service/recruitment/job-description.service';
import { VendorJobActionComponent } from './vendor-job-action/vendor-job-action.component';
import { CandidateActionComponent } from '../candidate-profile/candidate-action/candidate-action.component';

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent {


  errorMessage: any;
  products: any = [];
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  isLoading = true;
  jobIdNew: any;
  assignAction: any;
  entity_id: string | null;
  user_id: any;
  userDetails: any = {};
  departments: any;
  navWidth: number = 0;
  // dateFormatter: any;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowDataJob: any;
  constructor(private postServive: EmpMasterService,
    private router: Router,
    private route: ActivatedRoute,
    private _empService: EmpRegistrationService,
    private dialog: MatDialog,
    private $jobDescription: JobDescriptionService,
    private recruitService: RecruitService,
    private configMaster: ConfigurationalmasterService,
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser');
    this.userDetails = JSON.parse(lg);
    this.getDepartment();
    this.getAllJob();


  }
  getAllJob() {
    this.recruitService.getAll_job_requirement(this.userDetails?.entity_id,this.userDetails?.id).subscribe((res: any) => {
      console.log(res);

      this.rowDataJob = res.data;
      this.rowDataJob?.map((item: any) => {
        item.isApproved = true;
      })
    })
  }


  getDepartment() {
    this.configMaster.getAllDepartment_all_active(this.userDetails?.entity_id).subscribe((res: any) => {
      this.departments = res.data;
    })
  }
  getAllAreas(e: any) {

  }
  openNav() {

    this.navWidth = 700;
  }

  closeNav() {
    this.navWidth = 0;
  }

  public columnDefs = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'JD ID',
      field: 'jd_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Job Title',
      field: 'job_title',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },
    {
      headerName: 'Job Position ',
      field: 'designation_name', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Department',
      field: 'department_name', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Contract Type',
      field: 'contract_Type', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Location',
      field: 'branch_name', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: CandidateActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: "grid-cell-centered"
    }
  ];

  // popup
  // public columnDefsJob = [
  //   {
  //     headerName: 'Request ID',
  //     field: 'id',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: "grid-cell-centered",
  //     valueFormatter: function (params: any) {
  //       return 'REQ00' + params.value;
  //     },
  //     flex: 1,
  //     minWidth: 150
  //   },
  //   {
  //     headerName: 'Job Title',
  //     field: 'job_title',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: "grid-cell-centered",
  //     flex: 1,
  //     minWidth: 130,
  //   },
  //   {
  //     headerName: 'Job Position ',
  //     field: 'designation_name', sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: "grid-cell-centered",
  //     flex: 1,
  //     minWidth: 130,
  //   },
  //   // {
  //   //   headerName: 'Department',
  //   //   field: 'department_name', sortable: true,
  //   //   resizable: true,
  //   //   wrapHeaderText: true,
  //   //   autoHeaderHeight: true,
  //   //   cellClass: "grid-cell-centered",
  //   //   flex: 1,
  //   //   minWidth: 130,
  //   // },
  //   // {
  //   //   headerName: 'Location',
  //   //   field: 'branch_name', sortable: true,
  //   //   resizable: true,
  //   //   wrapHeaderText: true,
  //   //   autoHeaderHeight: true,
  //   //   cellClass: "grid-cell-centered",
  //   //   flex: 1,
  //   //   minWidth: 130,
  //   // },
  //   {
  //     headerName: 'Created By ',
  //     field: 'created_by_name', sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: "grid-cell-centered",
  //     flex: 1,
  //     minWidth: 130,
  //   },
  //   {
  //     headerName: 'Action',
  //     field: 'id',
  //     flex: 1,
  //     minWidth: 150,
  //     cellRenderer: '',
  //     cellRendererParams: {
  //       className: 'mat-blue',
  //       hideRequestButton: true,
  //       hideDetailsButton: false,
  //       hideDownloadIcon: false,
  //       showCustomIcon: false, // Hide attachment icon
  //     },
  //     cellClass: "grid-cell-centered"
  //   }
  // ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  dateFormatter(createdAt: any) {
    return moment(createdAt).format('DD/MM/YYYY');
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

  onCellClicked(e: any) {
    // this.jobIdNew = e.data.id;

    // localStorage.setItem("jobId", this.jobIdNew);
    // // this.router.navigate(['hrms/recruitment-module/job-description/job-description-list/action.component'], { queryParams: { job_id: this.jobIdNew } })
    // const dialogRef = this.dialog.open(AppListDialogComponent, { width: '500px', data: { jobId: this.jobIdNew } });
    // dialogRef.afterClosed().subscribe((result: any) => {

    // })
  }

}
