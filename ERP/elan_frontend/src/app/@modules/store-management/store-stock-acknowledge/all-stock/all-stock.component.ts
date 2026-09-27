import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi } from 'ag-grid-community';
import { StoreManagementService } from '../../store-management.service';
import { StockStatusComponent } from '../stock-status/stock-status.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
@Component({
  selector: 'app-all-stock',
  templateUrl: './all-stock.component.html',
  styleUrls: ['./all-stock.component.scss']
})
export class AllStockComponent {

  private gridApi!: GridApi<any>;
  rowData: any;
  rowClass = 'rowClass';
  loginUser: any;
  employee_ids: any;
  entity_id: any;
  employee_id: any;
  loginUserDetails: any;
  role: any;
  status:any = 'All';
  assignAction: any;
  constructor(private StoreService: StoreManagementService,private _rbackService: RbacMasterService,public dialog: MatDialog){
    this.assignAction = this._rbackService.accessAssignAction();
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.employee_id = localStorage.getItem("EmpMainId");
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;
    this.getAllStoreItemList(); 
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
    }
  ];


  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  
  getAllStoreItemList(){
    this.StoreService.getAllStoreTransferList(this.entity_id,this.employee_id,this.role,this.status).subscribe((res:any)=>{
      this.rowData = res.data;
    });
  }
  
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  
    statusCellClicked(e: any) {
      if (this.assignAction.Write) {
        const dialogRef = this.dialog.open(StockStatusComponent, {
          width: '500px',
          data: e.data,
        });
        dialogRef.afterClosed().subscribe((result) => {});
      }
    }

  }

