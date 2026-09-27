import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CompServiceService } from 'src/app/@shared/services/comp-service.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';

@Component({
  selector: 'app-leave-cancellation-all',
  templateUrl: './leave-cancellation-all.html',
  styleUrls: ['./leave-cancellation-all.scss']
})
export class LeaveCancellationAll {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any[] = [];
  entity_Id: any;
  financial_id: any;
  workflowcheck: boolean = false;

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
    this.localStorage();
  }

  localStorage() {
    let entity: any = localStorage.getItem('selectedEntityId');
    let financialid: any = localStorage.getItem('financial_id');
    this.entity_Id = JSON.parse(entity);
    this.financial_id = JSON.parse(financialid);
    this.getAllEmployeeLeaveData(this.entity_Id, this.financial_id);
  }

  public columnDefs: any = [
    {
      headerName: 'S.No',
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100
    },
    {
      headerName: 'Employee Code',
      field: 'employee_code',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Employee Name',
      field: 'employee_name',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Leave Type',
      field: 'leave_type',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Leave Date',
      field: 'leave_date',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    }
  ];

  formatDate(dateString: any): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  cancelRequest() {
    this.router.navigate(['master/hrms/leave-cancellation/leave-cancellation-list']);
  }

  getAllEmployeeLeaveData(entity_id: string, financialYearId: string) {
    this.travel_service.getAllEmployeeCancelLeaveData(entity_id, financialYearId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.rowData = res.data.map((entry: any) => ({
            employee_code: entry.employee_code || '',
            employee_name: `${entry.first_name || ''} ${entry.last_name || ''}`.trim(),
            leave_type: entry.leave_type || '',
            leave_date: this.formatDate(entry.leave_date),
            originalData: entry
          }));
          this.workflowcheck = false;
        }
      },
      error: (err) => {
        console.error('Error fetching leave data', err);
        this.toaster.error('Failed to fetch employee leave details.');
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
