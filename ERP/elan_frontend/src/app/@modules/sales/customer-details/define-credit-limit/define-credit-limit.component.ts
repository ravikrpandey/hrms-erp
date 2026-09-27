import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CustomerActionComponent } from '../../customer-list/customer-action/customer-action.component';
import { SalesService } from '../../service/sales.service';
import { DefineCreditLimitActionComponent } from './define-credit-limit-action/define-credit-limit-action.component';

@Component({
  selector: 'app-define-credit-limit',
  templateUrl: './define-credit-limit.component.html',
  styleUrls: ['./define-credit-limit.component.scss'],
})
export class DefineCreditLimitComponent {
  private gridApi!: GridApi<any>;
  private gridColumnApi!: ColumnApi;

  rowData: any[] = [];
  totalDebit: number = 0.0;
  totalCredit: number = 0.0;
  rowClass: any;

  // Grid Options
  public gridOptions: GridOptions = {
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    animateRows: true,
    defaultColDef: {
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
  };

  // Column Definitions
  public columnDefs: ColDef[] = [
    {
      headerName: 'Company Name',
      field: 'name',
      minWidth: 300,
    },
    {
      headerName: 'Company Code',
      field: 'customer_code',
      minWidth: 250,
    },
    // {
    //   headerName: 'Available Credit Limit',
    //   field: 'customer_code',
    //   minWidth: 250,
    // },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: DefineCreditLimitActionComponent,
      minWidth: 150,
      pinned: 'right',
    },
  ];

  // Grouping / Tree Data (if required)
  public autoGroupColumnDef: ColDef = {
    headerName: 'Company Name',
    field: 'name',
    minWidth: 300,
    cellRendererParams: {
      suppressCount: true,
    },
  };

  constructor(private salesService: SalesService) {
    this.prepareData();
  }

  getDataPath = (data: any) => data.hierachy;

  private calculateTotals(): void {
    this.totalDebit = this.rowData.reduce(
      (sum, row) => sum + (row.debit || 0),
      0
    );
    this.totalCredit = this.rowData.reduce(
      (sum, row) => sum + (row.credit || 0),
      0
    );
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

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  private prepareData() {
    const entity_id = localStorage.getItem('selectedEntityId');
    this.salesService.getCustomerTreeView(entity_id).subscribe(
      (response: any) => {
        if (response) {
          this.categoryData = response.costCenterHierarchyView;
          this.rowData = flattenChildrenRecursively(this.categoryData);
        }
      },
      (err: any) => {
        // this.toast.error(err.error.message);
      }
    );
  }

  categoryData: any = [];

  addChildToSubcategory(
    parentid: number,
    newChild: { id: number; name: string }
  ) {
    const findAndAddChild = (data: any) => {
      for (const item of data) {
        if (item.id === parentid) {
          item.children = item.children || [];
          item.children.push(newChild);
          return true; // Child added
        }
        if (item.children && findAndAddChild(item.children)) {
          return true; // Child added in a nested category
        }
      }
      return false; // Not found
    };

    findAndAddChild(this.categoryData);
    this.prepareData(); // Refresh the grid data
  }
}

const flattenChildrenRecursively = (
  data: any,
  parent = null,
  childHierachy: any = null
) => {
  let newData: any = [];

  if (data) {
    data.forEach((initialRow: any) => {
      let parentHierachy: any = [];
      initialRow.hierachy = parentHierachy;

      if (parent) {
        initialRow.parent = parent;
        parentHierachy = [...childHierachy];
        initialRow.hierachy = parentHierachy;
      }
      parentHierachy.push(initialRow.name);

      newData.push(initialRow);

      if (initialRow.children) {
        newData = [
          ...newData,
          ...flattenChildrenRecursively(
            initialRow.children,
            initialRow,
            parentHierachy
          ),
        ];
      }
    });
  }

  return newData;
};
