
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { InventoryManagementService } from '../inventory-management.service';
import { CellRendererComponent } from 'ag-grid-community/dist/lib/components/framework/componentTypes';
import { AddActionComponent } from './add-action/add-action.component';
import * as moment from 'moment';

@Component({
  selector: 'app-stock-transfer-new',
  templateUrl: './stock-transfer-new.component.html',
  styleUrls: ['./stock-transfer-new.component.scss']
})
export class StockTransferNewComponent {
  entityId:any;

  constructor(
    public mtdialog: MatDialog, 
    private route: Router,
    private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private inventory_services:InventoryManagementService) { }

  ngOnInit() {
    this.entityId = localStorage.getItem("selectedEntityId");
    this.employee_id = localStorage.getItem("EmpMainId")
    this.getAllStockTransfer();
    this.updateColumnDefs();
    
  }
  rowClass: any;
  entity_id: any;
  employee_id: any;
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
        headerName: 'Date',
        field: 'date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 180,
        valueFormatter: (params:any) => {
      
          return  moment(params.value).format('DD-MM-YYYY, h:mm:ss A')
        },
      },
      {
        headerName: 'Action',
        field: 'id',
        flex: 1,
        minWidth: 150,
        cellRenderer: AddActionComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: true,
          hideDownloadIcon: true,
          showCustomIcon: true, // Hide attachment icon
         
        },
      },
    ];
  }
 

  openDialog() {
   this.route.navigate(['master/inventory-management/stock-transfer/create-stock-transfer'])
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

  getAllStockTransfer() {
    this.inventory_services.getAllStockTransferNew(this.entityId,this.employee_id).subscribe(
      (res: any) => {
        this.rowData = res.data || [];
      },
      (error) => {
        this.rowData = [];
      }
    );
  }

  addRedirect() {
    this.route.navigate(["master/warehouse-management/create-stock-transfer"]);
  }

}
