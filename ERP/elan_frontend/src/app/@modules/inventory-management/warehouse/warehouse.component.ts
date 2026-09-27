import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { InventoryManagementService } from '../../ware-house-management/inventory-management.service';
import { WarehouseActionComponent } from './warehouse-action/warehouse-action.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {


  public columnDefs: ColDef[] = [
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
      headerName: 'Warehouse Code',
      field: 'code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Warehouse Name',
      field: 'name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Location',
      field: 'location_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Take Action',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      pinned: 'right',
      cellRenderer: WarehouseActionComponent,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    }
  ];
  actions = [
    {
      label: 'Add Warehouse',
      icon: 'add',
      callback: this.addUser.bind(this),
    },
  ];

  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple', };

  constructor(
    private inventoryService: InventoryManagementService,
    private route: Router) {
  }

  ngOnInit(): void {
    this.getAllWarehouseList();
  }

  addUser(): void {
    this.route.navigate(["master/warehouse-management/warehouse/create"]);
  }

  getAllWarehouseList() {
    this.inventoryService.getAllWarehouseListNew().subscribe((response: any) => {
      this.rowData = response.data || [];
    });
  }
}
