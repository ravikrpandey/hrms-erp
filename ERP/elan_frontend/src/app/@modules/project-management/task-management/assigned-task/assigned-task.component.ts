import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ProjectManagementService } from '../../services/project-management.service';
import { ActionTaskManagementComponent } from '../action-task-management/action-task-management.component';
import { PriorityRendererComponent } from '../priority-renderer/priority-renderer.component';
import { AssignedActionComponent } from './assigned-action/assigned-action.component';

@Component({
  selector: 'app-assigned-task',
  templateUrl: './assigned-task.component.html',
  styleUrls: ['./assigned-task.component.scss']
})
export class AssignedTaskComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  entity_id: string | null;
  mainEmpId: string | null;
  TotalTask: boolean;
  AssignedTask: boolean;
  priorityData = [
    { id: 1, name: 'Emergency', value: 'EMERGENCY', icon: 'error', color: 'red' },
    { id: 2, name: 'Blocker', value: 'BLOCKER', icon: 'block', color: 'red' },
    { id: 3, name: 'Highest', value: 'HIGHEST', icon: 'priority_high', color: 'orange' },
    { id: 4, name: 'High', value: 'HIGH', icon: 'arrow_upward', color: 'orange' },
    { id: 5, name: 'Normal', value: 'NORMAL', icon: 'swap_horiz', color: 'black' },
    { id: 6, name: 'Low', value: 'LOW', icon: 'arrow_downward', color: 'green' },
    { id: 7, name: 'Lowest', value: 'LOWEST', icon: 'low_priority', color: 'green' },
  ];
  statuses = [
    { name: 'Not Started', value: 'NOT STARTED', color: 'dodgerblue' }, 
    { name: 'In Progress', value: 'IN PROGRESS', color: 'limegreen' }, 
    { name: 'Review', value: 'REVIEW', color: 'darkorange' }, 
    { name: 'On Hold', value: 'ON HOLD', color: 'purple' }, 
    { name: 'Closed', value: 'CLOSED', color: 'darkred' }, 
    { name: 'Canceled', value: 'CANCELLED', color: 'red' } 
  ];
  constructor(
   private route: Router,
   public dialog: MatDialog,
   private toast:ToastrService,
   private datePipe: DatePipe,
   private _commonService : CommonService,
   private _projectService : ProjectManagementService

   ) {
   this.rowClass = 'rowClass'
 }

 ngOnInit(): void {
  this.entity_id = localStorage.getItem('selectedEntityId');
  this.mainEmpId = localStorage.getItem('EmpMainId')
  this.getAssignedTasks();
 }
 
  public rowData:any;
  public columnDefs = [
    {
      headerName: 'S.No',
      field: 'node.rowIndex+1',
      sortable: false, // Serial numbers typically shouldn't be sortable
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 80,
      valueGetter: (params:any) => params.node.rowIndex + 1
    },
    {
      headerName: 'Priority',
      field: 'priority',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:120,
      cellRendererFramework: PriorityRendererComponent,
    cellRendererParams: {
      getPriorityData: (priorityValue: string) =>
        this.priorityData.find(p => p.value === priorityValue),
    },
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
      headerName: 'Task Type',
      field: 'task_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:120,
    },
    {
      headerName: 'Start Date',
      field: 'start_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:120,
      valueGetter: (params:any) => {
        return this.datePipe.transform(params.data.end_date, 'yyyy-MM-dd');
      }
    },
    {
      headerName: 'End Date',
      field: 'end_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:120,
      valueGetter: (params:any) => {
        return this.datePipe.transform(params.data.end_date, 'yyyy-MM-dd');
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
      cellRenderer: (params: any) => this.statusColorRenderer(params.value),
    },
    {
      headerName: 'Action',
      field: 'id', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellRenderer: AssignedActionComponent,
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
  statusColorRenderer(statusValue: string): string {
    const status = this.statuses.find(s => s.value === statusValue);
    if (status) {
      return `
        <span style="display: flex; align-items: center; color: ${status.color};">
          ${status.name}
        </span>
      `;
    }
    return statusValue;
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

  addTask(path:any){
    this.route.navigate([path]);
  }
  changeTabs(tabs:any){
    if(tabs=='TotalTask'){
      this.TotalTask=true;
      this.AssignedTask= false;
      this.route.navigate(['master/project-management/task-management'])
    }
    else if(tabs=='AssignedTask'){
      this.TotalTask=false;
      this.AssignedTask= true;
      
    }
    }
  getAssignedTasks(){
    this._commonService?.showLoader()
    this._projectService.getAssignedTasks(this.mainEmpId).subscribe((res:any)=>{
      this._commonService?.hideLoader()
     this.rowData =res.data;
    },
    
    ((err:any)=>{
      this._commonService?.hideLoader()
      this.rowData=[]
    }))
  }
}
