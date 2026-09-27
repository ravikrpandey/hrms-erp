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
import { LeaveApplyService } from 'src/app/@shared/services/ess/leave-apply.service';
import { OvertimeRequestActionComponent } from '../overtime-request-action/overtime-request-action.component';
import { ALLOvertimeListActionComponent } from './all-overtime-list-action/all-overtime-list-action.component';

@Component({
  selector: 'app-all-overtime-list',
  templateUrl: './all-overtime-list.component.html',
  styleUrls: ['./all-overtime-list.component.scss'],
})
export class AllOvertimeListComponent {
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
    this.get_all_ot_req();
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
      headerName: 'Employee Code',
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
      headerName: 'Contact No.',
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
      cellRenderer: ALLOvertimeListActionComponent,
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

  get_all_ot_req() {
    let data = {
      entity_id: this.entity_id,
      employee_id: this.loginUser?.employee_id,
    };
    this.ess_service.get_all_ot_req(data).subscribe(
      (res: any) => {
        if (res) {
          this.rowData = res.data;
        }
      },
      (err: any) => {}
    );
  }
}
