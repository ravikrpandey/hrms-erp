import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent
} from 'ag-grid-community';


@Component({
  selector: 'app-pending-record-payment',
  templateUrl: './pending-record-payment.component.html',
  styleUrls: ['./pending-record-payment.component.scss']
})
export class PendingRecordPaymentComponent {
  rowClass: any;
  columnDefs: any;
  rowData: any = [];
  private gridApi!: GridApi<any>;

  constructor(
    private route: Router,
    public mtdialog: MatDialog
  ) {
    this.rowClass = 'rowClass';

    
  }
 
  ngOnInit(): void {
    this.updateColumnDefs();

  }


  navigateAddNew() {
    this.route.navigate(['master/sales-management/record-payments/create-record-payment'])
  }
  navigatePending() {
    this.route.navigate(['master/sales-management/record-payments/pending-record-payment'])
  }
  navigateApproved() {
    this.route.navigate(['master/sales-management/record-payments/approved-record-payment'])
  }
  navigateRejected() {
    this.route.navigate(['master/sales-management/record-payments/rejected-record-payment'])
  }
  navigateAllQuotations() {
    this.route.navigate(['master/sales-management/record-payments'])
  }
  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  private updateColumnDefs() {
    this.columnDefs = [
      {
        field: 'S.No',
        valueGetter: (params: any) => params.node.rowIndex + 1,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 85
      },
      {
        headerName: 'Payment Number',
        field: 'product_master.product_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: 'Customer',
        field: 'product_master.product_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'created_date',
        headerName: 'Date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 150
      },
      {
        headerName: 'Document Number',
        field: 'product_master.product_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'status',
        headerName: 'Status',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 150
      },
      {
        field: 'action',
        headerName: 'Action',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 150
      }
    ];
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    // Handle cell value changes if needed
    if (event.colDef.field === 'status' && event.oldValue !== event.newValue) {
          console.log('event  = ',event);
          
      // this.updateLeaveStatus(event.data);
    }

  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  addRecordToGrid(data: any) {
    if (!data || data.id == null) { return; }

    const api = this.gridApi;
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {
      return;
    }

    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter((document.getElementById('filter-text-box') as HTMLInputElement).value);
  }


}


