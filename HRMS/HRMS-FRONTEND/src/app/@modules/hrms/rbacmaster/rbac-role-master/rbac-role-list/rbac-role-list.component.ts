import { Component, OnInit } from '@angular/core';
import {
  GridApi,
  GridReadyEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ActionsComponent } from '../actions/actions.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { NewRoleDialogComponent } from '../new-role-dialog/new-role-dialog.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-rbac-role-list',
  templateUrl: './rbac-role-list.component.html',
  styleUrls: ['./rbac-role-list.component.scss']
})
export class RbacRoleListComponent {
  errorMessage: any;
  products: any = [];
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  assignAction:any;
  loginUser: any;
  
  // roleData: any;
  constructor(
   private _rbacMasterService:RbacMasterService,
   private _rbackService:RbacMasterService,
   public dialog: MatDialog,
   private location: Location
    ) {
    this.rowClass = 'rowClass'

  }
  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    console.log(this.loginUser, "user login login user");
    
    this.getRole()
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150
    },
    {
      headerName: 'Designation Name',
      field: 'role_master_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150
    },

    {
      headerName: 'Status',
      field: 'status', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150
    },

    {
      headerName: 'Action',
      field: 'role_master_name',
      flex:1,
      minWidth:150,
      cellRenderer: ActionsComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      
    }
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
  // onCellClicked(e: any) {
  //   this.jobIdNew = e.data.id;
  //   
  //   localStorage.setItem("jobId", this.jobIdNew);
  //   // this.router.navigate(['hrms/recruitment-module/job-description/job-description-list/action.component'], { queryParams: { job_id: this.jobIdNew } })
  //   const dialogRef = this.dialog.open(AppListDialogComponent, { width: '500px', data: { jobId: this.jobIdNew } });
  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     
  //   })
  // }
  getRole(){
    this._rbacMasterService.getRole(this.loginUser.role).subscribe((res:any)=>{
      this.rowData=res.data;
      
      
    })
  }

  
    onCellClicked(e:any){
      
      const dialogRef = this.dialog.open(NewRoleDialogComponent,
        {
          width:'400px',
        data:{
          role_master_id:e.data.role_master_id}
      }
      );
        dialogRef.afterClosed().subscribe(result => {
          
        })
    }
  
}
