import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { MatDialog } from '@angular/material/dialog';
import { LeaveApplyActionComponent } from '../leave-apply-action/leave-apply-action.component';
import { LeaveApplyService } from 'src/app/@shared/services/ess/leave-apply.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';



@Component({
  selector: 'app-leave-apply-list',
  templateUrl: './leave-apply-list.component.html',
  styleUrls: ['./leave-apply-list.component.scss']
})
export class LeaveApplyListComponent implements OnInit {

  rowClass: any;
  private gridApi!: GridApi<any>;
  count: any;
  remaning: any;
  public employeeId: string | null;
  rowData: any;
  financial_id: any;
  entity_id: any;
  role_id: string | null;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55};




  constructor(
    private route: Router,
    private LeaveApplyService: LeaveApplyService,
    private _commonService: CommonService,
    private shortcutService: ShortcutService,
    public dialog: MatDialog,) {
    this.rowClass = 'rowClass'
  }



  ngOnInit(): void {
    // Retrieve the stored JSON string from localStorage
    const signInUser = localStorage.getItem('signInUser');
    this.financial_id = localStorage.getItem('financial_id');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.role_id = localStorage.getItem('role_master_id');

    if (signInUser) {
      const userObject = JSON.parse(signInUser);
      this.employeeId = userObject.employee_id;
      this.getEmployeeLeaveList(this.employeeId)

    } else {
      console.error("No signInUser found in localStorage");
    }
    this.shortcutService.registerShortcut('a', () => {
      this.routeToCreateLeave()
    });

  }


  public columnDefs = [
    {
      headerName: 'S.NO',
      field: 'i',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueGetter: 'node.rowIndex+1',
      flex: 1,
      minWidth: 100,
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
      valueGetter: (params: any) => `${params.data.HRMS_REGISTERED_USER.first_name} ${params.data.HRMS_REGISTERED_USER.last_name}`,
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
      valueGetter: (params: any) => moment(params.data.start_date).format('DD-MM-YYYY'),
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
      valueGetter: (params: any) => moment(params.data.end_date).format('DD-MM-YYYY'),
    },
    {
      headerName: 'Approval',
      field: 'approval_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Status',
      field: 'approval_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Action',
      cellRenderer: LeaveApplyActionComponent,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 150,
    }
  ];



  routeToCreateLeave() {
    this.route.navigate(['master/ess/leave-apply-form'], { queryParams: { leave_ID: null, mode: 'addMode' } })
  }


  getEmployeeLeaveList(employee_id: any): void {
    this._commonService?.showLoader()
    const allLeaves = false;
    
    this.LeaveApplyService.getAllAppliedLeavesById(this.financial_id, this.entity_id, employee_id, allLeaves).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.rowData?.map((item: any) => {
          item.approval_name = item?.approval_details?.first_name + ' ' + item?.approval_details?.last_name;
        })
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
      (document.getElementById('filter-text-box1') as HTMLInputElement).value
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
    
  }

  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
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