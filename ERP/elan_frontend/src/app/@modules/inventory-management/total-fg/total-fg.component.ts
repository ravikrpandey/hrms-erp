import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { FGListService } from 'src/app/@shared/services/warehouse/fg-list.service';

@Component({
  selector: 'app-total-fg',
  templateUrl: './total-fg.component.html',
  styleUrls: ['./total-fg.component.scss'],
})
export class TotalFgComponent {
  public tab: string;
  selectedIndex = 0;
  subheading: string = 'Total FG List';
  rowClass: any;
  private gridApi!: GridApi<any>;
  assignAction: ModuleAction;
  filteredData: any[] = [];
  public rowData: any = [];
  public columnDefs: ColDef[] = [
    {
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'grid-cell-centered',
      flex: 0.5,
      minWidth: 70,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    // {
    //   headerName: 'Item Category',
    //   field: 'asset_category_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 100,
    // },
    // {
    //   headerName: 'Item Sub Category',
    //   field: 'sub_category_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 100,
    // },
    // {
    //   headerName: 'Item Name',
    //   field: 'item_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 100,
    // },
    // {
    //   headerName: 'Item Code',
    //   field: 'item_code',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 100,
    // },
    {
      headerName: 'Item Name',
      field: 'item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,

      valueGetter: (params: any) => {
        return `${params.data.item_name || ''} (${params.data.item_code || ''})`;
      },

      tooltipValueGetter: (params: any) => {
        return `Category: ${params.data.asset_category_name || '-'} |
        Sub Category: ${params.data.sub_category_name || '-'}`;
      }
    },
    // {
    //   headerName: 'Production No',
    //   field: 'Production_order',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    {
      headerName: 'Quantity',
      field: 'quantity',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
      valueFormatter: (params) => {
        return params.value != null ? Math.floor(params.value).toString() : '';
      },
    },
    {
      headerName: 'Warehouse Name',
      field: 'warehouse_name',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 180,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Sub Location Type',
      field: 'zone_type',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Sub Location Name',
      field: 'zone_name',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },

    {
      headerName: 'Bay',
      field: 'bay_name',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Rack',
      field: 'rack_name',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Bin',
      field: 'bin_name',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Source Type',
      field: 'source_type',
      cellClass: 'grid-cell-centered',
      flex: 1.5,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    // {
    //   headerName: 'Quality Check',
    //   field: 'qualityCheckDate',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    // {
    //   headerName: 'Manufacture Date',
    //   field: 'manufactureDate',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    // {
    //   headerName: 'Request',
    //   field: 'stock_request',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fgService: FGListService,
  ) {
    this.getAllStocksByStatus('ALLOCATED');
  }

  getAllStocksByStatus(status: 'All' | 'PENDING' | 'ALLOCATED' | 'REJECTED') {
    this.fgService.getAllStocksByStatus(status).subscribe((res: any) => {
      this.rowData = res.data;
      this.filteredData = this.rowData;
    });
  }

  onTabChange(event: MatTabChangeEvent) {
    const tabs = [
      'all-stocks',
      'pending-stocks',
      'approved-stocks',
      'rejected-stocks',
    ];
    this.router.navigate(
      ['master/inventory-management/stock-acknowledgement'],
      {
        queryParams: { tab: tabs[event.index] },
        queryParamsHandling: 'merge',
      },
    );
  }

  generateMultiPoGrn() {
    this.router.navigate([
      'master/purchase-management/grn/genrate-grn-multi-po',
    ]);
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value,
    );
  }

  onFilterByDepartment(event: any) {
    if (event == null || undefined) {
      this.filteredData = this.rowData;
    } else {
      this.filteredData = this.rowData.filter(
        (res: any) => res.department_name == event,
      );
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
