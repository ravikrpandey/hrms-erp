import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { InventoryManagementService } from '../../ware-house-management/inventory-management.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-stock-list',
  templateUrl: './inventory-stock-list.component.html',
  styleUrls: ['./inventory-stock-list.component.scss']
})
export class InventoryStockListComponent implements OnInit {
  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple', };
  entity_id: number | null;
  financial_year_id: number | null;
  warehouseList: any[] = [];
  selectedWarehouseId: number | null;

  actions = [
    {
      label: 'Add Inventory',
      icon: 'add',
      callback: this.addInventory.bind(this),
    },
  ];

  constructor(private router: Router,
    private accessData: AccessControlService,
    private inventoryService: InventoryManagementService) { }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();
    this.getAllStockList(null);
  }

  public columnDefs: ColDef[] = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .5,
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1
    },
    {
      headerName: 'Item Code',
      field: 'item_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1
    },
    {
      headerName: 'Available',
      field: 'available_qty',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8
    },
    {
      headerName: 'Reserved',
      field: 'hold_qty',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8
    },
    {
      headerName: 'Delivered',
      field: 'delivered_qty',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8
    },
    {
      headerName: 'Scrap',
      field: 'scrap_qty',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8
    },
    {
      headerName: 'Action',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .5,
      cellRenderer: (params: any) => {
        return `
          <a href="master/inventory-management/stock-list/inventory-ledger?warehouse_id=${params.data.warehouse_id}&item_id=${params.data.item_id}" target="_blank"
            style="color:#1976d2; text-decoration:none"
            title="View Movement List">
            <i class="material-icons">receipt_long</i>
          </a>
        `;
      }
    }
  ];

  getAllStockList(selectedWarehouseId: number | null) {
    this.inventoryService.getInventoryStockData(this.entity_id,selectedWarehouseId).subscribe((res: any) => {
      let data = res?.data;
      this.warehouseList = data.WarehouseList;
      this.selectedWarehouseId = Number(data.selectedWarehouseId);
      this.rowData = data.StockList;
    });
  }

  addInventory() {
    this.router.navigate(['master/inventory-management/stock-list/add-inventory']);
  }

}