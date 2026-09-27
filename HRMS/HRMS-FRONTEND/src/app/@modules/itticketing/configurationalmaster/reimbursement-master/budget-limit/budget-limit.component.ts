import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
// import { GradeActionComponent } from '../travel-grade/grade-action/grade-action.component';
import { BudgetActionComponent } from './budget-action/budget-action.component';

@Component({
  selector: 'app-budget-limit',
  templateUrl: './budget-limit.component.html',
  styleUrls: ['./budget-limit.component.scss'],
})
export class BudgetLimitComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple' };
  selectedRows: any[] = [];
  isDeleteButtonVisible: boolean = false;

  public columnDefs: ColDef[] = [
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
      headerName: 'Travel Type',
      field: 'travelType.name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Budget Limit',
      field: 'budget_limit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params) => {
        return params.data.local_max_limit ? params.data.local_max_limit : params.value;
      },
    },
    // {
    //   headerName: 'DA',
    //   field: 'daily_allowance',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    // },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: BudgetActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  constructor(
    private router: Router,
    private service: ConfigurationalmasterService
  ) {
    this.getData();
  }

  getData() {
    this.service.getAllTravelBudget().subscribe((data: any) => {
      this.rowData = data.data;
    });
  }

  add(type: string): void {
    this.router.navigate(
    [
      'master/configurational-master/reimbursement-master/create-budget-limit',
    ])
  }

  onGridReady(params: GridReadyEvent) {
    // this.gridApi = params.api;
    // this.gridApi.addEventListener(
    //   'selectionChanged',
    //   this.onSelectionChanged.bind(this)
    // );
  }

  onSelectionChanged(event: any) {
    this.selectedRows = event.api.getSelectedRows();
    this.isDeleteButtonVisible = this.selectedRows.length > 0;
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
}
