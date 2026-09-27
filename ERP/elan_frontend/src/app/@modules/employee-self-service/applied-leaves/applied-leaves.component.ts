import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { MatDialog } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ActionComponent } from '../employee/employee-list/action/action.component';
import { LeaveApplyActionComponent } from '../leave-apply-action/leave-apply-action.component';
import { LeaveDialogComponent } from '../leave-apply-create/leave-dialog/leave-dialog.component';
import { LeaveApplyService } from 'src/app/@shared/services/ess/leave-apply.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AppliedLeaveActionComponent } from 'src/app/applied-leave-action/applied-leave-action.component';
import { CommonService } from 'src/app/@shared/services/common.service';



@Component({
  selector: 'app-applied-leaves',
  templateUrl: './applied-leaves.component.html',
  styleUrls: ['./applied-leaves.component.scss']
})


export class AppliedLeavesComponent implements OnInit {
  
  rowClass: any;
  private gridApi!: GridApi<any>;
  count: any;
  remaning: any;
  public employeeId: string | null;
  rowData: any;
  financial_id: any;
  entity_id: any;
  role_id: string | null;
public gridOptions: any = {  rowHeight: 55};



  constructor(
    private route: Router,
    private LeaveApplyService: LeaveApplyService,
    private _commonService : CommonService,
    public dialog: MatDialog,) {
    this.rowClass = 'rowClass'
  }

  columnDefs: any =[]

  ngOnInit(): void {

    // Retrieve the stored JSON string from localStorage
    const signInUser = localStorage.getItem('signInUser');
    this.financial_id = localStorage.getItem('financial_id');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.role_id = localStorage.getItem('role_master_id');

    if (signInUser) {
      // Parse the JSON string to get the JavaScript object
      const userObject = JSON.parse(signInUser);

      // Access the employee_id field from the parsed object
      this.employeeId = userObject.employee_id;
      this.getEmployeeLeaveList(this.employeeId)
    } else {
      console.error("No signInUser found in localStorage");
    }
    this.columnDefs = [
      {
        headerName: "S.No" ,
        valueGetter: "node.rowIndex + 1",
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        maxWidth:85,
      },
      {
        headerName: 'Employee Name',
        field: 'employeeName',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 200,
        valueGetter: (params: any) => `${params.data?.HRMS_REGISTERED_USER?.first_name} ${params.data?.HRMS_REGISTERED_USER?.last_name}`,
      },
      {
        headerName: 'Leave Name',
        field: 'HRMS_LEAVE_MASTER.leave_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'No Of Days',
        field: 'leave_days',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        flex: 1,
        minWidth: 150,
      },    
      {
        headerName: 'Start Day',
        field: 'start_date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        flex: 1,
        minWidth: 150,
        valueGetter: (params: any) => moment(params.data?.start_date).format('YYYY-MM-DD'),
      },
      {
        headerName: 'End Day',
        field: 'end_date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        flex: 1,
        minWidth: 150,
        valueGetter: (params: any) => moment(params.data?.end_date).format('YYYY-MM-DD'),
      },
      {
        headerName: 'Status',
        field: 'status',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        flex: 1,
        minWidth: 100,
        valueGetter: () => 'Pending',
      },
      {
        headerName: 'Action',
        cellRenderer: AppliedLeaveActionComponent,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        flex: 1,
        minWidth: 150,
      }];
    

  }


 
  

  routeToCreateLeave(){
        this.route.navigate(['master/ess/leave-apply-form'], { queryParams: { leave_ID: null, mode: 'addMode'} })
  }


  getEmployeeLeaveList(employee_id: any): void {
    this._commonService?.showLoader()
const allLeaves = true;

    this.LeaveApplyService.getAllAppliedLeavesById(this.financial_id,this.entity_id,employee_id, allLeaves).subscribe(
      (res: any) => {
        
        this.rowData = res.data;
        this._commonService?.hideLoader()
      },
      (err: any) => {
        console.error('Error fetching leave data', err);
        this._commonService?.hideLoader()
      }
    );
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


  }
  onBtPrint() {
    var api = this.gridApi;
    setPrinterFriendly(api);
    setTimeout(function () {
      print();
      setNormal(api);
    }, 2000);
  }

  onCellClicked(e: any) {

    // const dialogRef = this.dialog.open(LeaveDialogComponent, { width: '400px', data: { leaveApplyViewId: e.data.emp_leave_id } });
    // dialogRef.afterClosed().subscribe(result => {

    // })
  }









}
function setPrinterFriendly(api: any) {
  var eGridDiv = document.querySelector('#myGrid');

  api.setDomLayout('print');
}
function setNormal(api: any) {
  var eGridDiv = document.querySelector('#myGrid');

  api.setDomLayout(null);
}