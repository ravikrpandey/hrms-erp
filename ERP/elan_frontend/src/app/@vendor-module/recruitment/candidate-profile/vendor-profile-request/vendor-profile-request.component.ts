import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ActionStatusChangeComponent } from 'src/app/@modules/recuitment-module/condidate-profile/actions/actions.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { CondidateProfileService } from 'src/app/@shared/services/service/recruitment/condidate-profile.service';
import { JobDescriptionService } from 'src/app/@shared/services/service/recruitment/job-description.service';
import { ActionComponent } from './action/action.component';

@Component({
  selector: 'app-vendor-profile-request',
  templateUrl: './vendor-profile-request.component.html',
  styleUrls: ['./vendor-profile-request.component.scss']
})
export class VendorProfileRequestComponent {
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
  jd_id: any;

  public gridOptions: any = { rowSelection: 'multiple', };
  rowDataJob: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private $jobDescription: JobDescriptionService,
    private $candidateProfile: CondidateProfileService,
    private recruitService: RecruitService, private configMaster: ConfigurationalmasterService) {
    this.rowClass = 'rowClass'


  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    let lg: any = localStorage.getItem('signInUser');
    this.userDetails = JSON.parse(lg);
    localStorage.removeItem("jobId")

    this.route.queryParams.subscribe((params: any) => {

      this.jd_id = params?.id;
      if (this.jd_id) {
        this.getAllJobDescription('All');
      }
    });

    this.getRecruitListData();
    this.getDepartment();
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


  profileDetails: any = {};
  getAllJobDescription(selection_status: any) {

    let query = {
      selection_status: selection_status,
      jd_id: this.jd_id,
      vendor_id:this.userDetails?.id
    }
    this.$candidateProfile.getAll_candidate_BY_JD_idByVendor(query).subscribe((res: any) => {
      console.log(res);

      this.profileDetails = res?.data[0];
      this.rowDataJob = res?.profile_details;
      this.rowDataJob?.map((item: any) => {
        item.level_of_interview = this.profileDetails?.level_of_interview;
        item.full_name = item?.first_name + ' ' + item?.last_name;
      })
    })
  }

  approvedJdList: any = [];
  getApprovedJob() {

    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_year = localStorage.getItem("financialYear");
    this.$jobDescription.get_all_approved_jobrequest(entity_id,financial_year).subscribe((res: any) => {
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

    this.navWidth = 400;
  }

  closeNav() {
    this.navWidth = 0;
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
      headerName: 'Candidate Name',
      field: 'full_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Contact No',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
      valueGetter: (params: any) => `${params.data.country_code} ${params.data.contact_number}`
    },
    {
      headerName: 'Email ID',
      field: 'email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Status',
      field: 'selection_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
      valueFormatter: (params:any) => {
        return params.value === 'SELECTED' ? 'PENDING' : params.value;
      },
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionComponent,
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
      headerName: 'S.No',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
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
      headerName: 'Status',
      field: 'selection_status', sortable: true,
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
      cellRenderer: 'CondidateProfileAction',
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

  tabChange(event: MatTabChangeEvent): void {

    let label = event?.tab?.textLabel;
    if (label == "Pending Profile") {
      this.getAllJobDescription('SELECTED');
    }
    else if (label == "Approved Profile") {
      this.getAllJobDescription('APPROVED');
    }
    else if (label == "Rejected Profile") {
      this.getAllJobDescription('REJECTED');
    }else if(label=='All Profile'){
      this.getAllJobDescription('All');
    }
    else {
      this.getAllJobDescription('HOLD');
    };
  }

  tabs: any[] = [
    { label: 'All Profile' },
    { label: 'Pending Profile' },
    { label: 'Approved Profile' },
    { label: 'Rejected Profile' },
    { label: 'Hold' },
  ];

  addProfile() {
    this.router.navigate(['vendor/recruitment/candidate-profile/add-profile'], { queryParams: { job_id: this.jd_id } })
  }
  goBack() {
    window.history.back()
  }

}
