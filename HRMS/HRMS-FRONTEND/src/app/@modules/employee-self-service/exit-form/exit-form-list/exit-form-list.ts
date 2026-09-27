import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ExitFormService } from '../exit-form-service';
import { ExitFormActionsComponent } from '../exit-form-actions/exit-form-actions.component';

@Component({
  selector: 'app-exit-form-list',
  templateUrl: './exit-form-list.html',
  styleUrls: ['./exit-form-list.scss'],
})
export class ExitFormList {
  private gridApi!: GridApi<any>;
  rowData: any;
  rowClass: any;
  assignAction: any;
  staticData: any;
  employee_id: any;
  entity_id: number;
  financial_id: number;

  constructor(
    private exitFormService: ExitFormService,
    private route: Router,
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.entity_id = Number(localStorage.getItem('selectedEntityId'));
    this.financial_id = Number(localStorage.getItem('financial_id'));
    this.employee_id = localStorage.getItem('EmpMainId');
    this.getExitFormByEmpId();
  }

  getExitFormByEmpId = () => {
    this.exitFormService.getExitFormByEmpId(this.employee_id).subscribe(
      (params: any) => {
        this.rowData = params.data;
      },
      (err: any) => {
        this.rowData = [];
      }
    );
  };

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex + 1',
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
      field: 'full_name',
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
      headerName: 'Exit Form Code ',
      field: 'exit_form_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Status',
      field: 'approval_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 150,
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ExitFormActionsComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];

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
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  onCellClicked(e: any) {}
}
