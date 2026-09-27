import { Component } from '@angular/core';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { GrnServiceService } from '../../purchase-management/services/grn-service.service';
import { AddStockActionComponent } from './add-stock-action/add-stock-action.component';
import { InventoryManagementService } from '../../ware-house-management/inventory-management.service';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss']
})
export class AddStockComponent {

  rowClass: string;
  private gridApi!: GridApi<any>;
  filteredData: any[] = [];
  grnList: any[] = [];

  constructor(
    private toast: ToastrService,
    private inventoryManagementService: InventoryManagementService,
    private accessCtrl: AccessControlService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit() {
    this.getAllPoList(this.accessCtrl.getFinancialId(), this.accessCtrl.getEntityId())
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  getAllPoList(financial_id: any, entity_id: any) {
    this.inventoryManagementService.getAllPendingGrnAllcation(financial_id, entity_id).subscribe(
      (res: any) => {
        this.grnList = res.data;
        this.filteredData = this.grnList;
      },
      (error: any) => {
        this.toast.error(error.error.message);
      }
    )
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


  getClassForPrice(lowThsthresholdStock: any): string {
    return 'low_hershold_stock';
  }

  public columnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .6
    },
    {
      headerName: 'PO No.',
      field: 'po_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // cellClass: "grid-cell-centered",
      flex: 1,
      cellClass: (params: { value: any; }) => this.getClassForPrice(params)
    },
    // {
    //   headerName: 'Budget Type',
    //   field: 'po_type',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 150,
    // },
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1
    },
    // {
    //   headerName: 'Category Name',
    //   field: 'name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 150,
    // },
    // {
    //   headerName: 'Indent Type',
    //   field: 'po_category',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 180,

    // },
    {
      headerName: 'Warehouse Name',
      field: 'warehouse_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1
    },
    {
      headerName: 'PO Date',
      field: 'po_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      valueFormatter: (params: any) => {
        // return moment(params.value).format('DD-MM-YYYY, h:mm:ss A')
        return moment(params.value).format('DD-MM-YYYY')
      },
    },
    {
      headerName: 'PO Qty',
      field: 'item_quantity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: .6
    },
    {
      headerName: 'Total Purchase',
      field: 'total_purchase',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1
    },
    // {
    //   headerName: 'Status',
    //   field: 'discardStatus',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    // },
    // {
    //   headerName: 'GRN Version',
    //   field: 'version',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered button-style",
    //   flex: 1,
    //   minWidth: 150,
    //   cellRendererParams: {
    //     minWidth: 10,
    //     className: 'mat-blue',
    //     hideRequestButton: true,
    //     hideDetailsButton: false,
    //     hideDownloadIcon: false,
    //     showCustomIcon: false,
    //   },
    // },
    {
      headerName: 'Actions',
      field: 'procurement_product_id', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      //pinned: 'right',
      cellRenderer: AddStockActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",
    },

  ];

}