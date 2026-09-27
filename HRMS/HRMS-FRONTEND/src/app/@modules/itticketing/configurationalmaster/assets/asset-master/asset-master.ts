import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { AssetMasterStatus } from './asset-master-status/asset-master-status';
import { AssetMasterAction } from './asset-master-action/asset-master-action';
import { AssetMasterDialog } from './asset-master-dialog/asset-master-dialog';

@Component({
  selector: 'app-asset-master',
  templateUrl: './asset-master.html',
  styleUrls: ['./asset-master.scss'],
})
export class AssetMaster {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  entity_Id: any;
  loginUser: any;
  assetCategoryList: any[] = []; // ⭐ ADD THIS
  assetSubcategoryList: any[] = [];
  assetMasterList: any[] = [];

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private toaster: ToastrService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.localStorage();
    this.getAssetCategoryList(); // ⭐ LOAD CATEGORIES FIRST
    this.getassetSubcategoryList();
    this.getAllAssetMaster();
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
  }

  // ⭐ ADD THIS METHOD
  getAssetCategoryList() {
    this._configurationalMasterService.getassetCategoryList(this.entity_Id).subscribe((res: any) => {
      this.assetCategoryList = res.data;
    });
  }

  public columnDefs = [
    {
      headerName: 'S.NO',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Asset Category',
      field: 'asset_category_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      // ⭐ ADD THIS VALUE GETTER
      valueGetter: (params: any) => {
        // If asset_category_name already exists in data, use it
        if (params.data?.asset_category_name) {
          return params.data.asset_category_name;
        }
        // Otherwise, find it from the category list
        const category = this.assetCategoryList.find(
          (cat: any) => cat.asset_category_id === params.data?.asset_category_id
        );
        return category ? category.asset_category_name : params.data?.asset_category_id;
      }
    },
    {
      headerName: 'Asset Subcategory',
      field: 'asset_subcategory_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      // ⭐ ADD THIS VALUE GETTER
      valueGetter: (params: any) => {
        // If asset_subcategory_name already exists in data, use it
        if (params.data?.asset_subcategory_name) {
          return params.data.asset_subcategory_name;
        }
        // Otherwise, find it from the subcategory list
        const subcategory = this.assetSubcategoryList.find(
          (cat: any) => cat.asset_subcategory_id === params.data?.asset_subcategory_id
        );
        return subcategory ? subcategory.asset_subcategory_name : params.data?.asset_subcategory_id;
      }
    },
    {
      headerName: 'Asset Name',
      field: 'asset_master_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Brand',
      field: 'brand',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Model',
      field: 'model',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Serial No.',
      field: 'serial_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Purchaase Date',
      field: 'purchase_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Purchaase Cost',
      field: 'purchase_cost',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Warranty End Date',
      field: 'warranty_end_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Remark',
      field: 'remark',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Assigned To',
      field: 'assigned_to',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 130,
      valueFormatter: (params: any) => {
        return params.value || 'N/A';
      }
    },
    {
      headerName: 'Current Status',
      field: 'current_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: AssetMasterStatus,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Action',
      flex: 1,
      minWidth: 150,
      cellRenderer: AssetMasterAction
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  getassetSubcategoryList() {
    this._configurationalMasterService.getassetSubcategoryList(this.entity_Id).subscribe((res: any) => {
      this.assetSubcategoryList = res.data;
    });
  }

  getAllAssetMaster() {
    this._configurationalMasterService.getAllAssetMaster(this.entity_Id).subscribe((res: any) => {
      this.rowData = res.data;
    });
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.asset_master_id;
    let val = event.newValue;
    let sta = event.data;

    if (val == event.data.asset_master_name || val == event.data.status || val == event.data.asset_master_id) {
      this._configurationalMasterService.assetMasterUpdate(id1, sta).subscribe(
        (res: any) => {
          this.toaster.success('Updated Successfully');
          this.reloadCurrentRoute();
        }, (err: any) => {
        });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(AssetMasterDialog, {
      data: { assetmaster: 'add_assetmaster' },
      width: '30%',
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
