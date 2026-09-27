
import { Component, OnInit } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MatDialog } from '@angular/material/dialog';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Router } from '@angular/router';
import { ActionComponent } from '../../complaint/action/action.component';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import moment from 'moment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-attendance-request-list',

  templateUrl: './attendance-request-list.html',
  styleUrls: ['./attendance-request-list.scss'],
})
export class AttendanceRequestList {

  pageSize = 10; 
    rowClassRules = {};
  rowClass: any;
  employeeId: any;
  private gridApi!: GridApi<any>;
  rowData: any;

  constructor(
    private route: Router,
    private services: AttendanceService,
    private _commonService : CommonService,
    private _hrService: HrServiceService,
    public dialog: MatDialog,
    private location: Location,
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.employeeId=localStorage.getItem('EmpMainId')
    let loginUser = JSON.parse(lg);
    this.getall_leaves_tobe_Approved();

  }
  goBack() {
    this.location.back();
  }

public columnDefs:any = [
  {
    headerName: 'Sr No.',
    valueGetter: "node.rowIndex + 1",
    cellClass: "grid-cell-centered",
    sortable: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  },
 {
    headerName: 'Employee Name',
    valueGetter: (params: any) => {
      const emp = params.data.employee;
      return emp ? `${emp.first_name} ${emp.last_name}` : '';
    },
    cellClass: "grid-cell-centered",
    sortable: true,
    resizable: true,
    flex: 1,
    minWidth: 150,
  },
  {
    headerName: 'Selected Date',
    field: 'selected_date',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: "grid-cell-centered",
    flex: 1,
    minWidth: 150,
    valueFormatter: (params: any) =>
      params.value ? moment(params.value).format('DD-MM-YYYY') : '',
  },


  {
    headerName: 'Status',
    field: 'status',
    cellClass: "grid-cell-centered",
    sortable: true,
    resizable: true,
    flex: 1,
    minWidth: 120,
    cellStyle: (params: any) => {
      if (params.value?.toLowerCase() === 'active') {
        return { color: 'green', fontWeight: '600' };
      } else {
        return { color: 'red', fontWeight: '600' };
      }
    },
  },
  {
    headerName: 'Approval Status',
    field: 'approval_status',
    cellClass: "grid-cell-centered",
    sortable: true,
    resizable: true,
    flex: 1,
    minWidth: 150,
    cellStyle: (params: any) => {
      const val = params.value?.toLowerCase();
      if (val === 'pending') return { color: 'orange', fontWeight: '600' };
      if (val === 'approved') return { color: 'green', fontWeight: '600' };
      if (val === 'rejected') return { color: 'red', fontWeight: '600' };
      return {};
    },
  },
];

  goToHolidayCreate(path: any) {
    this.route.navigate([path]);
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;


  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  getall_leaves_tobe_Approved() {
    this.services.attendance_request_by_id(this.employeeId).subscribe(
      (res: any) => {
        this.rowData = res.data;
        console.log(this.rowData);

      },
      (err: any) => {
        console.error('Error fetching leaves to be approved:', err);

      }
    );
  }



  onCellClicked(e: any) {
 
  }



  goToList() {

  this.route.navigateByUrl('/master/ess/attendance-request/attendance-request-form');

}
  onPageSizeChanged(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value) || 10;
    this.pageSize = value;
    // if ag-grid API available you can call paginationSetPageSize
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(this.pageSize);
    }
  }

 onFilterTextBoxChanged(event: any) {
    const filter = (event.target as HTMLInputElement).value;
    // if using ag-grid api:
    if (this.gridApi) {
      this.gridApi.setQuickFilter(filter);
    }
  }
}






