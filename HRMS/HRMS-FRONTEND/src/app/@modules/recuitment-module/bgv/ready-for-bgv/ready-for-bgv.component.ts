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
import { ScheduleInterviewActionComponent } from '../../scheduled-interview/schedule-interview-action/schedule-interview-action.component';
import { BgvService } from 'src/app/@shared/services/service/recruitment/bgv.service';
import { BgvSendOnMailActionComponent } from '../bgv-send-on-mail-action/bgv-send-on-mail-action.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-ready-for-bgv',
  templateUrl: './ready-for-bgv.component.html',
  styleUrls: ['./ready-for-bgv.component.scss']
})
export class ReadyForBgvComponent {


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
  basicDetails: any;

  public gridOptions: any = { rowSelection: 'multiple', };
  dataList: any;
  constructor(
    private postServive: EmpMasterService,
    private route: ActivatedRoute,
    private router: Router,
    private _rbackService: RbacMasterService,
    private $bgv: BgvService,
    private location: Location,
  ) {
    this.rowClass = 'rowClass'

  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.user_id = localStorage.getItem('EmpMainId');
    let lg: any = localStorage.getItem('signInUser');
    this.userDetails = JSON.parse(lg);

    this.route.queryParams.subscribe((params: any) => {
      
      this.jd_id = params?.JD_id;
      if (this.jd_id) {
        this.get_scheduled_interview_list();
      }
    });

  }

  get_scheduled_interview_list() {
  
    this.$bgv.getAll_BGV_selectedcandidate(this.jd_id).subscribe((res: any) => {
      console.log(res);
      this.basicDetails = res.data[0];
      this.dataList = res?.profile_details;
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
      valueGetter: (data: any) => `${data.data.first_name || ''} ${data.data.last_name || ''}`.trim(),
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
      valueGetter: (params: any) => `+${params.data.country_code} ${params.data.contact_number}`
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
      field: 'bgv_status',
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
      cellRenderer: BgvSendOnMailActionComponent,
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
  goBack() {
    this.location.back();
  }

}