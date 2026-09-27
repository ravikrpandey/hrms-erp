import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { AssetActionComponent } from '../asset-action/asset-action.component';
import { AssetLogoComponent } from '../asset-logo/asset-logo.component';
import { UploadExcelDialogComponent } from '../../upload-excel-dialog/upload-excel-dialog.component';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { BulkAllocationComponent } from '../bulk-allocation/bulk-allocation.component';
import { DepreciationService } from 'src/app/@shared/services/depreciation.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss'],
})
export class AssetListComponent {
  errorMessage: any;
  id: any;
  rowClass: any;
  fid: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  rowData_NS: any;
  rowData_AS: any;
  entity_id: any;
  filter_fy: any;
  databaseKey: any = environment.servralUrl;
  emp_id: any;
  selectedIndex: number = 0;
  allAssets: any;
  public gridOptions: any = {
    rowSelection: 'multiple',
    rowHeight: 55,
    suppressRowClickSelection: true,
  };

  dialogRef: MatDialog | any;
  selectedTabIndex: any;
  tabsList: any[] = ['All Assets', 'Near to salvage', 'Already Salvage'];
  itemsList: any;
  branchlist: any;
  vendorName: any;
  assetCategory: any;
  assetfilterCategory: any;
  assetStatuses: any;
  chartedAccount: any;
  chartedAccount1: any;
  calculationMethods: any;
  filterCategoryControl = new FormControl();
  selectedNames: {
    item_name: string;
    asset_tagId: string;
    grn_item_status_id: number;
  }[] = [];
  selectedAsset: string[] = [];
  selectedCategory: string | null = null;
  assignAction: any;
  actions: any[] = [];

