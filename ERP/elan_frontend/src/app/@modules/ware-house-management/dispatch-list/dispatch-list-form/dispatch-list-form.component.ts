import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ColumnApi, GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { DispatchListFormActionComponent } from './dispatch-list-form-action/dispatch-list-form-action.component';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';

@Component({
  selector: 'app-dispatch-list-form',
  templateUrl: './dispatch-list-form.component.html',
  styleUrls: ['./dispatch-list-form.component.css']
})
export class DispatchListFormComponent implements OnInit {
  rowClass: any;
  sales_order_no:any;
  sales_order_date:any;
  sales_order_by:any;
  // private gridApi!: GridApi<any>;
  // private gridColumnApi: ColumnApi;
  
  constructor(
    private router: Router,
    private $warehouseList: warehouseListService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit() {
  }

  // onGridReady(params: GridReadyEvent) {
  //   this.gridApi = params.api;
  //   // this.gridColumnApi = params.columnApi;
  // }

  rowData = [
    {product_code: 7, product_name: 'Block1', product_variant: '', opening_stock: 12,sales_order_quantity:12 }
  ]

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
      headerName: 'Product Code',
      field: 'product_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Product Name',
      field: 'product_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Product Variant',
      field: 'product_variant',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Opening Stock',
      field: 'opening_stock',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Sales Order Quantity',
      field: 'sales_order_quantity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      // cellRenderer: SalesOrderActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
    {
      headerName: 'Action',
      field: 'undecided',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: DispatchListFormActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    }
  ];

}
