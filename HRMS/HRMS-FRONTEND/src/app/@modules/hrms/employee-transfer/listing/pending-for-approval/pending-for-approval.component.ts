import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { EmployeeTransferService } from 'src/app/@shared/services/employee-transfer.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ApprovalRejectedViewActionComponent } from '../approval-rejected-view-action/approval-rejected-view-action.component';

@Component({
  selector: 'app-pending-for-approval',
  templateUrl: './pending-for-approval.component.html',
  styleUrls: ['./pending-for-approval.component.scss'],
})
export class PendingForApprovalComponent {
  listData: any = [];
  rowData: any = [];
  approvalEmpId: any;
  rowClass: any;
  private gridApi!: GridApi<any>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private employeeTransfer: EmployeeTransferService
  ) {}

  ngOnInit() {
    this.approvalEmpId = localStorage.getItem('EmpMainId');
    this.getAllDataEmployeeTransfer();
  }

  getAllDataEmployeeTransfer() {
    this.employeeTransfer
      .getListpendingforApproval(this.approvalEmpId)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            this.listData = res.data;
            this.rowData = res.data;
            console.log('API Response:', res);
          } else {
            console.error('Invalid response format', res);
            this.rowData = [];
          }
        },
        (error) => {
          console.error('API Error:', error);
          this.rowData = [];
        }
      );
  }

  columnDefs: ColDef[] = [
    {
      headerName: 'S.No',
      valueGetter: (params: any) =>
        params.node ? params.node.rowIndex + 1 : '',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 200,
    },
    {
      headerName: 'Name',
      field: 'from_employee_full_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 200,
    },
    {
      headerName: 'Employee Code',
      field: 'from_employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 200,
    },
    {
      headerName: 'Entity Name',
      field: 'entity_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 250,
    },
    {
      headerName: 'Status',
      field: 'IsStatus',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 250,
    },
    {
      headerName: 'Action',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      minWidth: 240,
      cellRendererFramework: ApprovalRejectedViewActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
}
