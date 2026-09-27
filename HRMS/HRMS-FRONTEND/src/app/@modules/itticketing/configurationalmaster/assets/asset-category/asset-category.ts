import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { AssetcategoryStatus } from './assetcategory-status/assetcategory-status';
import { AssetcategoryAction } from './assetcategory-action/assetcategory-action';
import { AssetcategoryDialog } from './assetcategory-dialog/assetcategory-dialog';

@Component({
  selector: 'app-asset-category',
  templateUrl: './asset-category.html',
  styleUrls: ['./asset-category.scss'],
})
export class AssetCategory {
  errorMessage: any;
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  entity_Id: any;
  loginUser: any;

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
    this.localStorage()
    this._configurationalMasterService.getassetCategoryList(this.entity_Id).subscribe((params: any) => {
      this.rowData = params.data;
    });
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
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
      field: 'asset_category_name',
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
      cellRenderer: AssetcategoryStatus,
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
      // field: 'grade_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: AssetcategoryAction
      // cellRendererParams: {
      //   className: 'mat-blue',
      //   hideRequestButton: true,
      //   hideDetailsButton: false,
      //   hideDownloadIcon: false,
      //   showCustomIcon: false, // Hide attachment icon
      // },
    },
  ];
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
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
  getassetCategoryList() {
    this._configurationalMasterService.getassetCategoryList(this.entity_Id).subscribe((res: any) => {
      this.rowData = res.data;

    });
  }
  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.asset_category_id;
    let val = event.newValue;
    //  --------------- change on cell ------------------- 

    let sta = event.data;

    // 
    if (val == event.data.asset_category_name || val == event.data.status || val == event.data.asset_category_id) {
      this._configurationalMasterService.assetCategoryEdit(id1, sta).subscribe(
        (res: any) => {

          this.toaster.success('Updated Successfully')
          this.reloadCurrentRoute();
        }, (err: any) => {
        });
    }

  }
  openDialog() {
    const dialogRef = this.dialog.open(AssetcategoryDialog, {
      data: { category: 'add_category' },
      width: '30%',
    })
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
