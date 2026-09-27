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
import { ShortlistedCandidateService } from 'src/app/@shared/services/service/recruitment/shortlisted-candidate.service';
import { ShortlistedCandidateActionComponent } from '../shortlisted-candidate-action/shortlisted-candidate-action.component';

@Component({
  selector: 'app-shortlisted-candidate-list',
  templateUrl: './shortlisted-candidate-list.component.html',
  styleUrls: ['./shortlisted-candidate-list.component.scss']
})
export class ShortlistedCandidateListComponent {

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
    private $shortlistedcandidate: ShortlistedCandidateService,
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
      user_id: this.user_id,
      entity_id: entity_id,
      user_role: this.userDetails?.role,
      financial_year_id: financial_id,
    }
    this.$shortlistedcandidate.get_all_shortlisted_candidate(query).subscribe((res: any) => {
      console.log(res);
      this.rowDataJob = res.data;
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
      headerName: 'Job Position',
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
      headerName: 'Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
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
      minWidth: 130,
    },
    {
      headerName: 'BGV Status',
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
      headerName: 'Candidate Offer Status',
      field: 'candidate_offer_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
      valueGetter: (params: any) => params.data.candidate_offer_status ? params.data.candidate_offer_status : 'Not Generated'
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ShortlistedCandidateActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
        onActionPerform: (data: any) => this.handleActionData(data),
      },
      cellClass: "grid-cell-centered"
    }
  ];

  handleActionData(data: any) {
    this.get_scheduled_interview_list('PENDING')
  }

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
  }

}