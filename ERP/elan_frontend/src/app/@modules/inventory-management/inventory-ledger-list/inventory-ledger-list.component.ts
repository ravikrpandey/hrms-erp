import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { InventoryManagementService } from '../../ware-house-management/inventory-management.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inventory-ledger-list',
  templateUrl: './inventory-ledger-list.component.html',
  styleUrls: ['./inventory-ledger-list.component.scss']
})
export class InventoryLedgerListComponent implements OnInit {
  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple', };
  entity_id: number | null;
  financial_year_id: number | null;
  itemName: string = '';
  warehouseName: string = '';
  available_qty: number = 0;
  hold_qty: number = 0;
  delivered_qty: number = 0;
  scrap_qty: number = 0;

  constructor(
    private accessData: AccessControlService,private route: ActivatedRoute,
    private inventoryService: InventoryManagementService) { }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();

    this.route.queryParams.subscribe(params => {
      const warehouseId = params['warehouse_id'];
      const itemId = params['item_id'];
      this.getAllStockLedgerList(this.entity_id,warehouseId,itemId);
    });
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
      headerName: 'Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .7,
      valueFormatter: (params: any) => {
        if (!params.value) return '';

        const date = new Date(params.value);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      }
    },
    {
      headerName: 'Transaction Type',
      field: 'type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8
    },
    {
      headerName: 'Document Type',
      field: 'reference_table',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1
    },
    // {
    //   headerName: 'GRN/SO No.',
    //   field: 'grnsono',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: .8
    // },
    // {
    //   headerName: 'Invoice/Ref. No.',
    //   field: 'invoiceno',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: .8
    // },
    {
      headerName: 'Qty',
      field: 'quantity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .4,
      cellRenderer: (params:any) => {

        const qty = params.value ?? 0;
        const type = params.data?.type;
        const sign = params.data?.sign ?? '';

        // color mapping only
        const typeColor: any = {
          IN: 'green',
          OUT: 'red',
          SCRAP: 'red',
          HOLD: '#f57c00'
        };

        // default gray if unknown type
        const color = typeColor[type] || '#616161';

        return `
          <span style="color:${color}; font-weight:600">
            ${sign}${qty}
          </span>
        `;
      }
    },
    {
      headerName: 'Remark',
      field: 'remark',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2.5
    }
  ];

  getAllStockLedgerList(entityId: any, warehouseId: any, itemId: any) {
    this.inventoryService.getInvLedgerData(entityId,warehouseId, itemId).subscribe((res: any) => {
      this.rowData = res.data || [];

      if (this.rowData.length > 0) {
        this.warehouseName = this.rowData[0].warehouse_name;
        this.itemName = this.rowData[0].item_name;
        this.available_qty = this.rowData[0].available_qty;
        this.hold_qty = this.rowData[0].hold_qty;
        this.delivered_qty = this.rowData[0].delivered_qty;
        this.scrap_qty = this.rowData[0].scrap_qty;
      }
    });
  }

}