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
  selector: 'app-leave-cancellation-list',
  templateUrl: './leave-cancellation-list.html',
  styleUrls: ['./leave-cancellation-list.scss']
})
export class LeaveCancellationList {
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
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    let financialid: any = localStorage.getItem('financial_id');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
    this.financial_id = JSON.parse(financialid);
    this.getEmployeeBasedOnEntity();
  }
  getEmployeeBasedOnEntity() {
    const primary_entity_id = localStorage.getItem('selectedEntityId');
    this.comservice
      .getEmployeeBasedOnEntity(primary_entity_id)
      .subscribe((res: any) => {
        this.employeedata = res.data;
        this.filterEmployeedata = [...this.employeedata];
      });
  }
  allemployee: any = [];
  selectAllEmployee(event: any) {
    this.isAllSelect = event.checked;
    if (this.isAllSelect) {
      const allEmployeeIds = this.employeedata.map(
        (emp: any) => emp.employee_id
      );
      this.allemployee.push(allEmployeeIds)
      console.log("--->", this.allemployee);

    }
  }

  public columnDefs: any = [
  {
    headerName: 'S.No',
    headerCheckboxSelection: true,
    checkboxSelection: true,
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

onEmployeeSelected(event: any) {
  const selectedEmployee = event.value;
  const employeeId = selectedEmployee.employee_id;

  // Clear previous data
  this.rowData = [];

  // Deselect any selected rows in the grid
  if (this.gridApi) {
    this.gridApi.deselectAll();
  }

  // Fetch new employee's leave data
  if (employeeId && this.financial_id) {
    this.getEmployeeLeaveData(employeeId, this.financial_id);
  }
}

getEmployeeLeaveData(employeeId: string, financialYearId: string) {
  this.travel_service.getEmployeeLeave(employeeId, financialYearId).subscribe({
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

cancelRequest() {
  if (this.gridApi) {
    const selectedRows = this.gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      this.toaster.error('Please select at least one row to proceed with cancellation.');
      return;
    }

    const payload: any[] = [];

    selectedRows.forEach((row: any) => {
      const original = row.originalData;

      const selectedDate = new Date(row.leave_date_raw);
      const formattedDate = selectedDate.toISOString().split('T')[0]; 

      payload.push({
        employee_id: original.employee_id,
        leaveId: original.leaveId,
        financial_year_id: original.financial_year_id,
        start_date: formattedDate,
        end_date: formattedDate
      });
    });

    this.travel_service.cancel_leave_request(payload).subscribe(
      (res: any) => {
        
        if (res.message) {
          this.toaster.success("Selected Leave Cancelled Successfully!");
          this.router.navigate(['/master/hrms/leave-cancellation']);

        }
      },
      (err: any) => {
        this.toaster.error(err.error.message);
      }
    );
  } else {
    this.toaster.error('Grid is not ready. Please try again.');
  }
}




  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

}
