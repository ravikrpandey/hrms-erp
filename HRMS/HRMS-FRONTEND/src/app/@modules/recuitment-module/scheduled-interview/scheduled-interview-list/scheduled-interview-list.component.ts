import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  GridApi,
  GridReadyEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { JobDescriptionService } from 'src/app/@shared/services/service/recruitment/job-description.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActionStatusChangeComponent } from '../../condidate-profile/actions/actions.component';
import { ScheduledInterviewService } from 'src/app/@shared/services/service/recruitment/scheduled-interview.service';
import { ScheduleInterviewActionComponent } from '../schedule-interview-action/schedule-interview-action.component';

@Component({
  selector: 'app-scheduled-interview-list',
  templateUrl: './scheduled-interview-list.component.html',
  styleUrls: ['./scheduled-interview-list.component.scss']
})
export class ScheduledInterviewListComponent {


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
  profileDetails: any;

  public gridOptions: any = { rowSelection: 'multiple', };
  rowDataJob: any;
  constructor(private postServive: EmpMasterService,
    private router: Router,
    private _rbackService: RbacMasterService,
    private $jobDescription: JobDescriptionService,
    private scheduledInterview: ScheduledInterviewService,
  ) {
    this.rowClass = 'rowClass'

  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.user_id = localStorage.getItem('EmpMainId');
    let lg: any = localStorage.getItem('signInUser');
    this.userDetails = JSON.parse(lg);
    this.get_scheduled_interview_list('PENDING');
  }

  get_scheduled_interview_list(interview_status: any) {
  
    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem("financial_id");
    let query = {
      interview_status: interview_status,
      entity_id: entity_id,
      interviewer_id: this.user_id,
      financial_year_id: financial_id,
    }
    this.scheduledInterview.get_scheduled_interview_list(query).subscribe((res: any) => {
      console.log(res);
      this.rowDataJob = res.data;
    })
  }

  approvedJdList: any = [];
  getApprovedJob() {
  
    let entity_id = localStorage.getItem("selectedEntityId");
    this.$jobDescription.get_all_approved_jobrequest(entity_id).subscribe((res: any) => {
      if (res) {
        this.approvedJdList = res?.data;
      }
    })
  }

  openNav() {
   
    this.navWidth = 400;
  }

  closeNav() {
    this.navWidth = 0;
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
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
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
      valueGetter: (params: any) => `${params.data.first_name} ${params.data.last_name}`
    },
    {
      headerName: 'Position',
      field: 'designation_name',
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
      headerName: 'Contact No',
      field: 'contact_number',
      valueGetter: (params: { data: { country_code: any; contact_number: any; }; }) => `+${params.data.country_code || ''} ${params.data.contact_number || ''}`,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Final Status',
      field: 'final_status',
      sortable: true,
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
      cellRenderer: ScheduleInterviewActionComponent,
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
    if (label == "Scheduled Interviews") {
      this.rowDataJob = this.profileDetails?.recieved_profile;
      this.get_scheduled_interview_list('PENDING');
    }
    else {
      this.rowDataJob = this.profileDetails?.approved_profile;
      this.get_scheduled_interview_list('COMPLETED');
    };
  }

  tabs: any[] = [
    { label: 'Scheduled Interviews' },
    { label: 'Complete Interviews' },
  ];

  addProfile() {
    this.router.navigate(['master/recruitment/candidate-profile/add-profile'], { queryParams: { job_id: this.jd_id } })
  }

}