  constructor(
    private readonly _configurationalMasterService: ConfigurationalmasterService,
    private _commonService: CommonService,
    private _finaceService: FinaceService,
    public dialog: MatDialog,
    private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private router: Router,
    private vendorService: VendorManagementService,
    private asset_service: AssetListService,
    private prService: PurchaseRequestService,
    private depreciationService: DepreciationService,
    private _rbackService: RbacMasterService,
  ) {
    this.rowClass = 'rowClass';
    this.assignAction = this._rbackService.accessAssignAction();
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser');
    let loginUser = JSON.parse(lg);
    this.emp_id = loginUser?.employee_id;
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.filter_fy = localStorage.getItem('financial_id');
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
    });
    this.getAssetList();
    this.getChartAccountList();
    this.getAllCategory();
    this.getAllActiveitem();
    this.getAllBranch();
    this.getAllVendorName();
    this.getAssetStatuses();
    this.getCalculationMethods();
    this.searchFilter();
    this.setupActions();
  }

  setupActions() {
    this.actions = [];
    if (this.assignAction?.Write) {
      this.actions.push({
        label: 'Add Asset',
        icon: 'add',
        color: 'primary',
        callback: () => {
          this.router.navigate([
            '/master/asset-management/asset-list/create-direct-asset',
          ]);
        },
      });
    }
  }

  searchFilter() {
    this.filterCategoryControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.assetCategory = this.assetfilterCategory.filter((asset: any) =>
          asset.asset_category_name.toLowerCase().includes(value.toLowerCase()),
        );
      });
  }

  getCalculationMethods() {
    this.depreciationService.getCalculationMethods().subscribe(
      (res: any) => {
        this.calculationMethods = res.data;
      },
      (err: any) => {},
    );
  }
  getAssetList() {
    this.asset_service.getAllAsset(this.emp_id, this.entity_id).subscribe(
      (res: any) => {
        if (res.data) {
          this.rowData = res.data;
          this.allAssets = res.data;
        }
      },
      (err: any) => {
        this.rowData = [];
      },
    );
  }
  getNearToSalvageAssets() {
    this.asset_service.getNearToSalvageAssets(this.entity_id).subscribe(
      (res: any) => {
        if (res.data) {
          this.rowData_NS = res.data;
        }
      },
      (err: any) => {
        this.rowData_NS = [];
      },
    );
  }
  getAlreadySalvageAssets() {
    this.asset_service.getAlreadySalvageAssets(this.entity_id).subscribe(
      (res: any) => {
        if (res.data) {
          this.rowData_AS = res.data;
        }
      },
      (err: any) => {
        this.rowData_AS = [];
      },
    );
  }
  getChartAccountList() {
    this._finaceService
      .getchartedAccount(this.entity_id)
      .subscribe((res: any) => {
        this.chartedAccount = res.data.filter(
          (element: any) => element.is_group === 'no',
        );
        this.chartedAccount1 = this.chartedAccount.map(
          (res: any) => res.account_name,
        );
      });
  }
  public columnDefs: ColDef[] = [
    {
      headerName: 'Report',
      field: 'reportCheckbox',
      cellRenderer: (params: any) => {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!params.data.reportCheckbox;

        input.addEventListener('change', () => {
          // Update the data in the grid when checkbox changes
          params.node.setDataValue('reportCheckbox', input.checked);
        });

        return input;
      },
      width: 80,
      suppressMenu: true,
    },
    {
      headerName: 'Allocate',
      field: 'checkbox',
      checkboxSelection: (params: any) => {
        return !(
          params.data?.asset_loc_status === 'ALLOCATED' &&
          params.data?.allocation_type === 'allocated to employee'
        );
      },
      headerCheckboxSelection: false,
      width: 50,
      suppressMenu: true,
    },
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Asset No',
      field: 'asset_tagId',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.asset_tagId
          ? params.data.asset_tagId
          : '-----------';
      },
    },
    {
      headerName: 'Po No',
      field: 'po_number',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 100,
      valueGetter: (params: any) => {
        return params.data.po_number ? params.data.po_number : 'NA';
      },
    },
    {
      headerName: 'Serial No',
      field: 'itemSerialNo',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.itemSerialNo
          ? params.data.itemSerialNo
          : '-----------';
      },
    },
    {
      headerName: 'Batch No',
      field: 'batchNo',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.batchNo ? params.data.batchNo : 'NA';
      },
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Item Status',
      field: 'status_name',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Item Category',
      field: 'asset_category_name',
      filter: 'agSetColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Acquisition Amount',
      field: 'total_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Accumulated Depreciation',
      field: 'accumulated_dep',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Net Value',
      field: 'net_value',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Billing Address',
      field: 'branch_address',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
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
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.po_date ? params.data.po_date : 'NA';
      },
    },
    {
      headerName: 'Allocated To',
      field: 'allocation_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        if (
          params.data.allocation_type === null ||
          params.data.asset_loc_status == 'DEALLOCATED'
        ) {
          return 'NA';
        } else if (
          params.data.allocation_type === 'transfer to other location' &&
          params.data.asset_loc_status == 'ALLOCATED'
        ) {
          return params.data.allocated_branch;
        } else {
          return params.data.asset_allocated_emp;
        }
      },
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      pinned: 'right',
      cellRenderer: AssetActionComponent,
      cellRendererParams: (params: any) => {
        return {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
          selectedTab: this.selectedIndex,
        };
      },
    },
  ];
  public columnDefs_NS: ColDef[] = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Asset No',
      field: 'asset_tagId',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.asset_tagId
          ? params.data.asset_tagId
          : '-----------';
      },
    },
    {
      headerName: 'Po No',
      field: 'po_number',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.po_number ? params.data.po_number : 'NA';
      },
    },
    {
      headerName: 'Serial No',
      field: 'itemSerialNo',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.itemSerialNo
          ? params.data.itemSerialNo
          : '-----------';
      },
    },
    {
      headerName: 'Batch No',
      field: 'batchNo',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.batchNo ? params.data.batchNo : 'NA';
      },
    },
    {
      headerName: 'Image',
      field: 'item_document',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      // minHeight: 150,
      cellRenderer: AssetLogoComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Item Category',
      field: 'asset_category_name',
      sortable: true,
      filter: 'agSetColumnFilter',
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Acquisition Amount',
      field: 'total_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Billing Address',
      field: 'branch_address',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
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
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.po_date ? params.data.po_date : 'NA';
      },
    },
    // {
    //   headerName: 'Status',
    //   field: 'itemStatus',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   //editable: true,
    //   minWidth: 150
    // },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      pinned: 'right',
      cellRenderer: AssetActionComponent,
      cellRendererParams: (params: any) => {
        return {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
          selectedTab: this.selectedIndex,
        };
      },
    },
  ];
  public columnDefs_AS: ColDef[] = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Asset No',
      field: 'asset_tagId',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.asset_tagId
          ? params.data.asset_tagId
          : '-----------';
      },
    },
    {
      headerName: 'Po No',
      field: 'po_number',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.po_number ? params.data.po_number : 'NA';
      },
    },
    {
      headerName: 'Serial No',
      field: 'itemSerialNo',
      sortable: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.itemSerialNo
          ? params.data.itemSerialNo
          : '-----------';
      },
    },
    {
      headerName: 'Batch No',
      field: 'batchNo',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.batchNo ? params.data.batchNo : 'NA';
      },
    },
    {
      headerName: 'Image',
      field: 'item_document',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      // minHeight: 150,
      cellRenderer: AssetLogoComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Item Category',
      field: 'asset_category_name',
      filter: 'agSetColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Acquisition Amount',
      field: 'total_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Billing Address',
      field: 'branch_address',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
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
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.po_date ? params.data.po_date : 'NA';
      },
    },
    // {
    //   headerName: 'Status',
    //   field: 'itemStatus',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   //editable: true,
    //   minWidth: 150
    // },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      pinned: 'right',
      cellRenderer: AssetActionComponent,
      cellRendererParams: (params: any) => {
        return {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
          selectedTab: this.selectedIndex,
        };
      },
    },
  ];

  selectedAssets: any = [];
  selectedAssetCount: number = 0;

  onSelectionChanged(event: any) {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const validSelectedData = selectedData.filter(
      (row) =>
        row.asset_loc_status == null ||
        row.asset_loc_status == 'DEALLOCATED' ||
        (row.asset_loc_status == 'ALLOCATED' &&
          row.allocation_type == 'transfer to other location' &&
          row.allocation_type !== 'allocated to employee'),
    );
    this.selectedAssetCount = validSelectedData.length;
    this.selectedAssets = validSelectedData;

    this.selectedNames = this.selectedAssets.map((asset: any) => ({
      item_name: asset.item_name,
      asset_tagId: asset.asset_tagId,
      grn_item_status_id: asset.grn_item_status_id,
      grn_id: asset.grn_id,
      branch_name: asset?.branch_name,
    }));
  }

  getAllActiveitem() {
    this._configurationalMasterService
      .getAllActiveItem()
      .subscribe((res: any) => {
        this.itemsList = res.data;
      });
  }
  getAllBranch() {
    this._configurationalMasterService
      .branch_get_active()
      .subscribe((res: any) => {
        this.branchlist = res.data;
      });
  }

  getAllVendorName() {
    this.vendorService.getAllVendorName().subscribe((res: any) => {
      this.vendorName = res.data;
    });
  }
  getAllCategory = () => {
    this.prService.getAllCategory().subscribe((res: any) => {
      this.assetCategory = res.data;
      this.assetfilterCategory = res.data;
    });
  };
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(e: any) {}

  agInit(params: ICellRendererParams): void {}

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
  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
    if (this.tabsList[event.index] == 'All Assets') {
      this.getAssetList();
    } else if (this.tabsList[event.index] == 'Near to salvage') {
      this.getNearToSalvageAssets();
      console.log('near to salvage ');
    } else {
      this.getAlreadySalvageAssets();
    }
  }

  openAloDialog() {
    if (this.selectedNames.length < 1) {
      return this.toaster.error('Please select at least an asset');
    }
    this.dialogRef = this.dialog.open(BulkAllocationComponent, {
      width: '1000px',
      disableClose: true,
      data: { selectedNames: this.selectedNames },
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  openDialog() {
    this.dialogRef = this.dialog.open(UploadExcelDialogComponent, {
      width: '600px',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  onBtnExportDataAsExcel() {
    let data = this.rowData.map((x: any, i: number) => ({
      'Asset No.': x.asset_tagId,
      'Po No.': x.po_number,
      'Serial No.': x.itemSerialNo,
      'Batch No.': x.batchNo,
      'Item Name': x.item_name,
      'Item Category': x.asset_category_name,
      Amount: x.total_amount,
      'Billing Address': x.branch_address,
      'PO Date': x.po_date,
    }));

    const titleRow = ['', '', 'Asset List', '', '', ''];

    const headerRow = [
      'Asset No.',
      'Po No.',
      'Serial No.',
      'Batch No.',
      'Item Name',
      'Item Category',
      'Amount',
      'Billing Address',
      'PO Date',
    ];

    const finalData = [
      titleRow,
      headerRow,
      ...data.map((item: any) => Object.values(item)),
    ];
    console.log(finalData);
    this._commonService.exportExcelFileAsset(finalData, 'Asset-List');
  }

  getAssetStatuses() {
    this.asset_service.getAllAssetStatuses().subscribe((res: any) => {
      this.assetStatuses = res?.data;
    });
  }

  async downloadSampleExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Asset Data');

    // Define column headers
    const columns = [
      { header: 'Asset No.', key: 'assetNo', width: 25 },
      { header: 'Asset Type', key: 'assetType', width: 30 },
      { header: 'Asset Category', key: 'assetCategory', width: 30 },
      { header: 'Item Name', key: 'itemName', width: 25 },
      { header: 'Item Status', key: 'itemStatus', width: 25 },
      { header: 'Date of Purchase', key: 'dateOfPurchase', width: 25 },
      { header: 'Put to Use Date', key: 'putToUseDate', width: 25 },
      { header: 'Depriciation By', key: 'depriciationBy', width: 30 },
      { header: 'Depreciation Rate', key: 'depreciationRate', width: 25 },
      // { header: 'Accumulated Depreciation', key: 'accumulatedDepreciation', width: 30 },
      { header: 'Depreciation Method', key: 'depreciationMethod', width: 30 },
      { header: 'Depriciated Value', key: 'depriciatedValue', width: 25 },
      { header: 'Branch Name', key: 'branchName', width: 30 },
      { header: 'Serial No.', key: 'serialNo', width: 25 },
      { header: 'Use Full Life(Yrs)', key: 'useFullLifeYears', width: 25 },
      { header: 'VAT', key: 'vat', width: 20 },
      { header: 'Acquisition amount', key: 'totalAmount', width: 25 },
      { header: 'Vendor Name', key: 'vendorName', width: 30 },
    ];

    // Add Chart of Account columns
    for (let i = 1; i <= 6; i++) {
      columns.push(
        { header: `Chart of Account${i}`, key: `coa${i}`, width: 30 },
        { header: `Debit Amount${i}`, key: `debitAmount${i}`, width: 20 },
        { header: `Credit Amount${i}`, key: `creditAmount${i}`, width: 20 },
      );
    }

    // Add Key-Value pairs after COA blocks
    for (let i = 1; i <= 20; i++) {
      columns.push(
        { header: `Key${i}`, key: `key${i}`, width: 20 },
        { header: `Value${i}`, key: `value${i}`, width: 20 },
      );
    }

    worksheet.columns = columns;
    worksheet.getRow(1).font = { bold: true };

    // Dropdown source data
    const assetType = ['Tangible Asset', 'Intangible Asset'];
    const assetCategories = this.assetCategory.map(
      (c: any) => c.asset_category_name,
    );
    const itemNames = this.itemsList
      .filter((c: any) => c.item_type_id === 2)
      .map((c: any) => c.item_name);
    const depreciationMethods = [
      'Date of Purchase',
      'put to Use Date',
      'By Value',
    ];
    const branches = this.branchlist.map((c: any) => c.branch_name);
    const vendors = this.vendorName.map((c: any) => c.vendor_name);
    const assetStatus = this.assetStatuses.map((c: any) => c.status_name);
    const depreciationCalculationMethods = this.calculationMethods.map(
      (c: any) => c.calculationMethod,
    );
    const coa_list = this.chartedAccount.map(
      (c: any) => c.account_name + `(${c.id})`,
    );

    // Prefill one row of sample data
    worksheet.getRow(2).values = [
      ,
      // skip index 0
      'AST2897356',
      assetType[0] || '',
      assetCategories[0] || '',
      itemNames[0] || '',
      assetStatus[0] || '',
      '2024-01-01',
      '2024-01-05',
      depreciationMethods[0] || '',
      10,
      // 10000,
      depreciationCalculationMethods[0] || '',
      'NA',
      branches[0] || '',
      'SN-001',
      3,
      9,
      22000,
      vendors[0] || '',
    ];

    // Prefill empty rows to apply validation
    for (let i = 3; i <= 1000; i++) {
      worksheet.getRow(i).getCell('B').value = '';
      worksheet.getRow(i).getCell('C').value = '';
      worksheet.getRow(i).getCell('D').value = '';
      worksheet.getRow(i).getCell('E').value = '';
      worksheet.getRow(i).getCell('H').value = '';
      worksheet.getRow(i).getCell('J').value = '';
      worksheet.getRow(i).getCell('N').value = '';
    }

    // Hidden options sheet for dropdowns
    const optionsSheet = workbook.addWorksheet('Options');
    optionsSheet.state = 'veryHidden';

    optionsSheet.getColumn(1).values = [null, ...assetType];
    optionsSheet.getColumn(2).values = [null, ...assetCategories];
    optionsSheet.getColumn(3).values = [null, ...itemNames];
    optionsSheet.getColumn(4).values = [null, ...depreciationMethods];
    optionsSheet.getColumn(5).values = [null, ...branches];
    optionsSheet.getColumn(6).values = [null, ...vendors];
    optionsSheet.getColumn(7).values = [null, ...coa_list];
    optionsSheet.getColumn(8).values = [null, ...coa_list];
    optionsSheet.getColumn(9).values = [null, ...assetStatus];
    optionsSheet.getColumn(10).values = [
      null,
      ...depreciationCalculationMethods,
    ];

    // Define ranges
    const assetTypeRange = `=Options!$A$2:$A$${assetType.length + 1}`;
    const assetCategoriesRange = `=Options!$B$2:$B$${assetCategories.length + 1}`;
    const itemNamesRange = `=Options!$C$2:$C$${itemNames.length + 1}`;
    const depreciationMethodsRange = `=Options!$D$2:$D$${depreciationMethods.length + 1}`;
    const branchesRange = `=Options!$E$2:$E$${branches.length + 1}`;
    const vendorsRange = `=Options!$F$2:$F$${vendors.length + 1}`;
    const coaListRange = `=Options!$G$2:$G$${coa_list.length + 1}`;
    const coaListRangeId = `=Options!$BY$2:$BY$${coa_list.length + 1}`;
    const assetStatusRange = `=Options!$I$2:$I$${assetStatus.length + 1}`;
    const depreciationMethodRange = `=Options!$J$2:$J$${depreciationCalculationMethods.length + 1}`;

    // Apply dropdowns to correct columns
    const dropdownMap = [
      { col: 'B', range: assetTypeRange },
      { col: 'C', range: assetCategoriesRange },
      { col: 'D', range: itemNamesRange },
      { col: 'E', range: assetStatusRange },
      { col: 'H', range: depreciationMethodsRange },
      { col: 'L', range: branchesRange },
      { col: 'Q', range: vendorsRange },
    ];

    dropdownMap.forEach(({ col, range }) => {
      worksheet
        .getColumn(col)
        .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
          if (rowNumber >= 2) {
            cell.dataValidation = {
              type: 'list',
              allowBlank: true,
              formulae: [range],
              showErrorMessage: true,
              errorTitle: 'Invalid Selection',
              error: `Please select a valid value`,
            };
          }
        });
    });

    // Apply dropdown for all Chart of Account columns (every 3rd col starting from coa1)
    const firstCOAIndex = columns.findIndex((c) => c.key === 'coa1') + 1;
    for (let i = 0; i < 6; i++) {
      const coaColIndex = firstCOAIndex + i * 3;
      worksheet
        .getColumn(coaColIndex)
        .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
          if (rowNumber >= 2) {
            cell.dataValidation = {
              type: 'list',
              allowBlank: true,
              formulae: [coaListRange],
              showErrorMessage: true,
              errorTitle: 'Invalid Selection',
              error: 'Please select a valid Chart of Account',
            };
            const coaObj = this.chartedAccount[rowNumber - 2];
            worksheet.getCell(`BY${rowNumber}`).value = coaObj?.id || null;
          }
        });
    }

    // Depreciation Calculation Method (by value/put to use/date of purchase)
    const depMethodCol =
      columns.findIndex((c) => c.key === 'depreciationMethod') + 1;
    worksheet
      .getColumn(depMethodCol)
      .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber >= 2) {
          cell.dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [depreciationMethodRange],
            showErrorMessage: true,
            errorTitle: 'Invalid Selection',
            error: 'Please select a valid Depreciation Method',
          };
        }
      });

    // Export the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, `sample_excel.xlsx`);
  }

  removeName(item: any): void {
    this.selectedNames = this.selectedNames.filter(
      (chip: any) => chip.grn_item_status_id !== item.grn_item_status_id,
    );

    this.selectedAssets = this.selectedAssets.filter(
      (asset: any) => asset.grn_item_status_id !== item.grn_item_status_id,
    );

    this.selectedAssetCount = this.selectedAssets.length;
  }

  async exportAssetDataToExcel() {
    const currentYear = new Date().getFullYear();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Imobilizado');

    // Set column widths (based on original file)
    const columnWidths = [
      25.28, 12, 30.28, 184.71, 14.14, 168.71, 35.57, 16.57, 13, 55.43, 48.14,
      76.86, 59.43, 26.43, 53.57, 51.14, 25.57, 42.71, 52.57, 40.43, 47.86, 13,
      75.43, 8.86,
    ];
    worksheet.columns = columnWidths.map((width) => ({ width }));

    // Row 1: Title
    worksheet.mergeCells('A1:X1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Mapa de Imobilizado do Ano ' + currentYear;
    titleCell.font = { size: 72, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getRow(1).height = 91.5;
    worksheet.getRow(4).height = 91.25;
    worksheet.getRow(5).height = 195;
    // Row 2 & 3 & 4: Multi-line headers (merged)
    worksheet.mergeCells('A4:A5');
    worksheet.getCell('A4').value = 'Código\n\nCode';

    worksheet.mergeCells('B4:B5');
    worksheet.getCell('B4').value = 'Nº do Imobilizado\n\nasset number';

    worksheet.mergeCells('C4:C5');
    worksheet.mergeCells('D4:D5');
    worksheet.getCell('D4').value = 'Descrição\n\nDescription';

    worksheet.mergeCells('E4:E5');
    worksheet.getCell('E4').value = 'Quantidade\nQuantity';

    worksheet.mergeCells('F4:F5');
    worksheet.getCell('F4').value = 'Localização\n\nLocation';

    worksheet.getCell('G4').value = 'Data de Aquisição\n\nDate of acquisition';
    worksheet.getCell('G5').value = 'Ano\n\nYear';

    worksheet.mergeCells('H4:J4');
    worksheet.getCell('H4').value = 'Valor de Aquisição\nAcquisition Amount';

    //  worksheet.mergeCells('I3:I4');
    worksheet.getCell('H5').value = 'USD';
    //  worksheet.mergeCells('I3:I4');
    worksheet.getCell('I5').value = 'Câmbio\nExchange rate';

    //  worksheet.mergeCells('J3:J4');
    worksheet.getCell('J5').value = 'MZM\nMeticals';

    worksheet.mergeCells('K4:K5');
    worksheet.getCell('K4').value = 'Imparidades (MZM)\nImpairment Value';

    worksheet.mergeCells('L4:L5');
    worksheet.getCell('L4').value = 'Abates/Transf (MZM)\nWrite off/ sold';

    worksheet.mergeCells('M4:M5');
    worksheet.getCell('M4').value =
      'Valor Líquido dos Abates/Transf (MZM)\nacquisition amount';

    worksheet.mergeCells('N4:U4');
    worksheet.getCell('N4').value = 'Depreciation ';

    worksheet.getCell('N5').value = 'Taxa de amortização\nDepreciation rate';

    worksheet.getCell('O5').value = 'Acumulada no início do período (MZM)';

    //  worksheet.mergeCells('P4:P5');
    worksheet.getCell('P5').value =
      'Amortização mensal (MZM)\nMonthly depreciation';

    //  worksheet.mergeCells('Q4:Q5');
    worksheet.getCell('Q5').value =
      'Mês/Ano de Aquisição\nmonth/year acquisition';

    //  worksheet.mergeCells('R4:R5');
    worksheet.getCell('R5').value =
      'Tempo de Utilização durante o ano\nUsage time';

    //  worksheet.mergeCells('S4:S5');
    worksheet.getCell('S5').value =
      'Do exercício (MZM)\nCurrent year depreciation';

    //  worksheet.mergeCells('T4:T5');
    worksheet.getCell('T5').value = 'Abates\nWrite off value';

    //  worksheet.mergeCells('U4:U5');
    worksheet.getCell('U5').value = 'Acumuladas no Final do período (MZM)';

    worksheet.mergeCells('V4:V5');
    worksheet.getCell('V4').value = 'Valor Líquido (MZM)\nNet Value';

    // Apply formatting to headers
    [4, 5].forEach((rowNum) => {
      const row = worksheet.getRow(rowNum);
      row.eachCell((cell) => {
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
        cell.font = { bold: true };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });
    const selectedAssets = this.rowData.filter(
      (row: any) => row.reportCheckbox,
    );
    const dataToUse =
      selectedAssets.length > 0 ? selectedAssets : this.allAssets;

    const grouped = dataToUse.reduce(
      (acc: any, item: any) => {
        const category = item.asset_category_name || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      },
      {} as { [category: string]: any[] },
    );

    let rowIndex = 6; // Start after title + header
    Object.entries(grouped).forEach(([category, items]: any, categoryIndex) => {
      // worksheet.addRow([]); rowIndex++;

      // Category description row
      const descRow = worksheet.addRow([]);
      descRow.getCell(4).value = `Category: ${category}`;
      descRow.getCell(4).font = { bold: true };
      descRow.getCell(4).alignment = {
        vertical: 'middle',
        horizontal: 'left',
        wrapText: true,
      };
      rowIndex++;

      let categoryTotal = 0;

      items.forEach((item: any, i: any) => {
        categoryTotal += Number(item.total_amount || 0);
        const month_dep = this.calculateMonthlyDep(
          item.total_amount,
          item.depreciation_rate,
        );
        const acquisition_year = item?.purchase_date?.substring(0, 4) || '';
        const date = new Date(item.purchase_date);
        const acquisitionMonth = date.getMonth();
        const usage_time = this.getUsageMonthsInCurrentYear(
          acquisition_year,
          acquisitionMonth,
        );
        const curryearDep = month_dep * usage_time;
        const finalDep =
          (Number(item.accumulated_dep_manual) || 0) +
          (Number(curryearDep) || 0) -
          (Number(item.writeoffValue) || 0);

        const row = worksheet.addRow([
          item.asset_tagId || '--',
          item.itemSerialNo || '--',
          '',
          item.item_name,
          item.itemQty,
          item.allocated_branch,
          acquisition_year,
          '',
          '',
          item.total_amount,
          '',
          item.disposition_status,
          item.total_amount,
          item.depreciation_rate,
          item.accumulated_dep,
          month_dep,
          acquisitionMonth,
          usage_time,
          curryearDep,
          item.writeoffValue,
          finalDep,
          item.net_value,
        ]);

        const alignments: (
          | 'right'
          | 'center'
          | 'left'
          | 'distributed'
          | 'justify'
          | 'fill'
          | 'centerContinuous'
          | undefined
        )[] = [
          'right', // A - asset_tagId
          'center', // B - asset number
          'center', // C - (empty column)
          'left', // D - description
          'center', // E - quantity
          'left', // F - location
          'center', // G - date acquisition
          'right', // H - USD
          'right', // I - exchange rate
          'right', // J - MZM
          'right', // K - impairment
          'center', // L - write off
          'right', // M - acquisition amount
          'center', // N - dep rate
          'right', // O - accumulated
          'right', // P - monthly depreciation
          'center', // Q - month/year acquisition
          'center', // R - usage time
          'right', // S - current year depreciation
          'right', // T - write off value
          'right', // U - final accumulated
          'right', // V - net value
        ];
        row.eachCell((cell, colNumber) => {
          cell.alignment = {
            vertical: 'middle',
            horizontal: alignments[colNumber - 1],
            wrapText: true,
          };
          cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
        rowIndex++;
      });

      // Total row
      const totalRow = worksheet.addRow([
        '',
        '',
        '',
        `Sub-Total ${category}`,
        '',
        '',
        '',
        '',
        '',
        categoryTotal,
      ]);
      totalRow.font = { bold: true };
      totalRow.getCell(8).numFmt = '"MZN"#,##0.00';
      worksheet.mergeCells(`A${totalRow.number}:C${totalRow.number}`);
      totalRow.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      rowIndex++;
    });
    // Trigger file download
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, 'Report.xlsx');
    });
  }
  calculateMonthlyDep(total_amount: any, dep_rate: any) {
    let months = 12;
    let monthly_dep = (total_amount * dep_rate) / months / 100;
    return monthly_dep;
  }
  getUsageMonthsInCurrentYear(acquisitionYear: any, acquisitionMonth: any) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const ackYear = Number(acquisitionYear);
    if (ackYear < currentYear) {
      return 12;
    } else if (ackYear === currentYear) {
      const usageMonths = 12 - acquisitionMonth;
      return usageMonths;
    } else {
      return 0;
    }
  }
  onCategoryChange() {
    if (this.selectedCategory) {
      this.gridApi.setQuickFilter('');
      this.gridApi.setFilterModel({
        asset_category_name: {
          filterType: 'set',
          values: [this.selectedCategory],
        },
      });
    } else {
      this.gridApi.setFilterModel(null);
    }
  }
}
