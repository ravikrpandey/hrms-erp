import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { LwfActionComponent } from '../lwf-action/lwf-action.component';

@Component({
  selector: 'app-lwf-list',
  templateUrl: './lwf-list.component.html',
  styleUrls: ['./lwf-list.component.scss'],
})
export class LwfListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private payrollService: PayrollService,
    private toast: ToastrService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.getAllLwf();
  }

  getAllLwf() {
    this.payrollService.getAllLwf().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.rowData = res.data;
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'LWF ID',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'LWF State',
      field: 'state_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Action',
      field: 'employee_id',
      flex: 1,
      minWidth: 120,
      cellRenderer: LwfActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: 'grid-cell-centered',
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
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

  onCellClicked(e: any) {}
}
