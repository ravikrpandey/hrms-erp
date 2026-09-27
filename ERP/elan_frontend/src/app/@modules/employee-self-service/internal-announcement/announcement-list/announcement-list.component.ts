import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import {
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MatDialog } from '@angular/material/dialog';
// import { ActionComponent } from '../../employee/employee-list/action/action.component';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ActionComponent } from 'src/app/@shared/action/action.component';
import { AnnouncementViewComponent } from '../announcement-view/announcement-view.component';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.scss']
})
export class AnnouncementListComponent  implements OnInit {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData:any;
  assignAction:any;
  
  constructor(private _empService: EmpRegistrationService, public dialog: MatDialog, private _rbackService:RbacMasterService, private _empmasterservice:EmpMasterService) {
   this.rowClass = 'rowClass'
  }
  ngOnInit(): void {
    localStorage.setItem("employee_id:", "undefined");
    // this._empService.grtEmployeeList().subscribe((res: any) => {
    //   this.rowData =  res.data;
    //   
    // })
    this. announcementList()
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }

  public columnDefs = [
    {
      headerName: 'S.NO',
      field: 'email_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Issued On',
      field: 'createdAt', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Subject',
      field: 'subject', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Issued To',
      field: 'updatedAt',
       sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Status',
      field: 'email_status', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Action',
      field: 'email_id',
      flex:1,
      minWidth:150,
      cellRenderer: ActionComponent,
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



  announcementList(){
    this._empmasterservice.getAnnouncment().subscribe((res:any)=>{
      this.rowData=res.data;
      
      
    })
  }
  
  onCellClicked(e:any){
    
    const dialogRef = this.dialog.open(AppListDialogComponent,
      {
        width:'40%',
      data:{announcementId:e.data.email_id}
    }
    );
      dialogRef.afterClosed().subscribe(result => {
        
      })
  }
}



