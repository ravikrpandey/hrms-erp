import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActionsComponent } from './actions/actions.component';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { TravelWorkflowLevelDialogComponent } from './travel-workflow-level/travel-workflow-level-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-travel-request-list',
  templateUrl: './travelrequestlist.component.html',
  styleUrls: ['./travelrequestlist.component.scss'],
})
export class TravelRequestListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  entity_Id: any;
  loginUser: any;
  workflowcheck: boolean;
  financial_id: any;
  assignAction: any;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55};

  constructor(
    private travel_service: TravelRequestService,
    public dialog: MatDialog,
    private _rbackService:RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private _commonService : CommonService 
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.localStorage()
    this.assignAction = this._rbackService.accessAssignAction();
    this.get_travel_details_by_id()
    this.get_all_travel_request()
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    let financialid: any = localStorage.getItem('financial_id');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
    this.financial_id = JSON.parse(financialid);
  }

  public columnDefs: any = [
    {
      headerName: 'S.No',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100
    },
    {
      headerName: 'Travel Request Number',
      field: 'travel_request_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Emp Name ',
      field: 'travel_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Start Date ',
      field: 'travel_from_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params:any) => this.formatDate(params.value)
    },
    {
      headerName: 'End Date',
      field: 'travel_to_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params:any) => this.formatDate(params.value)
    },
    {
      headerName: 'Status',
      field: 'travel_request_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },

    {
      headerName: 'Action',
      field: 'states_name',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionsComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];

  formatDate(dateString:any) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  }

  get_travel_details_by_id() {
    this._commonService?.showLoader()
    this.travel_service.get_travel_details_by_id(this.loginUser.employee_id,this.entity_Id).subscribe((res: any) => {
      if(res){
        this.workflowcheck = false
        this._commonService?.hideLoader()
      }
    },
      (err: any) => {
        this._commonService?.hideLoader()
        if (err.error.message == "Workflow is not created for required department!") {
          this.workflowcheck = true
        }
      });
  }

  get_all_travel_request() {
    const payload={
      user_id: this.loginUser.employee_id,
      entity_id: this.entity_Id,
      role:this.loginUser.role,
      financial_year_id:this.financial_id
    }
    this._commonService?.showLoader()
    this.travel_service.get_all_travel_request(payload).subscribe((res: any) => {
      this.rowData = res.data
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  navigation(){
    this.router.navigate(['/master/ess/travel-request/create-travel-request'])
    // if(this.workflowcheck==false){
    // }
    // else{
    //   this.toaster.error("Workflow is not created for required department!")
    // }
  }

  statusCellClicked(e: any) {
    if (e.colDef && e.colDef.headerName === 'Action') {
      return;
    }
    const dialogRef = this.dialog.open(TravelWorkflowLevelDialogComponent, { width: '400px', data: e.data });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
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
}
