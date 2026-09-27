import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { AssetsubcategoryStatus } from './assetsubcategory-status/assetsubcategory-status';
import { AssetsubcategoryAction } from './assetsubcategory-action/assetsubcategory-action';
import { AssetsubcategoryDialog } from './assetsubcategory-dialog/assetsubcategory-dialog';

@Component({
  selector: 'app-asset-subcategory',
  templateUrl: './asset-subcategory.html',
  styleUrls: ['./asset-subcategory.scss'],
})
export class AssetSubcategory {
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
      field: 'asset_subcategory_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: AssetsubcategoryStatus,
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
      cellRenderer: AssetsubcategoryAction
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
      this.rowData = res.data;
    });
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.asset_subcategory_id;
    let val = event.newValue;
    let sta = event.data;

    if (val == event.data.asset_subcategory_name || val == event.data.status || val == event.data.asset_subcategory_id) {
      this._configurationalMasterService.assetSubcategoryEdit(id1, sta).subscribe(
        (res: any) => {
          this.toaster.success('Updated Successfully');
          this.reloadCurrentRoute();
        }, (err: any) => {
        });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(AssetsubcategoryDialog, {
      data: { subcategory: 'add_subcategory' },
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