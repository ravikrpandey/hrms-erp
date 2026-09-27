import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ActionsComponent } from '../actions/actions.component'; 
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-role-assign-admin-user',
  templateUrl: './role-assign-admin-user.component.html',
  styleUrls: ['./role-assign-admin-user.component.scss']
})
export class RoleAssignAdminUserComponent {
  errorMessage: any;
  products: any = [];
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  roleData: any;
  roleAssignForm:any;
  loginUser: any;
  constructor(
   private _rbacMasterService:RbacMasterService,
   private fb:FormBuilder
     ) {
    this.rowClass = 'rowClass'

    this.roleAssignForm=this.fb.group({
      role_name:new FormControl(null),
      selectUser:new FormControl(null)
    })
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.getRole()
  }

  public columnDefs = [
    {
      headerName: 'S. no',
      field: 'id',
      flex:1,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered"
    },
    {
      headerName: 'Role Name',
      field: 'role_name',
      flex:1,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered"
    },
    
    {
      headerName: 'User Name',
      field: 'job_title',
      flex:1,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered"
    },

    {
      headerName: 'Official Email Id',
      field: 'official_email_id',
      flex:1.3,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered"
    },
    {
      headerName: 'Status',
      field: 'status', sortable: true,
      flex:1,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered"
    },

    {
      headerName: 'Action',
      field: 'id',
      flex:1,
      cellRenderer: ActionsComponent,
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
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  
  getRole() {
    this._rbacMasterService.getRole(this.loginUser.role).subscribe((res: any) => {
      this.roleData = res.data;
      

    })
  }

  roleAssignSubmit(){
    let val=this.roleAssignForm.value;
    
    
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
}

