import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { EmployeSelfService } from 'src/app/@shared/services/employe-self.service';
import { OvertimeRequestActionComponent } from '../overtime-request-action/overtime-request-action.component';

@Component({
  selector: 'app-overtime-reject',
  templateUrl: './overtime-reject.component.html',
  styleUrls: ['./overtime-reject.component.scss'],
})
export class OvertimeRejectComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  loginUser: any;
  entity_id: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private ess_service: EmployeSelfService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.get_ot_requests_by_status();
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex+1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Employee Cdde',
      field: 'employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Employee Name',
      field: 'employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Email Id',
      field: 'employee_official_email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Contact Number',
      field: 'contact_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },

    {
      headerName: 'Status',
      field: 'approval_status',
      cellRenderer: '',
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: 'grid-cell-centered',
      minWidth: 150,
    },
    {
      headerName: 'Created By',
      field: 'created_by_name',
      cellRenderer: '',
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: 'grid-cell-centered',
      minWidth: 150,
    },
    {
      headerName: 'Action',
      field: 'request_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: OvertimeRequestActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  agInit(params: ICellRendererParams): void {}

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

  get_ot_requests_by_status() {
    let data = {
      entity_id: this.entity_id,
      employee_id: this.loginUser?.employee_id,
      status: 'REJECTED',
    };
    this.ess_service.get_ot_requests_by_status(data).subscribe(
      (res: any) => {
        if (res) {
          this.rowData = res.data;
        }
      },
      (err: any) => {}
    );
  }
}
