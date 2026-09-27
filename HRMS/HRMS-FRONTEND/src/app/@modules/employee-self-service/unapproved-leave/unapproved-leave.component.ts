import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { Router } from '@angular/router';
import { ActionForUnaprovedLeaveComponent } from './action/action.component';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { MatDialog } from '@angular/material/dialog';
import { LeaveDetailsPopupComponent } from './leave-details-popup/leave-details-popup.component';
import { Location } from '@angular/common';
import { LeaveDialogComponent } from '../leave-apply-create/leave-dialog/leave-dialog.component';
import moment from 'moment';

@Component({
  selector: 'app-unapproved-leave',
  templateUrl: './unapproved-leave.component.html',
  styleUrls: ['./unapproved-leave.component.scss']
})
export class UnapprovedLeaveComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;

  constructor(private route: Router,
    private empService: EmpMasterService,
    private _hrService: HrServiceService
    , public dialog: MatDialog,
    private location: Location
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    let loginUser = JSON.parse(lg);
    // this.getAll_AppliedLeaveBy_Manager(loginUser.employee_id);
    this.getall_leaves_tobe_Approved();

  }
  goBack() {
    this.location.back();
  }

  public columnDefs = [
    {
      headerName: 'Sr No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Employee Name',
      field: 'full_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    // {
    //   headerName: 'Leave Type',
    //   field: 'leave_type',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 150,
    // },
    {
      headerName: 'From Date',
      field: 'start_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      valueFormatter: function (params: any) {
        return params.value ? moment(params.value).format('DD-MM-YYYY') : '';
      }
    },

    {
      headerName: 'To Date',
      field: 'end_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      valueFormatter: function (params: any) {
        return params.value ? moment(params.value).format('DD-MM-YYYY') : '';
      }
    },
    {
      headerName: 'Total Leave Days',
      field: 'leave_days', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Leave Status',
      field: 'approval_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      cellStyle: function (params: any) {
        if (params.value.toLowerCase() == 'ACTIVE'.toLowerCase()) {
          return { color: 'orange' };
        };
      },
    },
    {
      headerName: 'Action',
      field: 'leave_apply_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionForUnaprovedLeaveComponent,
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
    const entity_id = localStorage.getItem('selectedEntityId');
    const employee_id = localStorage.getItem('EmpMainId');

    let query = {
      entity_id: entity_id,
      employee_id: employee_id,
      approval_status: "PENDING ,PENDING FROM APPROVAL END"
    }

    this.empService.getall_leaves_tobe_Approved(query).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.rowData?.map((item: any) => {
          let userDetail = item?.HRMS_REGISTERED_USER;
          item.full_name = userDetail?.first_name + ' ' + userDetail?.last_name;
        })
        console.log(this.rowData);
      },
      (err: any) => {
        console.error('Error fetching leaves to be approved:', err);
      }
    );
  }

  // onCellClicked(e: any) {

  //   const dialogRef = this.dialog.open(LeaveDetailsPopupComponent, { width: '400px', data:e.data});
  //   dialogRef.afterClosed().subscribe(result => {

  //     if(result === 'done'){
  //       this.reloadCurrentRoute();
  //     }
  //   })
  // }

  onCellClicked(e: any) {
    // console.log("e data is ", e.data)
    // const dialogRef = this.dialog.open(LeaveDialogComponent, { width: '400px', data: { leaveApplyViewId: e.data.emp_leave_id } });
    // dialogRef.afterClosed().subscribe(result => {

    // })
  }
}
