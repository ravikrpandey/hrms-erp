import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { WarehouseBifurcationActionComponent } from './warehouse-bifurcation-action/warehouse-bifurcation-action.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InventoryManagementService } from '../../ware-house-management/inventory-management.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-warehouse-bifurcation',
  templateUrl: './warehouse-bifurcation.component.html',
  styleUrls: ['./warehouse-bifurcation.component.scss']
})
export class WarehouseBifurcationComponent implements OnInit {
  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple', };
  warehouseList: any[] = [];
  warehouse_id: FormControl<number | null>;

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
      headerName: 'license_number',
      field: 'license_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'manager_name',
      headerName: 'Manager Name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Contact Number',
      field: 'contact_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    },
    {
      headerName: 'Total Storage Area (ft2)',
      field: 'area',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
      valueFormatter: (params: any) => {
        if (!params.value && params.value !== 0) return '';
        return params.value.toLocaleString('en-IN');
      }
    },
    {
      headerName: 'Take Action',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      pinned: 'right',
      cellRenderer: WarehouseBifurcationActionComponent,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 250,
    }
  ];

  constructor(
    public dialog: MatDialog,
    private inventoryService: InventoryManagementService,
    private route: Router) {

  }

  ngOnInit(): void {
    this.getAllWarehouseBifurcation();
    this.getAllWarehouseList();
  }

  getAllWarehouseBifurcation() {
    this.inventoryService.getAllWarehouseBifurcations().subscribe((res: any) => {
      if (res && res.data) {
        this.rowData = res.data;
      }
    });
  }

  getAllWarehouseList() {
    this.inventoryService.getAllWarehouseListNew().subscribe((res: any) => {
      if (res && res.data) {
        this.warehouseList = res.data;
      }
    });
  }

  setupBifurcation(id: number) {
    this.route.navigate(['/master/warehouse-management/warehouse-bifurcation/setup-warehouse-bifurcation'], { queryParams: { id } })
  }
}
