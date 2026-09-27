import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { InventoryManagementService } from '../../ware-house-management/inventory-management.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import * as moment from 'moment';

@Component({
  selector: 'app-stock-in-transit',
  templateUrl: './stock-in-transit.component.html',
  styleUrls: ['./stock-in-transit.component.scss']
})
export class StockInTransitComponent implements OnInit {
  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple', };
  entity_id: number | null;
  financial_year_id: number | null;
  warehouseList: any[] = [];
  selectedWarehouseId: any = 'ALL';

  constructor(
    private accessData: AccessControlService,
    private inventoryService: InventoryManagementService
  ) { }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId();
    this.financial_year_id = this.accessData.getFinancialId();
    this.loadWarehouses();
    this.getStockInTransitList(null);

  }

  loadWarehouses() {
    this.inventoryService.getInventoryStockData(this.entity_id, null).subscribe((res: any) => {
      this.warehouseList = res?.data?.WarehouseList || [];
    });
  }

  getStockInTransitList(warehouseId: number | null) {
    this.inventoryService.getStockInTransit(this.entity_id, warehouseId).subscribe((res: any) => {
      this.rowData = res?.data || [];
    });
  }

  onWarehouseChange(event: any) {
    const val = event.value;
    this.selectedWarehouseId = val;
    const warehouseId = val === 'ALL' ? null : Number(val);
    this.getStockInTransitList(warehouseId);
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
      flex: 0.5,
    },
    {
      headerName: 'PO Number',
      field: 'po_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1
    },
    {
      headerName: 'PO Date',
      field: 'po_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueFormatter: (params: any) => {
        return moment(params.value).format('DD/MM/YYYY')
      }
    },
    {
      headerName: 'Shipping Alert No',
      field: 'shiped_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1
    },
    {
      headerName: 'Shipment Date',
      field: 'shipment_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueFormatter: (params: any) => {
        return moment(params.value).format('DD/MM/YYYY')
      }
    },
    {
      headerName: 'Expected Arrival',
      field: 'expected_arrival',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueFormatter: (params: any) => {
        return moment(params.value).format('DD/MM/YYYY')
      }
    },
    {
      headerName: 'Transport Mode',
      field: 'mode',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1
    },
    {
      headerName: 'Warehouse Name',
      field: 'warehouse_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1.5
    },
    {
      headerName: 'Transit Status',
      field: 'audit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: (params: any) => {
        const val = params.value || '';
        return `<span style="background-color: #ffe8cc; color: #d97706; padding: 2px 8px; border-radius: 4px; font-weight: 500; font-size: 11px;">${val.replace(/_/g, ' ')}</span>`;
      }
    }
  ];
}

