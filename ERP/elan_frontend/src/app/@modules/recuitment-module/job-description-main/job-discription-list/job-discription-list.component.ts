import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  GridApi,
  GridReadyEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionComponent } from '../../../../@shared/action/action.component';
import { MatDialog } from '@angular/material/dialog';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import * as moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { JobActionComponent } from '../job-action/job-action.component';
import { JobDescriptionService } from 'src/app/@shared/services/service/recruitment/job-description.service';

@Component({
  selector: 'app-job-discription-list',
  templateUrl: './job-discription-list.component.html',
  styleUrls: ['./job-discription-list.component.scss']
})
export class JobDiscriptionListComponent {


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
    private _rbackService: RbacMasterService,
    private $jobDescription: JobDescriptionService,
    private recruitService: RecruitService,
    private configMaster: ConfigurationalmasterService,
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    
    this.assignAction = this._rbackService.accessAssignAction();
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.user_id = localStorage.getItem('EmpMainId');
    let lg: any = localStorage.getItem('signInUser');
    this.userDetails = JSON.parse(lg);

    localStorage.removeItem("jobId")

    this.getRecruitListData();
    this.getDepartment();
    this.getAllJob();
    this.rowData = [
      {
        "id": "1",
        "job_title": "test",
        "description": "description",
        "job_role": "admin",
        "vertical_name": "vertical name",
        "department": "department"
      }
    ]

    this.getApprovedJob();
  }


  getAllJob() {
    let financial_id = localStorage.getItem("financial_id");
    let query = {
      user_id: this.user_id,
      entity_id: this.entity_id,
      user_role: this.userDetails?.role,
      financial_year_id: financial_id,
    }

    this.recruitService.getAllJobDescription(query).subscribe((res: any) => {
      console.log(res);
      
      this.rowDataJob = res.data;
      this.rowDataJob?.map((item: any) => {
        item.isApproved = true;
      })
    })
  }

  approvedJdList: any = [];
  getApprovedJob() {

    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem("financial_id");
    let data = {
      entity_id: entity_id,
      financial_year_id: financial_id,
    }
    this.$jobDescription.get_all_approved_jobrequest(entity_id,financial_id).subscribe((res: any) => {
      if (res) {

        this.approvedJdList = res?.data;
      }
    })
  }

  getAllJobRequest() {
    this.recruitService.getApprovedJobRequest().subscribe((res: any) => {
      console.log(res, 'resss');

    })
  }
  getDepartment() {
    this.configMaster.getAllDepartment_all_active(this.entity_id).subscribe((res: any) => {
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
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }
  getRecruitListData() {
    this.recruitService.getRecruitList().subscribe((res: any) => {
      let data: any = [];
      for (let val of res.data) {
        let format: any = {
          id: val.id,
          job_title: val.job_title,
          description: val.description,
          FK_vertical_id: val.FK_vertical_id,
          job_role: val.job_role,
          vertical_name: val.vertical?.vertical_name,
          department: val.department,
          createdAt: val.createdAt,
          job_type: val.job_type?.job_type,
          experience: val.experience,
          number_of_positions: val.number_of_positions,
          location: val.location,
          requisition_status: val.requisition_status,
          spoc_name: val.spoc_name,
          status: val.status,
          end_date: val.end_date,
        }
        data.push(format);
        // 
        console.log(data, 'data');

      }
      this.rowData = data;
      // 
    })
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
      cellRenderer: JobActionComponent,
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
  public columnDefsJob = [
    {
      headerName: 'Request ID',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueFormatter: function (params: any) {
        return 'REQ00' + params.value;
      },
      flex: 1,
      minWidth: 150
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
      minWidth: 130,
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
    // {
    //   headerName: 'Department',
    //   field: 'department_name', sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 130,
    // },
    // {
    //   headerName: 'Location',
    //   field: 'branch_name', sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 130,
    // },
    {
      headerName: 'Created By ',
      field: 'created_by_name', sortable: true,
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
      cellRenderer: JobActionComponent,
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