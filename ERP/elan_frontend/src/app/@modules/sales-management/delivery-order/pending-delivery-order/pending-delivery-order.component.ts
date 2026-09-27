import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent
} from 'ag-grid-community';
import { SalesManagementService } from '../../sales-management-service/sales-management.service';
import { ToastrService } from 'ngx-toastr';
import { DeliveryActionComponent } from '../delivery-action/delivery-action.component';
import { DeliveryStatusComponent } from '../delivery-status/delivery-status.component';


@Component({
  selector: 'app-pending-delivery-order',
  templateUrl: './pending-delivery-order.component.html',
  styleUrls: ['./pending-delivery-order.component.scss']
})
export class PendingDeliveryOrderComponent {
  rowClass: any;
  columnDefs: any;
  rowData: any = [];
  private gridApi!: GridApi<any>;
  mainDepId: string | null;
  entityId: string | null;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private salesManagementService: SalesManagementService,
    private toast: ToastrService,


  ) {
    this.rowClass = 'rowClass';


  }

  ngOnInit(): void {
    this.mainDepId = localStorage.getItem('EmpMainId')
    this.entityId = localStorage.getItem('selectedEntityId');
    this.updateColumnDefs();
    this.getPendingDeliveryByDepID(this.mainDepId)


  }


  navigateAddNew() {
    this.route.navigate(['master/sales-management/delivery-order/create-delivery-order'])
  }
  navigatePending() {
    this.route.navigate(['master/sales-management/delivery-order/pending-delivery-order'])
  }
  navigateApproved() {
    this.route.navigate(['master/sales-management/delivery-order/approved-delivery-order'])
  }
  navigateRejected() {
    this.route.navigate(['master/sales-management/delivery-order/rejected-delivery-order'])
  }
  navigateAllQuotations() {
    this.route.navigate(['master/sales-management/delivery-order'])
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  getPendingDeliveryByDepID(id: any) {
    this.salesManagementService.getDeliveryOrderByMainId(id,"PENDING",this.entityId).subscribe((res: any) => {
      this.rowData = res?.data.reverse();
      });
    }
  private updateColumnDefs() {
    this.columnDefs =[
      {
        headerName: 'No.',
        valueGetter: "node.rowIndex + 1",
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
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
        field: 'status',
        headerName: 'Status',
        editable: false,
        cellEditor: 'agSelectCellEditor',
        // cellEditorParams: {
        //   values: ['PENDING','APPROVED', 'REJECTED'],
        // },

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
        valueFormatter: (params: { value: string | number | Date; }) => {
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
          showCustomIcon: false
        },
      }
    ];
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  // updateDeliveryByDepId(id: any,del_id:any, status: string) {
  //   this.salesManagementService.updateDeliveryByDepId(id,del_id, status).subscribe((res: any) => {
  //     this.toast.success('Status updated sucessfully');
  //     this.reloadCurrentRoute()
  //   });
  // }
  // onCellValueChanged(event: CellValueChangedEvent) {
  //   if (event.colDef.field === 'status' && event.oldValue !== event.newValue) {
  //     const newValue = event.newValue;
  //     if (newValue === 'APPROVED' || newValue === 'REJECTED') {
  //     this.updateDeliveryByDepId(this.mainDepId,event.data.delivery_doc_code, event.newValue);
  //     }
  //   }
  // }

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

  statusCellClicked(event: any) {

    const clickedRowData = event.data;
    const clickedColumn = event.column.getColId();
    const clickedValue = event.value;


        if (clickedRowData) {

          const dialogRef = this.dialog.open(DeliveryStatusComponent,
            { width: '450px',
              data: { cellData: clickedRowData,status:"Update",
            } });

            dialogRef.afterClosed().subscribe((result) => {

              if (result) {
                console.log('Dialog closed with result:', result);
              } else {
                console.log('Dialog was closed without result');
              }
            });
          }


      }
}


