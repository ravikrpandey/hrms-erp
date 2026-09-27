import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { MatDialog } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { ActionComponent } from '../employee/employee-list/action/action.component';
import { LeaveApplyActionComponent } from '../../leave-apply-action/leave-apply-action.component';
import { LeaveDialogComponent } from '../../leave-apply-create/leave-dialog/leave-dialog.component';
import moment from 'moment';
@Component({
  selector: 'app-leave-apply-list',
  templateUrl: './leave-apply-list.component.html',
  styleUrls: ['./leave-apply-list.component.scss']
})
export class LeaveApplyListComponent implements OnInit {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any;
  remaning: any;

  constructor(
    private empMaster: EmpMasterService,
    public dialog: MatDialog,) {
    this.rowClass = 'rowClass'
  }
  ngOnInit(): void {
    localStorage.setItem("employee_id:", "undefined");
    this.empMaster.applyLeaveList(localStorage.getItem('EmpMainId'),{}).subscribe((res: any) => {
      
      
      this.modifyData(res.data)
    })
  }

  modifyData(data:any){
    let modufyData:any = [];
    for(let i=0; i<data.length; i++){
      let val:any = {...data[i], 
        registered_user:data[i].registered_users[0]?.first_name,
        date:moment(data[i].toDate).format('DD-MM-YYYY')
        
      }
      delete val.registered_users
      modufyData.push(val);      
    }
    
    this.rowData = modufyData;
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
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Applier Name',
      field: 'applier_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Leave Name',
      field: 'leave_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Total Days',
      field: 'remaning_leave', sortable:
        true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
    },
    // {
    //   headerName: 'User Name',
    //   field: 'registered_user',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   flex:1,
    //   minWidth:150,
    // },
    {
      headerName: 'Leave Date',
      field: 'date',
    //   cellRenderer: (data:any) => {
    //     return moment(data.fromDate).format('DD/MM/YYYY HH:mm')
    // },
  //   valueFormatter: function (params:any) {
  //     return moment(params.value).format('DD-MM-YYYY');
  // },
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
    },

    {
      headerName: 'Leave Status',
      field: 'status',
       sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:150,
      // cellRenderer: (params: any) => params.value == 0 ? "Close" : "Active",
      // cellStyle: (params: any) => {
      //   if (params.value === 0) {
      //     return { color: 'red', fontSize: '16px' };
      //   }
      //   else{
      //     return { color: 'green', fontSize: '16px' };
      //   }
      //   return null;
      // }
      cellStyle: function (params: any) {
        if (params.value.toLowerCase() == 'APPROVE'.toLowerCase()) {
          return { color: 'green' };
        }else if (params.value.toLowerCase() == 'REJECT'.toLowerCase()) {
          return { color: 'red' };
        }else {
          return { color: 'blue' };
        }
      },
    },

    {
      headerName: 'Action',
      field: 'emp_leave_id',
      flex:1,
      minWidth:150,
      cellRenderer: LeaveApplyActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    }
  ];
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
    
    const dialogRef = this.dialog.open(LeaveDialogComponent, { width: '400px', data: { leaveApplyViewId: e.data.emp_leave_id } });
    dialogRef.afterClosed().subscribe(result => {
      
    })
  }
}
function setPrinterFriendly(api:any) {
  var eGridDiv = document.querySelector('#myGrid');
 
  api.setDomLayout('print');
}
function setNormal(api:any) {
  var eGridDiv = document.querySelector('#myGrid');
 
  api.setDomLayout(null);
}