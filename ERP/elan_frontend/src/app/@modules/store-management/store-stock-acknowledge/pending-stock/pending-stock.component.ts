import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi } from 'ag-grid-community';
import { StoreManagementService } from '../../store-management.service';
import { StockActionComponent } from '../stock-action/stock-action.component';

@Component({
  selector: 'app-pending-stock',
  templateUrl: './pending-stock.component.html',
  styleUrls: ['./pending-stock.component.scss']
})
export class PendingStockComponent {
  private gridApi!: GridApi<any>;
  rowData: any;
  rowClass = 'rowClass';
  loginUser: any;
  employee_ids: any;
  entity_id: any;
  employee_id: any;
  loginUserDetails: any;
  role: any;
   status:any = 'Pending'
  constructor(private StoreService: StoreManagementService,public dialog: MatDialog){
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.employee_id = localStorage.getItem("EmpMainId");
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;
    this.getAllStoreTransferList(); 
  }
  
  
  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      minWidth: 100,
      maxWidth: 100,
      flex: 1,
    },
    {
      headerName: 'Store Name',
      field: 'store_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Item Code',
      field: 'item_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Quantity',
      field: 'total_item_qty',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'UOM',
      field: 'uom_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Action',
      field: 'store_id',
      flex: 1,
      minWidth: 150,
      cellRendererFramework: StockActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: 'grid-cell-centered',

    }
  ];


  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  
  getAllStoreTransferList(){
    this.StoreService.getAllStoreTransferList(this.entity_id,this.employee_id,this.role,this.status).subscribe((res:any)=>{
      this.rowData = res.data;
    });
  }
  
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  
  }


