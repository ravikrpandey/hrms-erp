
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { StockActionComponent } from './stock-action/stock-action.component';
import { StoreManagementService } from '../store-management.service';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss']
})
export class StockTransferComponent {
 entityId:any;
  loginUserDetails: any;
  role:any;
  constructor(
    public mtdialog: MatDialog, 
    private route: Router,
    private store_services:StoreManagementService) { }

  ngOnInit() {
    this.entityId = localStorage.getItem("selectedEntityId");
    this.employee_id = localStorage.getItem("EmpMainId")
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;
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
        field: 'id',
        flex: 1,
        minWidth: 150,
        cellRenderer: StockActionComponent,
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
   this.route.navigate(['master/store-management/stock-transfer/create-stock-transfer'])
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
    this.store_services.getAllStockTransfer(this.entityId,this.employee_id,this.role).subscribe(
      (res: any) => {
        this.rowData = res.data || [];
      },
      (error) => {
        this.rowData = [];
      }
    );
  }
  
}

