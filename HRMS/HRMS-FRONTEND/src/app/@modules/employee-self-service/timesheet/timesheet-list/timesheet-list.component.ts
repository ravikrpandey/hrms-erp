import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ActionComponent } from 'src/app/@shared/action/action.component';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { TimesheetActionComponent } from './timesheet-action/timesheet-action.component';
import { TimesheetDialogComponent } from './timesheet-dialog/timesheet-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { StatusComponent } from './status/status.component';

@Component({
  selector: 'app-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss']
})
export class TimesheetListComponent implements OnInit {

  private gridApi!: GridApi<any>;
  rowData: any;
  rowData2: any;
  rowData1: any;
  personalIdData: any;
  propertyManager: any
  text: any;
  firstLastName: any;
  rowClass: any;
  buttonText: string = '';
  buttonText1: string = '';
  assignAction:any;
  
  constructor(private emp_master: EmpMasterService,
    private empService: EmpRegistrationService,
    private _rbackService:RbacMasterService,
    public dialog: MatDialog) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    
    // this.empService.grtEmployeeList().subscribe((res:any)=>{
    //   this.rowData1 = res.data;
    //   // 
    // })
    this.emp_master.timeSheetList().subscribe((res: any) => {
      this.rowData = res.data;
      // this.propertyManager = Array.from(this.rowData, (a: any) => `${a.registered_users[0]}`);
      // this.rowData1 = this.rowData[0].registered_users;
      
      // // this.rowData = this.rowData2.push(this.rowData1);
      // 
    })

    let approve: any = document.getElementsByClassName('approve');
    let reject: any = document.querySelector('.reject');
    
    
    

    // approve.addEventListener('click',(e: any) => {
    //   e.stopPropagation();
    //   
    // })

    // reject.addEventListener((e: any) => {
    //   e.stopPropagation();
    //   
    // })
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }

  public columnDefs = [
    {
      headerName: 'S.No',
      field: 'i',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueGetter: 'node.rowIndex+1',
      flex:1,
      // minWidth:150
    },
    {
      headerName: 'Date',
      field: 'date_off_request',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      // minWidth:150,
      cellClass: "grid-cell-centered",
      // valueFormatter: 'registered_users[0].first_name',
      valueFormatter: 'value[0].first_name'
    },
    {
      headerName: 'Employee Id',
      field: 'employee_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      // minWidth:150
    },
    {
      headerName: 'Employee Name',
      field: 'employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      // minWidth:150
    },
    {
      headerName: 'Reason Time-Off',
      field: 'time_off_request_reason',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      // minWidth:150
    },
    {
      headerName: 'Manager Name',
      field: 'manager_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: 'JSON.parse(value)',
      flex:1,
      // minWidth:150

    },
    {
      headerName: 'Time-Off Applied',
      field: 'time_off_request',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      // minWidth:150
      // valueFormatter: 'value[0].first_name',
      // valueFormatter: 'new Date(value).toLocaleTimeString()',
      // new Date(this.singleEmpData.time_off_request).toLocaleTimeString()
    },
    {
      headerName: 'Time-Off Taken',
      field: 'time_off_taken',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      // minWidth:150
    },
    {
      headerName: 'Status',
      field: 'approve_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
       minWidth:100,
      cellRenderer: StatusComponent

    },
    {
      headerName: 'Action',
      field: 'approve_status',
      flex:1,
      // minWidth:150,
      valueFormatter: 'value[0].first_name',
      cellRenderer: TimesheetActionComponent 
      // cellRenderer: (data: any) => {
      //   if (data.value === true) {
      //     return "<span class='approve' (click)='approve(res.data.timesheet_id)' >Approved</span>"
      //   }
      //   else if (data.value === false) {
      //     return "<span class='reject'>Reject</span>";
      //   }
      //   else {
      //     return "<span class='approve'>Approved</span>" +
      //       "<span class='reject'>Reject</span>";
      //   }
      // },
    }

  ];

  approve(){
    
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
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    // 

  }
  onCellClicked(e: any) {
    
    const dialogRef = this.dialog.open(TimesheetDialogComponent, { width: '400px', data: { timeSheetViewId: e.data.timesheet_id } });
    dialogRef.afterClosed().subscribe(result => {
      
    })
  }
}
