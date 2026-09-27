import { Component, OnInit } from '@angular/core';
import {
  GridApi, GridReadyEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service'; 
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ColleagueReviewService } from 'src/app/@shared/services/colleague-review.service';
import { ActionColleagueReview } from '../action/action.component';
// import { ActionColleagueReview } from '../action/action.component';

@Component({
  selector: 'colleague-review-list',
  templateUrl: './colleague-review-list.component.html',
  styleUrls: ['./colleague-review-list.component.scss'],
})
export class ColleagueReviewListComponent {


  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  assignAction:any;
  loginUser: any;
  EmpMainId: any;
  filter_fy: string | null;
  entity_id: any;
  id:any ;


  constructor(
    public dialog: MatDialog,
    private route: Router,
    private colleagueReviewService: ColleagueReviewService,
    private _rbackService:RbacMasterService,
    private _commonService : CommonService,
        private activetRoute: ActivatedRoute,
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.localStorage()
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
    });
  }

  localStorage = () => {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.EmpMainId = this.loginUser.employee_id;
    this.filter_fy = localStorage.getItem('financial_id');
    this.entity_id = JSON.parse(entity);
    this.getList()
  }

  getList = () => {
    this._commonService?.showLoader();
    this.colleagueReviewService
      .getAllReviews(this.filter_fy, this.EmpMainId, this.entity_id)
      .subscribe(
        (res) => {
          this.rowData = res.data.map((item: any) => ({
            ...item,
            employee_id: item.employee_id, 
            submit_assessment_id: item.submit_assessment_id,
            yearly_assessment_id: item.yearly_assessment_id,
            entity_id:item.entity_id
          }));
          console.log("Row Data:", this.rowData)
          this._commonService?.hideLoader();
        },
        (err: any) => {
          console.error("Error fetching reviews:", err);
          this.rowData = [];
          this._commonService?.hideLoader();
        }
      );
  };
  



  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }

  public columnDefs = [
    {
      headerName: 'S.No',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Assessment Name',
      field: 'assessment_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Employee Name',
      field: 'executiondata',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Employee Number',
      field: 'employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Rating',
      field: 'final_colleague_rating',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellClass: 'grid-cell-centered',
    },
    
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionColleagueReview,
      cellRendererParams: (params: any) => ({
        matTooltip: 'View',
        hideRequestButton: true,
        hideDetailsButton: true,
        hideDownloadIcon: true,
        showCustomIcon: true,
        submitAssessmentId: params.data.submit_assessment_id, 
        yearlyAssessmentId: params.data.yearly_assessment_id, 
        employee_id: params.data.employee_id,
        entity_id:params.data.entity_id,
      }),
    },
    
  ];
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    
  }
  create() {
    this.route.navigate(['master/ess/colleague-review/add']);
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

}

