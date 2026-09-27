import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ProjectManagementService } from '../services/project-management.service';
import { ActionTaskManagementComponent } from '../task-management/action-task-management/action-task-management.component';
import { PriorityRendererComponent } from '../task-management/priority-renderer/priority-renderer.component';
import { ActionTimesheetComponent } from './action-timesheet/action-timesheet.component';

@Component({
  selector: 'app-timesheet-approval',
  templateUrl: './timesheet-approval.component.html',
  styleUrls: ['./timesheet-approval.component.scss']
})
export class TimesheetApprovalComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  mainEmpId: string | null;
  PendingTimesheet: boolean;
  ApprovedTimesheet: boolean;
  RejectedTimesheet: boolean;
  constructor(
   private route: Router,
   public dialog: MatDialog,
   private toast:ToastrService,
   private _commonService : CommonService,
   private _projectService : ProjectManagementService

   ) {
   this.rowClass = 'rowClass'
 }

 ngOnInit(): void {
  this.mainEmpId = localStorage.getItem('EmpMainId')
  this.getPendingTimesheetList();
 }
 
  public rowData:any;
  public columnDefs = [
    {
      headerName: 'S.No',
      field: 'node.rowIndex+1',
      sortable: false, 
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 80,
      valueGetter: (params:any) => params.node.rowIndex + 1
    },
    {
      headerName: 'Request ID',
      field: 'timesheet_request_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:120,
    },
    {
      headerName: 'Submmited By',
      field: 'employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:120,
    },
    {
      headerName: 'Project Name',
      field: 'project_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:120,
    },
    {
      headerName: 'Task Name ',
      field: 'task_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Total Hr',
      field: 'total_hour',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:100,
    },
    {
      headerName: 'Type',
      field: 'timesheet_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:100,
    },
    {
      headerName: 'Status',
      field: 'timesheet_approval_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Action',
      field: 'id', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellRenderer: ActionTimesheetComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, 
      },
      cellClass: "grid-cell-centered",
     
    },
    
  ];

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

  changeTabs(tabs:any){
    if(tabs=='PendingTimesheet'){
      this.PendingTimesheet=true;
      this.ApprovedTimesheet= false;
      this.RejectedTimesheet= false;
    }
    else if(tabs=='ApprovedTimesheet'){
      this.PendingTimesheet=false;
      this.ApprovedTimesheet= true;
      this.RejectedTimesheet= false;
      this.route.navigate(['master/project-management/approved-timesheet'])
    }else if(tabs=='RejectedTimesheet'){
      this.PendingTimesheet=false;
      this.ApprovedTimesheet= false;
      this.RejectedTimesheet= true;
      this.route.navigate(['master/project-management/rejected-timesheet'])
    }
    }
    getPendingTimesheetList(){
      const status = 'PENDING';
      this._commonService?.showLoader()
      this._projectService.getTimesheetForManager(this.mainEmpId,status).subscribe((res:any)=>{
      this._commonService?.hideLoader()
     this.rowData =res.data;
    },
    
    ((err:any)=>{
      this._commonService?.hideLoader()
      this.rowData=[]
    }))
    }
}
