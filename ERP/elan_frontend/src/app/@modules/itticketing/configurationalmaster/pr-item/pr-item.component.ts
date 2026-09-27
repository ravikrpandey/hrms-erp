import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { PrItemActionComponent } from './pr-item-action/pr-item-action.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ItemMasterStatusComponent } from './pr-item-action/item-master-status/item-master-status.component';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-pr-item',
  templateUrl: './pr-item.component.html',
  styleUrls: ['./pr-item.component.scss'],
})
export class PrItemComponent {
  errorMessage: any;
  id: any;
  item_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  count: any = 0;
  assignAction: any;
  entity_id: any;
  financial_year_id: any;
  pageNo: number = 1;
  pageSize: number = 100000;

  gridParams: any;
  gridColumnApi: any;
  searchText: any;
  public gridOptions: any;
  itemType: any[] = [];
  context: any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog,
    private route: Router,
    private activetRoute: ActivatedRoute,
  ) {
    this.rowClass = 'rowClass';
    this.context = { componentParent: this };
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');

    this.financial_year_id = localStorage.getItem('financial_id');
    this.assignAction = this._rbackService.accessAssignAction();

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.item_id = this.id.item_id;
    });
    this.getAllItem();
    this.getItemType();
  }

  createItem() {
    this.route.navigate([
      '/master/configurational-master/pr-item/create-item',
    ]);
  }

  public columnDefs: ColDef[] = [
    {
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8,
    },
    {
      headerName: 'Item Code',
      field: 'item_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1.2,
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      tooltipField: 'item_name',
      cellClass: 'grid-cell-centered',
      flex: 2,
    },
    {
      headerName: 'Item Category',
      field: 'asset_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
    },
    {
      headerName: 'Item Sub Category',
      field: 'sub_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      tooltipField: 'sub_category_name',
      cellClass: 'grid-cell-centered',
      flex: 2,
    },
    {
      headerName: 'HSN Code',
      field: 'hsn_sac_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1.2,
    },
    {
      headerName: 'GST',
      field: 'gstRate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: ItemMasterStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Action',
      field: 'id',
      pinned: 'right',
      cellRenderer: PrItemActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
  ];

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const dataSource = {
      getRows: (params: any) => {
        let pageNo = params.startRow / this.pageSize + 1;
        this.fetchPaginatedData(pageNo, this.pageSize, params);
      },
    };

    this.gridApi.setDatasource(dataSource);
  }

  fetchPaginatedData(pageNo: number, pageSize: number, gridParams: any) {
    this.pageNo = pageNo;
    this.pageSize = pageSize;
    this.gridParams = gridParams;
    this.getAllItem();
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

  getAllItem() {
    let data = {
      page: this.pageNo,
      pageSize: this.pageSize,
      search: this.searchText,
    };
    this._configurationalMasterService
      .getAllItemMasterList(data)
      .subscribe((res: any) => {
        this.rowData = res.data.reverse();
        let rows = res.data || [];
        let totalRows = res.pagination?.totalItems || 0;
        setTimeout(() => {
          if (this.gridParams) {
            this.gridParams.successCallback(rows, totalRows);
          }
        });
      });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  exportExcel() {
    this._configurationalMasterService.exportExcel(this.rowData, 'download');
  }

  getItemType() {
    this._configurationalMasterService.getItemType().subscribe(
      (res: any) => {
        if (res.data) {
          this.itemType = res.data;
        }
      },
      (err: any) => {
        console.log(err.error.message);
      }
    );
  }
}
