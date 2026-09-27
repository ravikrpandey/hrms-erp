import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { InventoryManagementService } from '../inventory-management.service';
import { RecieveTransferActionComponent } from './recieve-transfer-action/recieve-transfer-action.component';

@Component({
  selector: 'app-receive-stock-transfer',
  templateUrl: './receive-stock-transfer.component.html',
  styleUrls: ['./receive-stock-transfer.component.scss']
})
export class ReceiveStockTransferComponent {
 entityId:any;
 employee_id:any;

  constructor(
    public mtdialog: MatDialog,
    private route: Router,
    private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private inventory_services:InventoryManagementService) { }

  ngOnInit() {
    this.entityId = localStorage.getItem("selectedEntityId");
    this.employee_id = localStorage.getItem("EmpMainId")
    this.getAllReceivedStockTransfer();
    this.updateColumnDefs();

  }
  rowClass: any;
  entity_id: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any;
  columnDefs: any

  private updateColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'S.No.',
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
        headerName: 'Stock Entry Type',
        field: 'stock_entry_type',
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
        field: 'transfer_status',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Source Warehouse',
        field: 'warehouse_source_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Target Warehouse',
        field: 'target_ware_house',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'ID',
        field: 'random_id',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Date',
        field: 'date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },

      {
        headerName: 'Action',
        field: 'countryss_name',
        flex: 1,
        minWidth: 150,
        cellRenderer: RecieveTransferActionComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,

        },
      }
    ];
  }


  openDialog() {
   this.route.navigate(['master/inventory-management/receive-stock-transfer/create-receive-stock-transfer'])
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  getAllReceivedStockTransfer() {

      this.inventory_services.getAllRecieveStockTransferNew(this.entityId,this.employee_id).subscribe(
        (res: any) => {
          this.rowData = res.data || [];
        },
        (error) => {
          this.rowData = [];
        }
      );
    }

}
