import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
} from 'ag-grid-community';
import { SalesManagementService } from '../../sales-management-service/sales-management.service';
import { DeliveryActionComponent } from '../delivery-action/delivery-action.component';

@Component({
  selector: 'app-approved-delivery-order',
  templateUrl: './approved-delivery-order.component.html',
  styleUrls: ['./approved-delivery-order.component.scss'],
})
export class ApprovedDeliveryOrderComponent {
  rowClass: any;
  columnDefs: any;
  rowData: any = [];
  private gridApi!: GridApi<any>;
  role: string | null;
  mainEmpId: string | null;
  entityId: any;
  userRole: any;

  constructor(
    private route: Router,
    public mtdialog: MatDialog,
    private salesManagementService: SalesManagementService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    let token: any = localStorage.getItem('signInUser');
    this.userRole = JSON.parse(token);
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.updateColumnDefs();
    this.getApprovedOrderByMainId(this.mainEmpId);
  }

  getApprovedOrderByMainId(id: any) {
    this.salesManagementService
      .getDeliveryOrderByMainId(id,"APPROVED",this.entityId,this.userRole.role)
      .subscribe((res: any) => {
        this.rowData = res?.data;
        this.rowData = this.rowData.filter(
          (value: any, index: any, self: any) =>
            index ===
            self.findIndex(
              (t: any) => t.delivery_doc_code === value.delivery_doc_code
            )
        );
        return;
      });
  }

  navigateAddNew() {
    this.route.navigate([
      'master/sales-management/delivery-order/create-delivery-order',
    ]);
  }
  navigatePending() {
    this.route.navigate([
      'master/sales-management/delivery-order/pending-delivery-order',
    ]);
  }
  navigateApproved() {
    this.route.navigate([
      'master/sales-management/delivery-order/approved-delivery-order',
    ]);
  }
  navigateRejected() {
    this.route.navigate([
      'master/sales-management/delivery-order/rejected-delivery-order',
    ]);
  }
  navigateAllQuotations() {
    this.route.navigate(['master/sales-management/delivery-order']);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  private updateColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'No.',
        valueGetter: 'node.rowIndex + 1',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: 'Delivery Note ID',
        field: 'delivery_doc_code',
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
        field: 'customer_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: 'Status',
        field: 'approval_status',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: 'Source Warehouse',
        field: 'warehouse_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: 'Date',
        field: 'create_date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: { value: string | number | Date }) => {
          // Format the date using Angular's DatePipe
          return new Date(params.value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        },
      },
      {
        headerName: 'Invoice Number',
        field: 'ref_invoice_no',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: 'Action',
        field: 'id',
        flex: 1,
        minWidth: 150,
        cellRenderer: DeliveryActionComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
        },
      },
    ];
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    if (event.colDef.field === 'status' && event.oldValue !== event.newValue) {
    }
  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  addRecordToGrid(data: any) {
    if (!data || data.id == null) {
      return;
    }

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
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}
