import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ProjectManagementService } from '../services/project-management.service';
import { DatePipe } from '@angular/common';
import { ActionProjectListComponent } from './action-project-list/action-project-list.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  entity_id: string | null;
  mainEmpId: string | null;
 
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
  this.getProjectList();
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
      minWidth: 150,
      valueGetter: (params:any) => params.node.rowIndex + 1
    },
    {
      headerName: 'Client Name',
      field: 'client_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Project Name ',
      field: 'project_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
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
      minWidth:150,
      valueGetter: (params:any) => {
        return this.datePipe.transform(params.data.start_date, 'yyyy-MM-dd');
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
      minWidth:150,
      valueGetter: (params:any) => {
        return this.datePipe.transform(params.data.end_date, 'yyyy-MM-dd');
      }
    },
    {
      headerName: 'Status',
      field: 'project_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Actions',
      field: 'id', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      cellRenderer: ActionProjectListComponent,
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

  addProject(path:any){
    this.route.navigate([path]);
  }

  getProjectList(){
    this._commonService?.showLoader()
    this._projectService.getProjectList(this.mainEmpId).subscribe((res:any)=>{
      this._commonService?.hideLoader()
     this.rowData =res.data.allProjectData;
    },
    
    ((err:any)=>{
      this._commonService?.hideLoader()
      this.rowData=[]
    }))
  }
}
