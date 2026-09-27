import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { CompServiceService } from 'src/app/@shared/services/comp-service.service';


@Component({
  selector: 'app-cancelled-leave',
  templateUrl: './cancelled-leave.html',
  styleUrls: ['./cancelled-leave.scss']
})
export class CancelledLeave {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  entity_Id: any;
  loginUser: any;
  workflowcheck: boolean;
  financial_id: any;
  employeedata: any;
  filterEmployeedata: any[];
  isAllSelect: any;
  compForm: any;

  constructor(
    private travel_service: TravelRequestService,
    private comservice: CompServiceService,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private router: Router
  ) {

    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.localStorage()
  }

  localStorage() {
    let employeeId: any = localStorage.getItem('EmpMainId');
    let entity: any = localStorage.getItem('selectedEntityId');
    let financialid: any = localStorage.getItem('financial_id');
    this.entity_Id = JSON.parse(entity);
    this.financial_id = JSON.parse(financialid);
    this.getEmployeeLeaveData(employeeId, financialid);
  }

  allemployee: any = [];


  public columnDefs: any = [
  {
    headerName: 'S.No',
    // headerCheckboxSelection: true,
    // checkboxSelection: true,
    valueGetter: "node.rowIndex + 1",
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 100
  },
  {
    headerName: 'Employee Code',
    field: 'travel_request_number',
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150
  },
  {
    headerName: 'Employee Name',
    field: 'travel_name',
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150
  },
  {
    headerName: 'Leave name',
    field: 'leave_names',
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150
  },
  {
    headerName: 'Leave Date',
    field: 'travel_to_date',
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150
  },
];




  formatDate(dateString: any) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = String(date.getFullYear()).slice(-2); 
    return `${day}/${month}/${year}`;
  }

getEmployeeLeaveData(employeeId: string, financialYearId: string) {
  this.travel_service.getEmployeeLeavesData(employeeId, financialYearId).subscribe({
    next: (res: any) => {
      if (res && res.data) {
        const leaveData = res.data; // Main leave records
        const daysDetails = res.daysDetails || []; // Day-wise leave details

        this.rowData = [];

        daysDetails.forEach((day: any) => {
          // Match apply_leave_id with main leave record
          const matchingLeave = leaveData.find((leave: any) => leave.id === day.apply_leave_id);

          if (matchingLeave) {
            const user = matchingLeave.HRMS_REGISTERED_USER || {};
            const leaveMaster = matchingLeave.HRMS_LEAVE_MASTER || {};

            this.rowData.push({
              travel_request_number: user.employee_code || '',
              travel_name: `${user.first_name || ''} ${user.last_name || ''}`,
              leave_names: leaveMaster.leave_name || '',
              travel_to_date: this.formatDate(day.leave_date),
              leave_date_raw: new Date(day.leave_date),
              originalData: {
                ...matchingLeave,
                leave_date: day.leave_date, 
                dayDetailId: day.id, 
              }
            });
          }
        });

        this.workflowcheck = false;
      }
    },
    error: (err) => {
      console.error("Error fetching leave data", err);
      this.toaster.error('Failed to fetch employee leave details.');
    }
  });
}
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  } 

}
