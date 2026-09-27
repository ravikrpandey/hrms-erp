import { Component,OnInit } from '@angular/core';
import {
  GridApi,
  GridReadyEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { Router } from '@angular/router';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';

import { Location } from '@angular/common';
import { CommonService } from 'src/app/@shared/services/common.service';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { ToastrService } from 'ngx-toastr';
import { ActionComponent } from '../../complaint/action/action.component';
import { ActionAttendanceApprovalComponent } from '../action-attendance-approval/action-attendance-approval';

@Component({
  selector: 'app-attendance-approval-status',
  templateUrl: './attendance-approval-status.html',
  styleUrls: ['./attendance-approval-status.scss'],
})
export class AttendanceApprovalStatus {
  activeTab: string = 'pending';
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  filteredData: any[] = []; 
  constructor(private route: Router,
    private services: AttendanceService,
    private _commonService : CommonService,
    private toast:ToastrService,
    private _hrService: HrServiceService
    , public dialog: MatDialog,
    private location: Location,
  ) {
    this.rowClass = 'rowClass'
  }
loginUser:any
  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
     this.loginUser = JSON.parse(lg);
    this.Attendanceby_reportingmanager();

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
    headerName: 'Month',
    field: 'attendance_month',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: "grid-cell-centered",
    flex: 1,
    minWidth: 100,
  },

  {
    headerName: 'Status',
    field: 'status',
    cellClass: "grid-cell-centered",
    sortable: true,
    resizable: true,
    flex: 1,
    minWidth: 120,

  },
{
  headerName: 'Approval Status',
  field: 'approval_status',
  cellClass: "grid-cell-centered",
  sortable: true,
  resizable: true,
  flex: 1,
  minWidth: 150,
  // display text in uppercase
  valueFormatter: (params: any) => (params.value ? String(params.value).toUpperCase() : ''),
  cellStyle: (params: any) => {
    const val = (params.value || '').toLowerCase();
    if (val === 'pending') return { color: 'orange', fontWeight: '600' };
    if (val === 'approved') return { color: 'green', fontWeight: '600' };
    if (val === 'rejected') return { color: 'red', fontWeight: '600' };
   
    return {};
  },
},

  {
  headerName: 'Action',
  field: '',
  cellClass: "grid-cell-centered",
  sortable: true,
  resizable: true,
  flex: 1,
  minWidth: 150,
  cellRendererFramework: ActionAttendanceApprovalComponent,

}

];

updateStatus(id: number, status: 'approved' | 'rejected' | 'backed') {
  const payload = { id, approval_status: status };

  this.services.updateAttendancestatus(payload).subscribe({
    next: (res: any) => {
      // Update the local data model
      const row = (this.rowData || []).find((r: any) => r.id === id);
      if (row) {
        row.approval_status = status;
      }

      // Set the active tab to the new status so UI switches there
      this.activeTab = status;

      // Re-filter grid (will show rows matching new tab)
      this.filterData();

      // Optional: refresh grid view (if you keep reference to gridApi)
      if (this.gridApi) {
        this.gridApi.refreshClientSideRowModel('everything');
      }

      this.toast.success('Status updated successfully'); // optional
    },
    error: (err) => {
      console.error('Error updating status:', err);
      this.toast.error('Failed to update status'); // optional
    },
  });
}

  goToHolidayCreate(path: any) {
    this.route.navigate([path]);
  }


  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  Attendanceby_reportingmanager() {

  let manager_id= {
    manager_id:this.loginUser?.employee_id
  }

    this.services.get_attendance_request_by_manager(manager_id).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.filteredData = res.data
        console.log(this.filteredData);
this.filterData()
      },
      (err: any) => {
        console.error('Error fetching leaves to be approved:', err);

      }
    );
  }



  onCellClicked(e: any) {
 
  }

changeTab(tab: string) {
  this.activeTab = tab;
  this.filterData();
}

filterData() {
  if (!this.rowData || !Array.isArray(this.rowData)) {
    this.filteredData = [];
    return;
  }

  const tab = (this.activeTab || '').toString().toLowerCase();

  if (!tab || tab === 'all') {
    this.filteredData = [...this.rowData];
    return;
  }

  this.filteredData = this.rowData.filter((r: any) => ((r.approval_status || '').toString().toLowerCase()) === tab);
}


  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }
}
